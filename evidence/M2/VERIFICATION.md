# M2 — Public GitHub Pages verification

Date: 2026-11-18 (Asia/Karachi). Authorized by the user's request to configure Pages. Configuration branch: chore/github-pages, based on refreshed main ef0383c39a2c0e0ef5d0a83f46b596afaaf2b6fb (PR #1 was already merged).

## Observed deployment

Public URL: https://hamzaasif043.github.io/CI-Efficiency-Auditor/

- Website source commit: b29e60901ba8bfd267b15ae0c4021b1642c50a3c.
- Published gh-pages commit: 3b3a43431286069862dfc874638aaee1b878d41d, verified against the remote branch after push.
- Pages reports branch build mode (legacy), source gh-pages at /, HTTPS enforced, status built.
- The latest Pages build reports the same publishing commit, status built and no error.
- [Deployment manifest](./deployment.json) records the source commit and exact SHA256 values. Only 13 explicitly curated public website assets, LICENSE, .nojekyll and deployment.json are served. No CLI source, private snapshots, Sites manifest or credentials are copied to the publishing branch.

## Acceptance proof

| Requirement | Result | Evidence |
|---|---|---|
| Reviewable source before deployment | pass | Committed source b29e609 and publisher's refusal of uncommitted website/publisher edits. |
| Correct publishing source | pass | [Pages settings](./pages-settings.json): gh-pages, root, legacy build, public HTTPS URL. |
| Successful build | pass | [Build status](./build-status.json): built at publishing commit 3b3a434. |
| Asset integrity | pass | [Live checks](./live-checks.json): all 13 actual HTTP responses have expected SHA256 hashes. |
| Working public interactions | pass | Complete/partial replay, correct JSON counts, clipboard, download and no live GitHub API calls from the demo. |
| Narrated video | pass | Live browser playback, 33.03 seconds, 1080x1350, one audio track; source video hash matches the verified narrated MP4. |
| Mobile layout | pass | 390px viewport, no horizontal overflow; actual [mobile](./live-mobile.png) and [desktop](./live-desktop.png) screenshots. |

## Executed verification

node marketing/scripts/publish-pages.mjs staged the curated artifact locally. After committing its source, node marketing/scripts/publish-pages.mjs --push created the publishing commit and verified the remote SHA. The Pages REST API was inspected with authenticated GitHub CLI; no token was printed or persisted.

The live check was run as:

    node marketing/scripts/verify-pages.mjs https://hamzaasif043.github.io/CI-Efficiency-Auditor/ <playwright-core-directory> <Chromium-executable>

Actual output: assets 13, checks passed; video duration 33.033333, width 1080, height 1350, audioTracks 1. The existing production CLI tests were not rerun because no CLI behavior or dependencies changed.

## Failures and limits

The first publishing upload failed with an RPC/connection reset. GitHub confirmed no gh-pages branch existed, then a normal retry succeeded without force pushing. A creation request returned 409 because Pages was already enabled by the time of the request; subsequent GETs confirmed exactly the desired configuration and successful build. The first browser assertion read the asynchronous clipboard status too early; the check was corrected to await its completion and then passed without changing application behavior.

Git repository metadata writes and network/browser operations required the supported elevated execution path in this managed environment. The publisher disables automatic line-ending conversion in its isolated repository so deployment hashes describe exact published bytes. A public source checkout/PR is separate from the served gh-pages artifact; this deployment did not require merging the configuration branch into main. The original Sites deployment remains owner-private and unchanged. No package release, social post, customer validation or savings claim occurred.

A separate push of the configuration-source branch failed with HTTP 408. The subsequent API check returned 404 for that source branch, while Pages still reported built at the verified publishing commit. The deployed website was unaffected. Configuration-source publication is retried with a bounded timeout; if it remains unavailable, work-items/M2-PR.md is prepared PR text, not a claim that a PR exists.
