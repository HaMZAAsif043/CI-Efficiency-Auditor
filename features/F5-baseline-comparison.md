# F5 - Baseline comparison

Status: planned. Dependencies: F3/F4. Completion evidence: none.

## Outcome and scope

Compare two snapshots conservatively, showing observed changes for comparable groups. Apply the grouping, minimum sample and unknown-data rules in [ARCHITECTURE.md](../ARCHITECTURE.md).

## Acceptance criteria

- [ ] F5-A1: Matching groups show correct sample counts, medians, absolute deltas and percentages against independently calculated values.
- [ ] F5-A2: Repository/schema mismatch fails clearly. Runner-label/event/branch/job-shape changes are unmatched groups, not attributed improvements.
- [ ] F5-A3: Unequal windows show per-run measures; total reduction is not described as savings. Low sample counts and zero baselines have explicit behavior without invalid percentages.
- [ ] F5-A4: Missing coverage/durations and running jobs remain visible; limited comparisons exit 3 and cannot claim demonstrated improvement from incomplete totals.
- [ ] F5-A5: Report states this is observational, lists recorded intervention/context changes when provided, and never asserts causation or dollar savings.

## Proof

Save before/after synthetic fixtures, independent expected-value table, complete and limited comparison artifacts, command/exit transcripts and mismatch failures. If demonstrating a real intervention, record commit/date, workload/runner changes and permissions; synthetic differences are not customer outcomes.
