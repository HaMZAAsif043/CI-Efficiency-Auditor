# Architecture and data contract

This is a proposed design. Resolve minor implementation details during the relevant work item and record material departures.

## Structure

```text
src/cli/          argument parsing, exit codes, user messages
src/github/       read-only API access, pagination, request budget, retry policy
src/snapshot/     schema validation, cache, snapshot read/write
src/analysis/     pure metrics and finding rules
src/report/       escaped HTML, Markdown, comparison output
test/fixtures/    synthetic or sanitized fixtures with provenance
docs/            future user/contributor documentation
```

Keep calculations independent of networking and rendering. Reuse them for future integrations. The CLI requires no hosted service. Use native fetch only when needed; avoid parallel GitHub clients. Choose a supported Node.js LTS version during F1 and verify the actual runtime/dependencies.

## Commands and exits

Proposed commands: `collect`, `report`, `compare`, plus `--help` and `--version`.

- `0`: requested artifact successfully produced with complete required inputs. Findings are not command failures.
- `1`: transport/unexpected processing/output failure; do not leave a success-looking artifact.
- `2`: invalid arguments, invalid schema, missing credentials, unsupported input.
- `3`: usable output produced, but collection/comparison is partial or materially limited. Put the reason in both artifact and console output.

A complete snapshot may validly contain zero runs. It must not manufacture findings. Treat incompatible comparisons as invalid input (2); comparisons lacking enough comparable data may produce a clearly limited artifact (3).

## Snapshot v1

Define a Zod schema and exported TypeScript types. Proposed fields:

| Field | Meaning |
|---|---|
| `schemaVersion` | Integer `1`; reject unknown versions with an actionable error. |
| `collectorVersion`, `collectedAt` | Tool version and UTC timestamp. |
| `repository` | Canonical owner/name; private metadata, not proof of permission to publish. |
| `window` | Half-open UTC interval `[from, to)` based on run creation time. |
| `coverage` | Completeness flag, reasons, request count, configured limits, returned run count. |
| `runs[]` | Run ID, workflow ID/name, commit SHA, branch, event, status/conclusion, created/start/end timestamps, maximum observed attempt, canonical run URL. |
| `attempts[]` | Run ID, attempt number, conclusion and available timestamps. |
| `jobs[]` | Job ID, run/attempt identity, name, runner labels, status/conclusion, start/end, URL and steps. |
| `steps[]` | Step number/name, status/conclusion and available start/end timestamps. |
| `diagnostics[]` | Missing fields/pages/attempts and other limitations; never raw tokens or API response dumps. |

Missing values remain unknown, not zero. Store no raw logs, environment variables, source code, webhook secrets, authorization headers, or full API payloads. Preserve only fields needed by the analysis. Report schema validation failures without echoing entire private inputs.

## Collection rules

- Default 30 days, allow 1-90 days, freeze `to` at collection start. Filter exact timestamps after API filtering.
- Initial limits: 500 runs and 2,000 API requests per invocation, including retries. Limits are visible in snapshot metadata; raising them must be deliberate.
- Follow pagination; account for provider search caps. Deduplicate runs/jobs by stable identity before calculation.
- Collect available jobs for each run attempt, including partial reruns. Verify API semantics using fixtures and a real smoke run. Avoid synthesizing re-execution for jobs skipped during a partial rerun.
- Use bounded concurrency (initial maximum 3). Honor rate-limit responses and Retry-After; finite retries, at most 2 per request. Stop with partial output when safely recoverable data remains.
- Never retry authorization failures blindly. Never fall back to collecting less data while reporting completeness.
- Write output atomically. Cache keys include repository, request parameters, schema version and attempt identity. Reuse immutable completed attempts only; refresh recent run status and completed attempts when the run's observed attempt count changes. Record cache use and age.
- Initial authentication: an existing environment token; document fine-grained Actions read permission and do not write credentials. Anonymous public access may work with lower limits.

GitHub's [run API](https://docs.github.com/en/rest/actions/workflow-runs) and [job-attempt API](https://docs.github.com/en/rest/actions/workflow-jobs) are implementation references. Recheck current semantics when implementing.

## Metric definitions

**Observed runner duration:** sum of nonnegative job end minus start durations, once per distinct observed execution. Exclude missing or invalid durations from the numeric sum and disclose excluded counts. This is not CPU utilization, billable rounded time, or elapsed developer waiting time.

**Additional-attempt duration:** observed runner duration for attempts numbered greater than 1. Show both all additional attempts and the subset of runs that ultimately succeeded after an earlier failed attempt. This is overhead associated with retries, not proven avoidable waste or test flakiness. Preserve failed/cancelled/running distinctions. Cancellations alone are not failed-then-succeeded evidence.

**Setup-step duration:** aggregate observed duration of steps matched by documented conservative name rules or user overrides. Identify the rule, sample count, aggregate duration, median, and supporting jobs. Exclude teardown/post steps by default. Name matches are heuristics; time spent installing dependencies is not automatically recoverable.

**Run elapsed duration:** if complete start/end data exists, report it separately per run; never equate summed parallel-job minutes to elapsed minutes. Do not estimate human waiting time.

**Coverage:** state missing attempts/jobs/durations, running jobs, caps, and errors. Label totals as observed lower bounds where appropriate. Never rank an incomplete period as a demonstrated improvement.

## Finding contract

Each finding has a stable rule ID, title, measured values/units, evidence run/job references, scope, confidence label (`observed` or `heuristic`), limitations, and a suggested investigation. Suggested changes never count as completed fixes or measured savings. Sorting uses an explicit metric and does not sum overlapping finding totals into a supposed waste total.

## Comparison rules

Require matching repository and schema. Group by workflow identity, job name, runner-label set, event, and branch. Treat groups that changed shape as unmatched. Display window lengths, sample counts, medians, observed totals, and coverage.

Use at least 5 duration samples on each side before presenting a median percentage change as a comparison; otherwise label insufficient data. This threshold is a product convention, not statistical significance. Handle a zero baseline without division. Unequal windows require per-run statistics; do not present aggregate reduction as savings. Even matched before/after observations do not establish causation.

## Output safety

Escape every provider/user string in HTML and Markdown contexts. HTML is self-contained with no remote assets or executable content. Build evidence links from known GitHub host plus validated numeric identifiers or validated canonical URLs; reject script schemes and unexpected hosts. Do not embed credentials in URLs. Any private report sharing is a user's deliberate action.
