# CI Efficiency Auditor

An open-source CLI project for turning GitHub Actions history into a short, evidence-backed improvement report.

**Current scope: F1 CLI foundation.** Help/version are implemented; collection, analysis and reporting are planned. No measured savings, customers or public package/repository are claimed. Working package name: `@hamzaasif043/ci-efficiency-auditor`; registry name availability has not been established.

## Local quick start

Use Node.js 24.x (first verification target: 24.21.0) and npm. From a source checkout:

```text
npm ci
npm run typecheck
npm test
node dist/cli/main.js --help
node dist/cli/main.js --version
npm run verify:package
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`. `npm test` builds before running CLI-process tests. `verify:package` builds/packs, checks an exact content allowlist, installs the local tarball offline from the local cache, and invokes the installed executable through npm. It leaves inspectable artifacts under ignored `.tmp/`; dependency tarballs must already be cached by installation. The CLI is named `ci-audit` after local package installation.

Running `collect`, `report` or `compare` exits 2 with an unavailable message. This release makes no GitHub requests, reads no token and writes no audit files. See [the CLI reference](./docs/CLI.md) and [contributor guide](./CONTRIBUTING.md). Licensed under [Apache-2.0](./LICENSE); ownership is recorded in [NOTICE](./NOTICE).

## Start here

The following planning/agent documents are part of the source checkout; they are not included in the minimal npm tarball.

1. [AGENTS.md](./AGENTS.md): execution rules for any coding agent.
2. [HANDOFF.md](./HANDOFF.md): current state and exact next action.
3. [PLAN.md](./PLAN.md): audience, scope, priorities, and estimates.
4. [ROADMAP.md](./ROADMAP.md): feature order and status.
5. [ARCHITECTURE.md](./ARCHITECTURE.md): interfaces, data model, and metric definitions.
6. [VERIFICATION.md](./VERIFICATION.md): what counts as proof of completion.
7. [VALIDATION.md](./VALIDATION.md) and [LAUNCH.md](./LAUNCH.md): customer research and income experiments.
8. [AGENT-PROMPTS.md](./AGENT-PROMPTS.md): ready-to-copy implementation, review and resume prompts.

## Intended experience

The following command is a **proposed interface**, not an installed or implemented command:

```text
ci-audit collect --repo owner/repo --days 30 --out snapshots/baseline.json
ci-audit report --snapshot snapshots/baseline.json --format html --out report.html
ci-audit compare --before snapshots/baseline.json --after snapshots/followup.json --out comparison.md
```

The CLI should identify rerun overhead and recurring setup bottlenecks, show supporting runs, and explain uncertainty. It must keep runner consumption, elapsed run duration, possible improvements, and demonstrated savings distinct.

## Delivery contract

Each feature has a card under [features/](./features/README.md). An agent implements one authorized work item, maps its acceptance criteria to evidence, records exact checks and limitations, and leaves a usable handoff. A feature is verified only when that evidence exists and has been inspected. Customer validation and publication are tracked separately.

Use the [work-item](./templates/WORK-ITEM.md), [evidence](./templates/EVIDENCE.md), [PR](./templates/PULL-REQUEST.md), and [handoff](./templates/HANDOFF.md) templates. See [evidence/](./evidence/README.md) for the proof register.
