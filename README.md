# CI Efficiency Auditor

An open-source CLI project for turning GitHub Actions history into a short, evidence-backed improvement report.

**Current scope: F1 foundation and F2 read-only collection.** Help, version and bounded snapshot collection are implemented. Analysis, reports and comparison remain planned. No measured savings, customers or published npm package are claimed. [GitHub repository](https://github.com/HaMZAAsif043/CI-Efficiency-Auditor). Working package name: `@hamzaasif043/ci-efficiency-auditor`; registry name availability has not been established.

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

Collect a small public sample:

```text
node dist/cli/main.js collect --repo cli/cli --days 7 --max-runs 1 --max-requests 8 --out snapshots/sample.json --no-cache --anonymous
```

The run cap commonly produces partial coverage: exit 3 means an explicit partial snapshot was written, not a failed analysis. Exit 0 means collection was complete; exit 2 means invalid options/access; exit 1 means an unexpected transport/output failure. No analysis is performed yet. `report` and `compare` remain unavailable (exit 2).

Collection uses GET requests only, never source/log endpoints. Without `--anonymous`, an existing `GITHUB_TOKEN` may be used; no credential files are discovered or written. Snapshot/cache names and metadata may be private: keep them local. Cache defaults to `.cache/ci-audit`; use fixed `--from` and `--to` values for repeatable cache windows. Sliding default windows get different cache keys. `--no-cache` disables both reads and writes. Files request restrictive POSIX permissions; Windows ACLs depend on the environment. See [the CLI reference](./docs/CLI.md) and [contributor guide](./CONTRIBUTING.md). Licensed under [Apache-2.0](./LICENSE); ownership is recorded in [NOTICE](./NOTICE).

## Demo and launch materials

[Public landing page](https://hamzaasif043.github.io/CI-Efficiency-Auditor/) · [Narrated demo](./marketing/site/demo-narrated.mp4) · [Publishing guide](./marketing/PAGES.md). [Landing page source](./marketing/site/index.html), [landscape demo](./marketing/site/demo-landscape.webm), [portrait demo](./marketing/site/demo-portrait.webm), and [launch copy](./marketing/LAUNCH.md) are included. The videos replay saved public evidence; they are not live executions. Analysis and reports remain roadmap work.

## Project guides

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

`collect` below is implemented; `report` and `compare` are **proposed interfaces** and currently return unavailable errors:

```text
ci-audit collect --repo owner/repo --days 30 --out snapshots/baseline.json
ci-audit report --snapshot snapshots/baseline.json --format html --out report.html
ci-audit compare --before snapshots/baseline.json --after snapshots/followup.json --out comparison.md
```

The CLI should identify rerun overhead and recurring setup bottlenecks, show supporting runs, and explain uncertainty. It must keep runner consumption, elapsed run duration, possible improvements, and demonstrated savings distinct.

## Delivery contract

Each feature has a card under [features/](./features/README.md). An agent implements one authorized work item, maps its acceptance criteria to evidence, records exact checks and limitations, and leaves a usable handoff. A feature is verified only when that evidence exists and has been inspected. Customer validation and publication are tracked separately.

Use the [work-item](./templates/WORK-ITEM.md), [evidence](./templates/EVIDENCE.md), [PR](./templates/PULL-REQUEST.md), and [handoff](./templates/HANDOFF.md) templates. See [evidence/](./evidence/README.md) for the proof register.
