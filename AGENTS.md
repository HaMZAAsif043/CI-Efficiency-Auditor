# Agent instructions

## Scope and authorization

This folder contains the CI Efficiency Auditor plan. It is independent of `review-markitdown-fe` and `review-markitdown-be`. Parent workspace safety/workflow instructions still apply; their MarkItDown architecture and roadmap do not define this product.

The original request created this planning package. On 2026-11-17 the user authorized proceeding with F1 implementation. This does not authorize every planned feature, creating a remote repository, package publication, or deployment. Follow subsequent user requests within scope without asking again for routine implementation choices. Customer discovery targets are prioritization gates, not permission requirements that override a direct user instruction.

## Before work

1. Read README, HANDOFF, ROADMAP, the chosen feature card, ARCHITECTURE, and VERIFICATION.
2. Inspect actual files, package scripts, applicable instructions, and current Git state. Documentation is not proof that code exists.
3. This folder initially has no Git repository or remote. Do not use a neighboring application's remote. Set up an independent repository when implementation/repository setup is requested. Do not initialize the shared workspace root.
4. For implementation in a repository, inspect status, branch, recent commits, remotes, and the remote default branch. Preserve unrelated edits. Create a task branch or resume the existing branch for this work item.
5. Create `work-items/<feature-id>-<description>.md` from the template when real work starts. Record base revision, scope, acceptance IDs, and planned verification.

## During work

- Implement the smallest complete feature slice. Respect dependencies; record user-authorized scope changes.
- Discover installed versions and read relevant primary documentation before relying on version-sensitive APIs. Choose and lock dependency versions during bootstrap; the planning package does not prescribe unverified versions.
- Keep collection read-only. Do not rerun workflows, fetch private source or raw logs, post comments, or change configuration for an analysis task.
- Do not print or persist tokens. Snapshot/report metadata may be private; use synthetic or sanitized, permissioned evidence.
- Distinguish facts, heuristics, estimates, and unknowns in both code output and documents.
- Run appropriate checks; test collection and calculations with independent expected results and adversarial/incomplete inputs. Avoid tests that only mirror implementation.
- Follow the [proof contract](./VERIFICATION.md). Never create pretend command output, screenshots, customer quotes, payments, CI status, or savings.

## Finish and handoff

1. Inspect diff and run appropriate checks; if Git exists, run `git diff --check`.
2. Save an evidence record under `evidence/<feature-id>/`, mapping every acceptance criterion to actual observations and artifact paths. Mark skipped checks and reasons.
3. Update the feature card, roadmap, work item, and HANDOFF consistently. A pass on documentation checks does not complete an application feature.
4. For authorized implementation, follow the parent branch/commit/push/draft-PR workflow when a remote and authentication exist. If publication is unavailable, prepare a PR description and state the blocker; do not invent a PR URL. This independent project does not need an unrelated application PR.
5. Leave exact next steps, local changes, revision, check results, and unresolved concerns. Report implementation, verification, publication, and customer validation separately.

No merge, deployment, package publication, external outreach, or changes to another person's project are implied by this plan.
