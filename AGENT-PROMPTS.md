# Prompts for continuing the project

These prompts reference the plan; they do not claim the features have been implemented. Run them from this project folder so the agent reads its local instructions. Actual tool permissions still apply.

## Start the first implementation

```text
Read AGENTS.md, HANDOFF.md, ROADMAP.md, ARCHITECTURE.md, VERIFICATION.md and the F1 card.
Implement F1 only, including independent repository setup if it does not already exist.
Inspect actual state first and preserve unrelated work. Create a task branch before source edits.
Create a work item, implement the complete acceptance scope, run appropriate checks,
and save actual commands/results and artifact references under evidence/F1/.
Update the feature card, roadmap and handoff. Follow the branch/PR workflow where a
remote and authentication exist; record unavailable publication honestly.
Do not start F2 or publish a package. Never mark an unrun check as passed.
```

## Continue a feature

```text
Read the project instructions and current handoff. Work on F2 only after checking
its real dependencies and existing branch/work item. Complete its acceptance criteria,
including the real read-only API smoke check when available. Save reproducible proof
mapped to every acceptance ID. Record failures and unavailable checks without claiming
verification. Update the feature card, roadmap, work item and handoff for the next agent.
```

Replace F2 with the requested feature. Do not assume that an earlier feature is verified merely because it appears before this one in the roadmap.

## Independently review claimed completion

```text
Review F3 against its acceptance criteria and VERIFICATION.md. Inspect the actual
revision and artifacts; reproduce appropriate checks. Verify independent expected
calculations and failure cases, not just test names. Report each criterion as pass,
fail or not_run with evidence. Correct unsupported status claims in the work item,
feature card, roadmap and handoff. Do not expand feature scope or fabricate missing proof.
```

## Resume after interruption

```text
Read AGENTS.md and HANDOFF.md, then inspect the actual worktree, branch, latest work
item and evidence. Reconcile stale status with observed files/revisions. Resume the
same authorized task, preserving unrelated edits. Finish pending verification and
leave a precise handoff. Ask only for missing information that prevents safe progress.
```

## Documentation integrity check

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\verify-plan.ps1
```

This checks the planning package's local links and acceptance-card structure. It does not run or validate the planned application.
