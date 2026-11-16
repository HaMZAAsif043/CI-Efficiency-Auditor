# F3 - Evidence-backed analysis

Status: planned. Dependencies: F2 schema. Completion evidence: none.

## Outcome and scope

Compute observed runner duration, additional-attempt duration and recurring setup-step findings. Implement pure functions using the metric/finding contracts in [ARCHITECTURE.md](../ARCHITECTURE.md). No dollar estimates or claims of confirmed flaky tests/avoidable waste.

## Acceptance criteria

- [ ] F3-A1: Independent hand calculations agree with runner/additional-attempt totals for multiple jobs, duplicate inputs, partial reruns and cancelled runs.
- [ ] F3-A2: Failed-then-successful signal requires observed earlier failure and later success on the same run/commit. Cancellation, a different commit and missing earlier data do not prove it.
- [ ] F3-A3: Setup matches include rule explanation, supporting jobs, aggregate duration, sample count and correct median; overrides work and post/teardown steps are excluded by default.
- [ ] F3-A4: Missing/invalid durations stay unknown with excluded counts; running jobs, empty snapshots and incomplete coverage do not manufacture zero-cost or improvement claims.
- [ ] F3-A5: Findings are deterministic and link supporting runs/jobs. Sorting metric is documented; overlapping totals are never added into a waste total.
- [ ] F3-A6: Parallel-job fixture shows separate runner sum and run elapsed duration. No output claims human waiting time or cash savings.

## Independent reference example

This example is **synthetic expected behavior**, not completed test evidence. Attempt 1 has two concurrent jobs lasting 120 and 60 seconds. Attempt 2 reruns only the failed 120-second job, taking 90 seconds. Observed runner duration is 270 seconds; additional-attempt duration is 90 seconds. Attempt 1's elapsed span is 120 seconds, not 180. A missing timestamp on another job makes coverage incomplete; it does not add a zero-duration job.

## Proof

Save fixture provenance, hand-calculation tables, actual test output and a generated analysis artifact. Include a misleading name match to demonstrate heuristic labeling. Do not copy implementation calculations into the expected-value oracle.
