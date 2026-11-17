# CLI reference - foundation release

Package: `@hamzaasif043/ci-efficiency-auditor`, version `0.1.0`.
Executable: `ci-audit`. Requires Node.js 24.x.

```text
ci-audit --help
ci-audit --version
ci-audit collect --help
```

Only help and version are implemented. Running `collect`, `report` or `compare` returns exit code 2 with an unavailable message; their future input options are not accepted yet. The executable makes no GitHub requests, reads no credentials and creates no snapshots or reports.

Exit codes: 0 for help/version; 2 for invalid arguments or unavailable commands; 1 for an unexpected failure or broken package metadata. Successful audit output and partial-data exit code 3 belong to later features.

The npm name is reserved in local metadata only. Registry availability and publication have not been established.
