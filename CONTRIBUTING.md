# Contributing

Use Node.js 24.x; the first verified runtime is 24.21.0 with npm 11.19.0. Exact dependencies are recorded in `package-lock.json`. Read [AGENTS.md](./AGENTS.md), [HANDOFF.md](./HANDOFF.md) and the chosen [feature](./features/README.md) before changing behavior.

```text
npm ci
npm run typecheck
npm test
npm run verify:package
```

On Windows PowerShell, use `npm.cmd` when execution policy blocks `npm.ps1`. Dependency installation needs registry access and may execute dependency installation scripts. The package rehearsal installs the local tarball offline with lifecycle scripts disabled.

Tests execute the built CLI in a temporary directory and inspect its real exit status and output. Package rehearsal checks the installed executable shim, not just a function import. New feature checks should cover independent expected behavior and relevant failures.

Keep one feature per branch. Update numbered acceptance criteria with actual evidence, preserve unrelated changes, and never commit snapshots, credentials, dependencies or generated builds. Use the [work-item](./templates/WORK-ITEM.md) and [evidence](./templates/EVIDENCE.md) templates.
