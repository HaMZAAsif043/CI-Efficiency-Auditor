# F2 - Bounded read-only collection

Status: ready_for_review. Started/verified: 2026-11-17 (Asia/Karachi).
Branch: `feat/read-only-collection`. Base: `58fc39260867102a4463640743e51e5aebccd674`, the completed F1 branch. No remote exists; this is a stacked local branch, not a merged feature.

The user requested continuation during F1's evidence handoff. Implement [F2](../features/F2-read-only-collection.md) only: real collection, safe reduced snapshots, pagination/budgets/retries, completed-attempt caching, and actual verification. Reporting/analysis and package publication remain outside scope.

Acceptance plan, now executed: use multi-page synthetic API fixtures, partial reruns and independent expected IDs; exercise caps/errors/auth redaction; validate atomic output/cache refresh and unknown schema rejection; collect one anonymous public repository and cross-check API identities. Every criterion is mapped in the F2 evidence record.

Design decisions: serial requests (concurrency 1, below the maximum 3); 10-second maximum retry wait, with longer provider waits ending collection as partial rather than retrying early; fresh run listing on every invocation; cache entries partitioned by schema/repository/window/run/max-observed-attempt/attempt. No raw logs/source or API response dumps are stored.

Verified source: `a4c63bb744201b6181ce41b70aee1b29c96563b4` (initial implementation `7aefb52bc8aef484fb03730e843530235df2faa0`). Typecheck/build, 35 tests and the final packed-install rehearsal passed. A public cli/cli collection recorded 1 run, 1 attempt, 1 job, 6 requests including retries and partial exit 3 under the run cap; two independent GETs matched identities. [Evidence](../evidence/F2/VERIFICATION.md) preserves exact results and the earlier startup-timeout failure.

An additional narrow-window cli/cli collection exited 0: complete coverage, 1 run, 1 attempt, 1 job, 6 steps and 4 requests. Two independent GETs confirmed its identities. The evidence record links both this complete sample and the capped partial sample, plus the two reproduced and fixed coverage regressions.

No remote/PR/publication exists; [prepared PR text](./F2-PR.md). Customer validation remains untested. F3 analysis is the next planned engineering feature.
