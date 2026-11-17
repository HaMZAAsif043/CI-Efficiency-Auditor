# F2 - Bounded read-only collection

Status: in_progress. Started: 2026-11-17 (Asia/Karachi).
Branch: `feat/read-only-collection`. Base: `58fc39260867102a4463640743e51e5aebccd674`, the completed F1 branch. No remote exists; this is a stacked local branch, not a merged feature.

The user requested continuation during F1's evidence handoff. Implement [F2](../features/F2-read-only-collection.md) only: real collection, safe reduced snapshots, pagination/budgets/retries, completed-attempt caching, and actual verification. Reporting/analysis and package publication remain outside scope.

Acceptance plan: use multi-page synthetic API fixtures, partial reruns and independent expected IDs; exercise caps/errors/auth redaction; validate atomic output/cache refresh and unknown schema rejection; collect one anonymous public repository and cross-check API identities. Record every criterion in a new F2 evidence record; no live check is claimed yet.

Design decisions: serial requests (concurrency 1, below the maximum 3); 10-second maximum retry wait, with longer provider waits ending collection as partial rather than retrying early; fresh run listing on every invocation; cache entries partitioned by schema/repository/window/run/max-observed-attempt/attempt. No raw logs/source or API response dumps are stored.
