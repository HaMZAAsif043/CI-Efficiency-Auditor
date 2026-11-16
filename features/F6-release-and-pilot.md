# F6 - Release rehearsal and pilot readiness

Status: planned. Dependencies: F1-F5. Completion evidence: none.

## Outcome and scope

A new contributor can reproduce the complete local workflow and a pilot user can evaluate a useful report. Prepare release materials and test installation without implying package publication has happened.

## Acceptance criteria

- [ ] F6-A1: Clean-directory packed installation completes collect/report/compare using the documented commands; synthetic and live/permissioned parts are explicitly distinguished.
- [ ] F6-A2: Typecheck, meaningful tests, build and executable/package checks pass on Windows, Linux and macOS through observed local runs or actual CI runs. Record untested platforms honestly.
- [ ] F6-A3: README, runtime support, permissions, data handling, limitations, contributor/security guides, actual license and sample report match the implementation.
- [ ] F6-A4: Prepared release notes, issue/PR templates and a pilot checklist exist; packed artifacts contain no private data, tokens or unintended files.
- [ ] F6-A5: At least one other person or an isolated clean environment reproduces the quick start; record which kind of rehearsal occurred. External pilot feedback remains a separate F0 research result.
- [ ] F6-A6: Handoff identifies exact revision/package hash, checks, remaining limitations and whether a repository/PR/package was actually published. Publication is not required for this rehearsal criterion.

## Proof

Save exact install and end-to-end commands, package content/hash, generated artifacts, platform CI URLs/results, and observed rehearsal notes. Green CI on one platform does not establish the others. Package publishing, merging, deployment and external outreach require the relevant user authorization.

## Pilot checklist

Confirm permission/data boundary, compare with native metrics, review no more than three top findings, choose one useful action, and agree how to evaluate the follow-up. Record negative feedback as well as useful findings.
