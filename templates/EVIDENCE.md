# <Feature ID> - Verification evidence

This is a template. Replace placeholders with observations; delete irrelevant optional sections. Do not mark a criterion passed before inspecting evidence.

Date/time/timezone: <actual>
Revision/branch: <actual; state uncommitted changes>
Environment: <OS, runtime and relevant dependency versions>
Input provenance: <synthetic/sanitized/permissioned live; transformation notes>

## Criterion mapping

| Acceptance ID | Result: pass/fail/not_run | Command or observation | Artifact/CI link | Limitation |
|---|---|---|---|---|
| <F*-A*> | not_run | <actual check when executed> | <existing path only> | <reason if not run> |

## Reproduction

Working directory: <actual>
Preconditions: <credentials described by variable name only; dependencies/input>
Commands: <exact commands, without secrets>
Expected: <independent expected behavior/values>
Observed: <actual behavior and exit codes>

## Artifacts and review

<Paths, optional hashes, provenance, reviewer/agent and what was inspected. Include short real output or a sanitized transcript link. No simulated transcripts.>

## Failures and limits

<Failures, omitted data, skipped checks and relevance. Passing fixtures are not proof of a successful live API run.>

## Conclusion

Engineering status: <implemented/verified/etc., justified by criteria>
Publication status: <actual or none>
Customer validation: <observed/untested/negative>
Next action: <exact>
