# F1 - CLI foundation

Status: planned. Dependencies: none. Completion evidence: none.

## Outcome and scope

A contributor can install dependencies, build, test and execute a packaged CLI. Establish an independent repository when implementation is authorized; inspect actual Git state first.

Choose and lock supported Node.js/dependency versions. Configure TypeScript, Octokit, Commander, Zod and Vitest. Define `typecheck`, `build`, and `test` scripts and an npm `bin`. Keep commands without implemented behavior explicitly unavailable, with a nonzero exit; no fabricated reports. Add Apache-2.0 licensing with actual ownership details and a minimal contributor quick start.

## Acceptance criteria

- [ ] F1-A1: Clean dependency install, typecheck, build and meaningful CLI argument/error tests pass using the committed lockfile.
- [ ] F1-A2: Built CLI `--help` and `--version` exit 0 and accurately describe available behavior.
- [ ] F1-A3: Unknown commands/invalid flags exit 2 with an actionable message; unimplemented commands cannot report success.
- [ ] F1-A4: `npm pack` produces a package whose executable runs in a clean temporary directory; inspect package contents for secrets, private metadata and unrelated files.
- [ ] F1-A5: README documents actual runtime, scripts, command state and setup; manifest/license metadata agree.

## Proof

Save exact commands, runtime/package versions, exit codes, package-content listing, and clean-directory help/version output. A successful TypeScript build alone is insufficient. This rehearsal is not npm publication.

## Excluded

Network collection, dashboards, backend services, hosted accounts and package publication.
