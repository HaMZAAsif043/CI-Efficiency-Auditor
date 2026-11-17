# Feature roadmap

All statuses below describe engineering/research work, not publication or revenue.

| ID | Deliverable | Depends on | Status | Completion evidence |
|---|---|---|---|---|
| [F0](./features/F0-demand-validation.md) | Demand and buyer validation | People/data access | planned | None |
| [F1](./features/F1-cli-foundation.md) | Runnable CLI foundation | None | ready_for_review | [Verified evidence](./evidence/F1/VERIFICATION.md) |
| [F2](./features/F2-read-only-collection.md) | Bounded collection and snapshots | F1 | in_progress | [Work item](./work-items/F2-read-only-collection.md) |
| [F3](./features/F3-evidence-backed-analysis.md) | Correct, explainable findings | F2 schema | planned | None |
| [F4](./features/F4-local-reports.md) | Useful local reports | F3 | planned | None |
| [F5](./features/F5-baseline-comparison.md) | Conservative snapshot comparison | F3/F4 | planned | None |
| [F6](./features/F6-release-and-pilot.md) | Installation and pilot rehearsal | F1-F5 | planned | None |

## Status rules

`planned -> in_progress -> implemented -> verified -> ready_for_review`

- `implemented`: code exists; acceptance may still be unproven.
- `verified`: all required acceptance criteria have inspected proof. Incomplete external checks remain disclosed and prevent claiming their criteria passed.
- `ready_for_review`: verified changes plus a reviewable diff/branch and handoff; publication may be unavailable.
- `blocked`: annotate the affected task with the exact dependency and next action; continue unrelated authorized work.
- `merged`, `released`, and customer validation belong in separate fields and require direct evidence of those events.

Update the feature card and this table together. Link real evidence files when available. Do not tick acceptance boxes in advance or use the synthetic examples as completion evidence.

## Later backlog, not authorized MVP work

| Idea | Evidence needed before prioritizing |
|---|---|
| Scheduled GitHub Action wrapper | Several users want automatic repeated reports; least-privilege design verified. |
| Multiple-repository report | Agencies demonstrate a recurring cross-repository workflow. |
| Paid hosted history/alerts | Repeated active use and buyers willing to pay for ongoing reporting. |
| Billing CSV/API support | Users need actual cost reconciliation and can provide permissioned exports. |
| Renovate-specific analysis | Pilot evidence of dependency-update traffic as a significant intervention opportunity. |
| Agent skill/MCP wrapper | Existing CLI users need agent access; core output and errors are stable. |
