# Current handoff

Updated: 2026-11-17 (Asia/Karachi).

## Completed authorized work

F1 CLI foundation and F2 read-only collection are verified and ready for local review. Current branch: feat/read-only-collection, stacked on F1 base 58fc39260867102a4463640743e51e5aebccd674. F2 source revision: a4c63bb744201b6181ce41b70aee1b29c96563b4. Evidence/status documentation follows in its own commit.

- [F1 proof](./evidence/F1/VERIFICATION.md): 14 tests and original packed-executable verification.
- [F2 proof](./evidence/F2/VERIFICATION.md): typecheck/build, 35 passing tests, final 14-file packed installation and installed-command checks.
- Final narrow-window anonymous public collection: 1 run, 1 attempt, 1 job, 6 steps, 4 requests; complete coverage and exit 0. Two independent GETs confirmed run/attempt/commit/job identities. An additional one-run-capped collection correctly exits 3 with partial coverage.
- Actual CLI docs: [docs/CLI.md](./docs/CLI.md). Analysis/report/compare are not implemented.
- Source is committed. Generated packages/dependencies/cache stay ignored; small public/synthetic evidence is committed separately.

## Limits and publication

No remote, push, actual PR, merge, package publication or deployment exists. [F2 PR text](./work-items/F2-PR.md) is prepared. Local main remains the initial planning commit; features are on stacked task branches.

Windows was verified; Linux/macOS, private repository authentication, customer validation and savings remain unverified. One earlier CLI startup test timed out; collector imports were deferred and all 35 tests then passed. Runtime replacement interrupted an earlier package execution; the final rehearsal succeeded. Preserve failed artifacts and their context.

After the environment account changed, Git required a per-command safe.directory exception scoped to D:/dev/personal/experiment/ci-efficiency-auditor. Ownership was inspected; do not disable ownership checks globally. Verify current state each time.

## Exact next action

Read [F3](./features/F3-evidence-backed-analysis.md), ARCHITECTURE and VERIFICATION. For the next requested implementation task, inspect the clean tree and create feat/evidence-backed-analysis from this completed branch, recording its exact base. Implement independent metric calculations and proof without claiming retry time is avoidable waste or confirmed test flakiness.

[AGENTS.md](./AGENTS.md) and the [roadmap](./ROADMAP.md) remain the entry points. Neighboring MarkItDown projects were not edited.
