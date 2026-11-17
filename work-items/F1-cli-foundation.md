# F1 - CLI foundation

Status: in_progress
Feature card: [F1](../features/F1-cli-foundation.md)
Started: 2026-11-17 (Asia/Karachi)
Repository: this project folder; branch `feat/cli-foundation`.
Base: `312d01309ca374abc05ddb1514c88e4e7588efd9` (initial planning commit on local `main`).

## Requested outcome and authorization

The user said "go ahead" after the proposed next task was F1. Implement the CLI foundation and its verification, not the entire MVP. Independent Git initialization and a feature branch are included. No remote exists; no remote repository or package publication is assumed.

## Scope and verification plan

| Acceptance ID | Planned verification |
|---|---|
| F1-A1 | Clean npm install, locked dependencies, typecheck/build, actual CLI-process tests. |
| F1-A2 | Built and packed executable help/version, manifest consistency. |
| F1-A3 | Unknown commands/options and unavailable commands return exit 2 without writing artifacts. |
| F1-A4 | Pack allowlist, content inspection, hash and clean temporary installation/executable shim. |
| F1-A5 | Actual quick start, runtime, license, scripts and explicit command limitations. |

## Implementation record

Node.js 24.x chosen against the installed 24.21.0 runtime and registry engine metadata. Registry dependencies were checked through approved network access after sandbox EACCES. Use npm.cmd on PowerShell without changing execution policy. The initial unbounded registry probe was interrupted after EACCES; subsequent probes have finite network timeouts.

No GitHub data collection, analysis, report generation, package publication or customer validation is implemented in F1.

## Verification and handoff

Pending actual checks. Record results before marking verified.
