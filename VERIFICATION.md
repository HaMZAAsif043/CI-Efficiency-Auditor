# Proof of completion

## What counts

An acceptance criterion passes when a reviewer can reproduce it or inspect direct evidence tied to a specific revision. A statement that an agent ran a check is insufficient without its command, result, and observed behavior. Build success alone does not establish feature correctness.

Use [templates/EVIDENCE.md](./templates/EVIDENCE.md). Save records under `evidence/<feature-id>/` and link them from the feature card and roadmap. Keep private inputs out of the repository; record access limitations rather than claiming public reproducibility for private evidence.

## Required evidence record

- Feature and acceptance IDs; date/time/timezone; exact revision, plus whether there were uncommitted changes.
- OS, runtime and relevant dependency versions.
- Fixture provenance: synthetic, sanitized real, or permissioned live; describe transformations that affect behavior.
- Exact reproduction commands, expected outcome, actual outcome, exit codes, and artifact paths or CI run URLs.
- A criterion-to-evidence table with `pass`, `fail`, or `not_run`. A screenshot can support a report UI observation but does not prove calculation correctness.
- Limitations, existing failures, excluded input, and the exact next action.

Do not record secret values. A transcript containing a token must be replaced with a sanitized copy before committing; explain sanitization. A hash can identify an artifact but cannot establish that the artifact is correct.

## Appropriate verification by feature

| Feature | Necessary proof |
|---|---|
| F0 | Dated, permissioned interview/report-review/payment records. Interest and invoices are distinct from settled payment. |
| F1 | Actual help/version/error invocations; clean typecheck/build; runnable packed CLI. |
| F2 | Multi-page/partial-rerun/limit/auth cases and one real public or permissioned repository smoke collection. Real API verification remains pending if unavailable. |
| F3 | Independently hand-calculated fixture totals; parallel jobs, incomplete data and misleading heuristics covered. |
| F4 | Generated HTML/Markdown from real code; hostile-string output inspection; browser inspection of readability and evidence links. |
| F5 | Matched and unmatched snapshots, low sample count, zero baseline and unequal-window behavior, verified against expected calculations. |
| F6 | Clean-directory packed-install rehearsal, cross-platform checks, full documented workflow and accurate release state. |

Use mocked API fixtures for deterministic regression tests; they do not replace the live smoke requirement for F2. Network tests should be explicit and optional in routine CI. Never assert a third party currently has a bug based only on synthetic fixtures.

## Examples of invalid claims

- "Saved 40%" from a heuristic recommending caching.
- "Flaky tests found" because a workflow passed on a rerun.
- "Customer validated" because another product has paid tiers.
- "Works on Windows" because Linux CI passed.
- "Released" because `npm pack` succeeded.
- "Verified" when a required acceptance criterion is still `not_run`.

## Completion checklist

- [ ] All required acceptance IDs have inspected passing evidence.
- [ ] Correctness tests use independent expected values and relevant failure cases.
- [ ] Documentation/examples match observed behavior.
- [ ] Generated output handles private metadata and untrusted strings appropriately.
- [ ] Feature card, roadmap, evidence, work item and handoff agree.
- [ ] Publication and customer-validation status are stated separately.

This unchecked checklist is a reusable contract, not an assertion about current completion.
