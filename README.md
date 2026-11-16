# CI Efficiency Auditor

An open-source CLI that turns GitHub Actions history into a short, evidence-backed improvement report.

**Current state: planning only. No CLI, measured savings, passing application tests, customers, or published repository are claimed.** This is a new project, separate from the neighboring MarkItDown applications. The name is a working name; availability has not been checked.

## Start here

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
