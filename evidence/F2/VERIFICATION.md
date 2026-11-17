# F2 - Read-only collection verification

Date: 2026-11-17, Asia/Karachi. Implementation revision: `a4c63bb744201b6181ce41b70aee1b29c96563b4`, branch `feat/read-only-collection`, based on F1 revision `58fc39260867102a4463640743e51e5aebccd674`. Tests ran on the source subsequently committed at that implementation revision; evidence/status documents follow separately.

Environment: Windows, Node.js 24.21.0, npm 11.19.0; dependencies unchanged from F1. Synthetic fixtures are locally authored. Public smoke data comes from anonymous GET requests to cli/cli; no private repository, stored credential or customer data was used. UTC timestamps are preserved in the actual artifacts.

## Acceptance evidence

| Criterion | Result | Proof |
|---|---|---|
| F2-A1 | pass | [35-test results](./test-results.json): independent multi-page ID inventory, deduplication, exact half-open window and attempt/job identities. |
| F2-A2 | pass | Partial-rerun fixture preserves executions separately, excludes inherited jobs and refuses missing provider attempt identity. |
| F2-A3 | pass | Tests cover run/request/provider caps, 401/403/404, missing attempts, Retry-After, finite retries, interruption and safe diagnostics; [live CLI command](./public-cli-smoke-command.json) records partial exit 3. |
| F2-A4 | pass | CLI invalid-option/date tests; unknown schema rejection; strict projection; atomic write tests preserve existing valid data after validation, parent-path and rename failures. |
| F2-A5 | pass | Cache tests refresh inventory, invalidate changed attempt/window/repository, fall back after corruption, and refuse in-progress caching. |
| F2-A6 | pass | [Complete public snapshot](./public-verification-smoke.json) and [independent API cross-check](./public-final-identity-check.json): real run, attempt, commit and job identities match. An additional [capped snapshot](./public-cli-smoke.json) demonstrates partial coverage. |
| F2-A7 | pass | Production adapter test asserts GET, api.github.com origin, disabled redirects, and route allowlist; projection/redaction tests reject raw secret/log/source fields. Public cross-check records two GET requests. |

## Commands and actual results

From the project directory:

```text
npm.cmd run typecheck
npm.cmd test -- --reporter=json --outputFile=evidence/F2/test-results.json
npm.cmd run verify:package
node dist/cli/main.js collect --repo cli/cli --days 7 --max-runs 1 --max-requests 8 --out evidence/F2/public-cli-smoke.json --no-cache --anonymous
node scripts/verify-public-snapshot.mjs evidence/F2/public-cli-smoke.json evidence/F2/public-api-crosscheck.json
node dist/cli/main.js collect --repo cli/cli --from 2026-11-17T01:43:00Z --to 2026-11-17T01:44:00Z --max-runs 5 --max-requests 20 --out evidence/F2/public-verification-smoke.json --no-cache --anonymous
node scripts/verify-public-snapshot.mjs evidence/F2/public-verification-smoke.json evidence/F2/public-final-identity-check.json
```

Typecheck/build passed; 35 tests passed, 0 failed. See [typecheck transcript](./typecheck.txt) and [test/build transcript](./tests.txt). Package rehearsal passed its exact 14-file allowlist, offline clean-directory installation and installed-command checks: [nested results](./package-checks.json), [contents/hash](./package-contents.json). Final tarball SHA256: `95731e59ad272651ddf1551314cadf20aa37dcd71bbc5537b7744f1dbfc5970a`. The archive remains in ignored `.tmp/package-check-s2EoCA/`; committed small records make the result inspectable without committing generated binaries.

The capped public collection is intentionally partial (exit 3). The additional narrow-window collection exited 0 and reports complete coverage: window `[2026-11-17T01:43:00Z,2026-11-17T01:44:00Z)`, API version `2026-03-10`, 1 run, 1 attempt, 1 job, 6 steps and 4 collection requests. Two independent anonymous GETs at `2026-11-17T06:12:14.940Z` matched run `43997705765`, attempt 1, job `133753750178` and commit identity. See the [collection transcript](./public-verification-smoke.txt) and [verification transcript](./public-final-identity-check.txt), both exit 0. This establishes bounded API integration, not full repository history or CI savings. Provider retention and subsequent changes can affect reproduction.

## Failed checks and limits

A prior test run had one CLI startup timeout: [preserved failed report](./test-results-initial-resume.json), 32/33 passing. The file named `test-results-startup-timeout.json` actually contains a passing report. Collection dependencies are now loaded only when collect runs; the final standard test command passed all 35 assertions. [Regression-before results](./regression-before.json) independently reproduce two failures where unfinished empty attempts and missing job-attempt identity incorrectly allowed complete coverage; both now have passing regression assertions. No unrelated files were discarded.

One package execution was interrupted by an environment/runtime replacement before a complete result could be retrieved. The final approved rehearsal completed; no result is inferred for the interrupted execution. Git ownership changed from the sandbox account to the active user; subsequent Git commands use a verified exception for this repository path only, without changing global configuration.

Tests include complete synthetic collection and failure cases. The complete real sample is deliberately tiny; it is not evidence that a full high-volume/private collection works. Sandbox public DNS failed; approved read-only network execution produced the successful live checks. No Linux/macOS verification, authenticated private-repository test, live partial rerun, hosted CI, billing reconciliation, report generation, customer validation or measured savings is claimed. Public `public-smoke.json` is an earlier exploratory sample; the final verified live artifacts are the explicitly linked cli/cli files.

No remote exists; no push, actual PR, merge, package publication or deployment occurred. F2 is ready for local review. The next planned feature is F3 analysis.
