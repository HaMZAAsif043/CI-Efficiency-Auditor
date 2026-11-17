# F2 - Read-only collection

Status: in_progress. Dependencies: F1 (verified). Completion evidence: pending; [work item](../work-items/F2-read-only-collection.md).

## Outcome and scope

Collect a bounded window of one repository's runs, attempts, jobs and steps into Snapshot v1 from [ARCHITECTURE.md](../ARCHITECTURE.md). Implement limits, pagination, auth errors, finite retry handling, cache semantics, deduplication and atomic writing. Do not collect raw logs/source or perform API mutations.

## Acceptance criteria

- [ ] F2-A1: Multi-page fixture collection includes each expected run/job exactly once, filters `[from,to)` correctly and preserves attempt/job identities.
- [ ] F2-A2: Failed jobs followed by a partial rerun retain both observed executions without claiming unaffected jobs ran again.
- [ ] F2-A3: Request/run/provider caps, missing attempts, rate limiting, 403/404 and interrupted collection yield explicit coverage reasons and correct exits; invalid credentials do not leak into output.
- [ ] F2-A4: Unknown schema versions, invalid dates/repository arguments, malformed responses and unwritable paths fail clearly; writes do not corrupt an existing valid snapshot.
- [ ] F2-A5: Cache reuse respects repository/window/schema/attempt identity and refreshes changed run status or new attempts; tests demonstrate no stale-complete output.
- [ ] F2-A6: One real public or permissioned repository smoke run produces a schema-valid snapshot with evidence that API-provided run/attempt/job identities match. Record counts, window, API version, request count and completeness.
- [ ] F2-A7: Snapshot and diagnostics contain only allowed fields; inspected outputs contain no tokens, logs, environment or source. Demonstrate zero mutation requests.

## Proof

Use independent fixture inventories plus request-method/path assertions. Capture a sanitized live-smoke transcript and permitted snapshot or a public reproducible subset. If networking or authorization prevents the live check, keep F2-A6 `not_run`; do not mark F2 verified.

## Risks to verify

Provider pagination/search caps, jobs omitted by partial reruns, changing in-flight state, and missing runner/step timestamps. Recheck current API documentation when implementing.
