# Demand research and experiment log

## Evidence already available

These references informed the recommendation on 2026-11-16. They establish capabilities/problems in the category, not demand or revenue for this project. Recheck mutable details before citing them as current facts in sales material.

| Reference | Supported observation | What it does not establish |
|---|---|---|
| [GitHub Actions metrics](https://docs.github.com/en/actions/concepts/metrics) | Native usage and performance reporting already exists. | A new dashboard is needed. |
| [Octolense](https://octolense.com/) | A vendor offers CI/cost visibility within a team product. | Its revenue, retention, or buyers' interest in this CLI. |
| [GitHub job-attempt API](https://docs.github.com/en/rest/actions/workflow-jobs) | Read-only attempt/job collection has an API path. | Correctness of an implementation not yet built. |
| [GitHub billing reports](https://docs.github.com/en/billing/reference/billing-reports) | Billing and operational usage have different reporting constraints. | Duration is equal to charged cost or cash savings. |

## Customer discovery

Target 10 conversations with teams that actively use GitHub Actions. Prefer contacts with recurring pipeline investigations or paid CI. Record selection bias and existing relationships. Actual outreach needs explicit authorization; this plan authorizes preparing materials, not messaging people.

Ask about the most recent real incident:

1. What failed or became slow, and when?
2. Show the investigation workflow, if sharing is permitted.
3. What did native GitHub metrics and other tools already answer?
4. What remained manual? How much time did it take, and who did it?
5. Did the team spend money or make a change to address it?
6. Who approves a fixed-scope audit? What outcome would make one worth buying?

Avoid leading with the product or asking hypothetical "would you use this?" questions. Do not invent conversations to complete a gate.

## Manual report experiment

Offer three permissioned teams a short audit using locally collected or customer-run data. Produce a maximum of three prioritized findings, evidence links, known limitations, and a follow-up measurement plan. Ask the team to compare the report with what they can already get from GitHub.

Record: delivery date, useful/irrelevant findings, accepted actions, actual changes, and follow-up observations. Use anonymized IDs in public documents. Public case studies require permission and must retain relevant limitations.

## Proposed decision thresholds

- Three teams review reports.
- Two act on a finding.
- One pays for an audit or implementation; confirm payment, not merely interest or an unpaid invoice.

Failure to meet these is information for scope/business decisions. Direct user instructions can authorize continued engineering. Do not claim market validation merely because engineering is finished.

## Current experiment register

| ID | Hypothesis | Status | Evidence | Next action |
|---|---|---|---|---|
| V1 | Teams have recurring manual CI investigation work. | untested | None | Recruit permissioned interviews. |
| V2 | A short report adds value beyond native metrics. | untested | None | Deliver three reports and collect feedback. |
| V3 | A buyer pays for interpretation/implementation. | untested | None | Offer a scoped paid audit. |
| V4 | Ongoing reporting has recurring value. | untested | None | Observe repeat use after initial intervention. |
