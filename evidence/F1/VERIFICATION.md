# F1 - CLI foundation verification

Recorded: 2026-11-17 (Asia/Karachi date context).
Verified implementation revision: `105ffb4377591cae6046e946ec0795b5031a4de3`.
Branch: `feat/cli-foundation`; base: `312d01309ca374abc05ddb1514c88e4e7588efd9`.
Checks ran on source subsequently committed at that implementation revision. Evidence/status documents are a separate follow-up commit; no application-source changes followed the checks.

Environment: Windows NT 10.0.26300.0, Node.js 24.21.0, npm 11.19.0, Git 2.55.0.windows.5. Exact locked dependencies: Commander 15.1.0, Octokit 5.0.5, Zod 4.6.7, TypeScript 7.0.2, Vitest 5.1.0, @types/node 24.19.2.

Input provenance: locally authored CLI arguments and synthetic temporary directories. No customer data, credentials or GitHub history were used. Reporter timestamps and assertion results are preserved in the JSON test artifact.

## Acceptance mapping

| Criterion | Result | Direct evidence |
|---|---|---|
| F1-A1 | pass | [Clean install](./clean-install.txt), [typecheck](./typecheck.txt), [test/build transcript](./tests.txt), [14/14 passing assertions](./test-results.json). |
| F1-A2 | pass | [Installed-command checks](./package-checks.json): help/version exit 0, version 0.1.0; process tests cover no-argument and subcommand help. |
| F1-A3 | pass | JSON tests cover unknown command/option, excess arguments, three unavailable commands and no scratch files; installed checks independently confirm collect/bogus-option exit 2. |
| F1-A4 | pass | [Contents and hash](./package-contents.json): exact seven-file allowlist, offline clean-directory installation, npm-created executable shim and successful invocations. |
| F1-A5 | pass | Reviewed README, CLI reference, CONTRIBUTING, manifest engine/scripts, LICENSE/NOTICE and actual output for consistency. Publication limitations are explicit. |

## Actual commands and outcomes

Working directory: `D:\dev\personal\experiment\ci-efficiency-auditor`.

```text
npm.cmd ci --offline --ignore-scripts --no-audit --no-fund
npm.cmd run typecheck
npm.cmd test -- --reporter=json --outputFile=evidence/F1/test-results.json
npm.cmd run verify:package
git diff --cached --check
```

Clean installation added 104 packages, exit 0. Typecheck exited 0. Tests built the sources and reported 14 passing, 0 failing, success true. Staged whitespace check exited 0. The package checker runs prepack typecheck/build, `npm pack --json`, offline local tarball installation with lifecycle scripts disabled, then `npm exec --offline -- ci-audit` for help/version/collect/bogus-option checks. Nested commands/statuses/stdout/stderr are preserved in `package-checks.json`.

Actual successful output from the approved retry:

```text
PASS: exact package allowlist (7 files), offline clean installation and executable shim.
SHA256: 895387e477887e50fc92895e0a14824431a605f78053f15b728a8ae3d31e71a7
Evidence scratch directory: D:\dev\personal\experiment\ci-efficiency-auditor\.tmp\package-check-N0dvPW
```

The archive remains local in ignored `.tmp/`; committed records identify its contents/hash. Reproduce with the checker rather than assuming ignored files are available. Files: LICENSE, NOTICE, README.md, dist/cli/main.js, dist/cli/program.js, docs/CLI.md, package.json. The allowlist excludes evidence, private snapshots, development dependencies and planning files. Runtime dependencies are installed separately, not bundled.

## Failures and limits

- PowerShell blocked `npm.ps1`; `npm.cmd` worked without changing policy.
- Initial registry access failed with sandbox EACCES; approved network access was used. The first install then hit a registry idle timeout; retrying with five connections succeeded.
- The first package rehearsal succeeded inside the sandbox. A later repeat timed out in its nested offline install and the tool runtime was replaced: [failed checks](./package-checks-sandbox-timeout.json), [failed transcript](./package-rehearsal-sandbox-timeout.txt). An approved retry outside the sandbox passed with the same SHA256. The timeout's precise cause is unconfirmed; this managed environment may need that supported execution path.
- Git warned about an inaccessible user-level ignore file. Local ignore rules work and the staged diff contained no generated directories.
- No Linux/macOS runs or hosted CI; cross-platform release proof remains F6.
- No collection, analysis, reports, savings, interviews or customer validation. Octokit/Zod are installed for later features but not invoked by this executable.
- No remote, push, actual PR, merge, package publication or deployment. [PR text](../../work-items/F1-PR.md) is prepared locally.

F1 is verified and ready for local review, not released. Next engineering task is F2; recheck Git state and use a new feature branch when requested.
