# Current handoff

Updated: 2026-11-17 (Asia/Karachi).

## Latest delivery — launch kit

The user's request for a landing page/demo videos is implemented on `feat/launch-kit`, based on main revision `0331a8b4fd466ae01d5f58e57f793ea77fb473ca`. [M1 evidence](./evidence/M1/VERIFICATION.md) records desktop/mobile checks, two actual silent WebM clips, copy/download behavior and final media playback. [Launch copy](./marketing/LAUNCH.md) remains draft; no outreach or public social posts were sent.

The Sites landing page was deployed successfully at https://ci-efficiency-auditor.dancingoats.chatgpt.site with owner-private access preserved. Its source is separately managed in the sibling ci-auditor-site checkout (project appgprj_6afbf436c5fc819198c290bde0d5f3dd, source commit 9c205f0c7b42a79961c59e2f5e21b6ee1bf72006). Static files/assets are mirrored under marketing/site/ for GitHub review. Do not copy Site Git metadata, credentials or transient files into this repository.

Next: review the launch PR and preview. Public Site access requires the user to request that audience change. Future product implementation still starts with F3 on a separate task branch. CLI behavior/dependencies are unchanged by this launch work.

## Completed authorized work

F1 CLI foundation and F2 read-only collection are verified and published to the user's requested GitHub main branch. Initial pushed revision: bf1ece5. F2 source revision: a4c63bb744201b6181ce41b70aee1b29c96563b4; evidence/status documentation followed separately. Original task branches remain local.

- [F1 proof](./evidence/F1/VERIFICATION.md): 14 tests and original packed-executable verification.
- [F2 proof](./evidence/F2/VERIFICATION.md): typecheck/build, 35 passing tests, final 14-file packed installation and installed-command checks.
- Final narrow-window anonymous public collection: 1 run, 1 attempt, 1 job, 6 steps, 4 requests; complete coverage and exit 0. Two independent GETs confirmed run/attempt/commit/job identities. An additional one-run-capped collection correctly exits 3 with partial coverage.
- Actual CLI docs: [docs/CLI.md](./docs/CLI.md). Analysis/report/compare are not implemented.
- Source is committed. Generated packages/dependencies/cache stay ignored; small public/synthetic evidence is committed separately.

## Limits and publication

Origin: https://github.com/HaMZAAsif043/CI-Efficiency-Auditor.git. The user explicitly requested publishing the completed project to main; local main was fast-forwarded to the completed feature history and pushed successfully with upstream origin/main. No force push was used. No PR, npm publication or deployment occurred. Historical feature evidence records describe the state when they were written; this handoff records the later repository publication.

Windows was verified; Linux/macOS, private repository authentication, customer validation and savings remain unverified. One earlier CLI startup test timed out; collector imports were deferred and all 35 tests then passed. Runtime replacement interrupted an earlier package execution; the final rehearsal succeeded. Preserve failed artifacts and their context.

After the environment account changed, Git required a per-command safe.directory exception scoped to D:/dev/personal/experiment/ci-efficiency-auditor. Ownership was inspected; do not disable ownership checks globally. Verify current state each time.

## Exact next action

Read [F3](./features/F3-evidence-backed-analysis.md), ARCHITECTURE and VERIFICATION. For the next requested implementation task, inspect the tree, fetch origin/main, and create feat/evidence-backed-analysis from the current main base, recording its exact revision. Resume the normal task-branch and draft-PR workflow. Implement independent metric calculations and proof without claiming retry time is avoidable waste or confirmed test flakiness.

[AGENTS.md](./AGENTS.md) and the [roadmap](./ROADMAP.md) remain the entry points. Neighboring MarkItDown projects were not edited.
