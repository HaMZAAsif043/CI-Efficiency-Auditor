# Collect bounded GitHub Actions snapshots with explicit coverage

Developers can now collect runs, attempt outcomes, jobs and step timings using read-only GitHub requests. The collector enforces limits, finite retries, half-open windows, strict reduced snapshots and atomic output. Completed-attempt caching refreshes run inventory and invalidates changed identities; missing attempt identity is excluded rather than inventing an execution.

Validation: typecheck/build, 35 passing tests, offline packed installation and installed-command checks, plus an anonymous public collection independently checked against GitHub. The public snapshot is deliberately partial under a one-run cap (exit 3). Windows was checked; private repositories and other OSes remain unverified. See [actual evidence](../evidence/F2/VERIFICATION.md).

An additional complete narrow-window public collection passed with 1 run, 1 attempt, 1 job, 6 steps and 4 requests (exit 0); two independent GETs matched its identities. Regression tests also demonstrate the previously failing missing-attempt and unfinished-attempt cases.

This branch is stacked on local F1 because no remote exists. This is prepared PR text only; no actual PR or package release exists. Reporting and analysis remain future features.
