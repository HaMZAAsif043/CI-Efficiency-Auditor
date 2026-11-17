# Establish the typed CLI and package verification foundation

The project previously contained planning documents only. This adds a runnable `ci-audit` executable with help/version, actionable argument errors, and explicit unavailable responses for collect/report/compare. It makes no GitHub requests or audit artifacts.

The Node.js 24.x/TypeScript foundation includes exact dependencies, a lockfile, Apache-2.0 licensing, contributor instructions, process-level tests and an offline package rehearsal that inspects the seven-file archive allowlist and invokes the installed command.

Validation: clean lockfile installation, typecheck/build, 14 passing tests and packed-install checks. [Acceptance evidence](../evidence/F1/VERIFICATION.md) includes actual results, contents and SHA256. One repeated sandbox package install timed out; an approved retry outside the sandbox passed with the same archive. Windows was checked; Linux/macOS remain unverified.

See [the work item](./F1-cli-foundation.md). Collection and reporting remain future work. No remote or actual PR exists; this is prepared PR text.
