# CLI reference - read-only collection

Package: `@hamzaasif043/ci-efficiency-auditor`, version `0.1.0`.
Executable: `ci-audit`. Requires Node.js 24.x.

```text
ci-audit --help
ci-audit --version
ci-audit collect --help
ci-audit collect --repo owner/repo --days 30 --out snapshots/baseline.json
```

`collect` sends bounded GET requests to api.github.com for runs, attempt metadata and job/step metadata. It never requests logs/source or mutates workflows. Existing `GITHUB_TOKEN` is optional for public repositories; use a fine-grained token with Actions read permission for private repositories. `--anonymous` ignores the token. No credential files are searched or written.

| Option | Meaning |
|---|---|
| `--repo owner/repo` | Required GitHub repository; URLs and traversal are rejected. |
| `--out path` | Required JSON snapshot path; validated output atomically replaces an existing file. |
| `--days 30` | Lookback of 1-90 days; default 30; ignored when `--from` is explicit. |
| `--from ISO-date`, `--to ISO-date` | Inclusive start/exclusive end; end defaults to collection start. Maximum window 90 days. Use explicit values for repeatable cache keys. |
| `--max-runs 500` | 1-1000; hitting a cap before exhausting the inventory produces partial coverage. |
| `--max-requests 2000` | 1-10000 requests, including retries. Raising it is deliberate. |
| `--cache-dir path` | Default `.cache/ci-audit`; reduced completed-attempt metadata only. No automatic expiration yet. |
| `--no-cache` | Disable cache reads/writes. |
| `--anonymous` | Never use GITHUB_TOKEN. |

Requests are serial, timeout after 15 seconds, and retry at most twice. GitHub rate-limit wait instructions are honored up to 10 seconds; longer waits produce partial coverage instead of retrying early. GitHub's filtered run inventory can be capped at 1000. Snapshots expose limits, counts, coverage reasons, cache hit/miss counts and oldest-used entry timestamp.

Cache identity includes schema version, repository, exact window, run/commit, observed attempt count, run update time and requested attempt. The run list is refreshed every time. In-progress data is not cached. Cache corruption falls back to the API with a warning; final run refreshes detect observed mid-collection changes. Collection is not an atomic view of GitHub's state.

Exit codes: 0 for complete collection/help/version; 3 for a written partial snapshot; 2 for invalid options, inaccessible initial repository or invalid credentials; 1 for unexpected/output failures. Invalid API data yields explicit incomplete diagnostics rather than invented zero durations. Ctrl+C stops further requests and attempts to write a partial snapshot; forced process termination cannot guarantee an output file.

`report` and `compare` remain unavailable (exit 2). Schema v1 is enforced by the snapshot reader/writer; unknown versions are rejected. Errors do not dump tokens or raw API response bodies. Snapshot and cache metadata can still be private. Restrictive creation modes are requested; Windows ACLs are environment-dependent.

The npm name is reserved in local metadata only. Registry availability and publication have not been established.
