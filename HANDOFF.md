# Current handoff

Updated: 2026-11-17 (Asia/Karachi).

## Active request

F1 is complete. The user requested continuation during its evidence handoff; proceed with F2 after committing these records.

## Observed state

- Independent repository. Local main: initial planning commit 312d01309ca374abc05ddb1514c88e4e7588efd9.
- Task branch: feat/cli-foundation. Verified application revision: 105ffb4377591cae6046e946ec0795b5031a4de3.
- F1 is verified and ready for review: [actual evidence](./evidence/F1/VERIFICATION.md).
- Node.js 24.21.0/npm 11.19.0; clean install, typecheck/build, 14 CLI tests and packed-install/shim checks passed on Windows.
- A repeated sandbox offline install timed out; an approved retry passed with the same package hash. Evidence preserves the failure and limitations.
- No remote, push, actual PR, merge, public package or deployment. [Prepared PR text](./work-items/F1-PR.md) is local only.
- No Linux/macOS verification, GitHub collection or customer validation. MarkItDown applications were not edited.

## Next action

Commit F1 evidence/status documents, inspect the clean tree, then create feat/read-only-collection from the completed F1 revision. It is a stacked local branch because no remote/default-branch integration exists. Record its exact base in the F2 work item.

Read [F2](./features/F2-read-only-collection.md), ARCHITECTURE and VERIFICATION. Implement bounded read-only collection, validated snapshots, explicit coverage, safe caching/output and actual verification. An anonymous public repository can supply the live smoke check; do not inspect stored credentials to discover whether they exist.

Use [AGENTS.md](./AGENTS.md) and [VERIFICATION.md](./VERIFICATION.md); preserve prior evidence and distinguish source revisions, engineering proof, publication and customer validation.
