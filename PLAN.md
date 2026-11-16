# Product and execution plan

## User and buyer

Initial users: developers and tech leads at small software teams or agencies with multiple active GitHub repositories. Buyer hypothesis: an engineering manager, founder, or agency owner who pays for CI or loses engineering time investigating unreliable builds.

Problem hypothesis: existing metrics show activity, but turning that activity into a prioritized improvement and checking the result still takes manual work. This hypothesis needs direct validation; native metrics and competing products already exist.

## Useful outcome

A developer collects one repository's recent history and receives a short report answering:

- Where did additional attempts consume runner time?
- Which recurring setup steps account for substantial aggregate duration?
- Which runs support those statements?
- What should be investigated first, and what evidence would establish an improvement?

Success means a user takes a useful action based on a trustworthy finding. Producing many warnings is not a success metric.

## MVP boundaries

Include bounded read-only collection, an inspectable versioned snapshot, deterministic analysis, HTML/Markdown reports, a conservative before/after comparison, and reproducible installation.

Defer automatic edits, billing integration, raw log parsing, test-level flaky-test detection, AI diagnosis, multi-repository dashboards, alerts, SaaS accounts, other CI providers, and skills/MCP wrappers. Revisit with an explicit user request or evidence of a repeated need.

## Effort and sequence

These are planning estimates for a developer familiar with TypeScript, not promises. Discovery runs alongside authorized engineering when possible.

| Work | Estimate | Dependency |
|---|---:|---|
| F0 demand validation | 1-2 calendar weeks of outreach/reviews | Access to people and permissioned data |
| F1 CLI foundation | 4-6 hours | None |
| F2 collection | 10-14 hours | F1 |
| F3 analysis | 8-12 hours | F2 schema; synthetic fixtures allow early work |
| F4 reports | 6-8 hours | F3 |
| F5 comparisons | 6-8 hours | F3/F4 |
| F6 release rehearsal and pilot readiness | 6-10 hours | F1-F5 |

Total engineering estimate: 40-58 focused hours. API quirks, unfamiliar tooling, and pilot findings may expand it. Re-estimate after F2. Do not add a backend during bootstrap.

## Prioritization decisions

Continue toward a commercial offer if three teams review reports, two act on a finding, and one pays for an audit or implementation. These are proposed decision thresholds, not observed results or statistical proof of market size.

If users obtain the same benefit from native GitHub metrics, refine the actionable report or stop expanding the product. If demand is occasional, retain an OSS tool plus services model. Build hosted recurring reporting only when repeated use and purchasing conversations support it.

## Main risks and responses

| Risk | Response |
|---|---|
| Report duplicates native dashboards | Compare against what pilot users already do; demand a distinct useful action. |
| API calls grow rapidly | Bounded run/request limits, caching, explicit completeness metadata, no silent sampling. |
| Inaccurate cost or savings claims | MVP reports measured duration only; keep possible improvements separate. |
| Partial reruns double-count consumption | Preserve attempt/job identity; calculate from observed jobs; disclose missing attempts. |
| Setup heuristics misclassify work | Show matching rule, allow overrides, label heuristic, never promise cache savings. |
| Private metadata leaks | Local output, minimal collection, sanitized evidence, escaped reports. |
| Support overwhelms side-project time | Fixed audit scope, no early uptime commitment, publicly documented support limits. |
