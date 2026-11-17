# Evidence register

Feature verification records are listed below. A planning-document check establishes only documentation integrity, not application functionality.

When a feature is implemented, create a subdirectory such as `F2/`, then a dated evidence record from [the template](../templates/EVIDENCE.md). Link real artifacts and criterion IDs. Prefer synthetic or sanitized small artifacts; do not commit real private snapshots, secrets or oversized test outputs.

## Register

| Feature | Evidence | Status |
|---|---|---|
| F1 | [2026-11-17 verification](./F1/VERIFICATION.md) | Verified locally on Windows; ready for review |
| F2 | [2026-11-17 verification](./F2/VERIFICATION.md) | 35 tests, packed install and independent public API checks; partial live coverage |
| F0, F3-F6 | None | Not implemented/validated |
| Planning package | [2026-11-16 check](./planning-2026-11-16.md) | Local document structure checked; no application proof |

Use relative links to artifacts that actually exist. Do not prepopulate plausible run output. Preserve earlier evidence when revisions change; state which revision a record verifies and rerun affected checks as needed.
