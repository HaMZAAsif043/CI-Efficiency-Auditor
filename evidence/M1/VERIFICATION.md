# M1 — Landing page and launch kit verification

Date: 2026-11-17 (Asia/Karachi). Site source commit: 9c205f0c7b42a79961c59e2f5e21b6ee1bf72006. Static source is mirrored under marketing/site/ for GitHub review. Browser checks ran against that source, plus the final video-player/media pass.

## Actual results

- [Browser checks](../../marketing/assets/browser-checks.json): HTTP 200, complete replay matches saved output, partial replay shows exit 3, JSON download, clipboard copy, 390px mobile layout without horizontal overflow and no observed page errors.
- [Final media checks](../../marketing/assets/media-checks.json): video metadata/playback, portrait download, social image, WebVTT MIME, and final mobile layout. Landscape duration: 19.84 seconds.
- Inspected actual desktop and demo-poster screenshots. Desktop 1440x1000; mobile 390x844; recorded landscape 1280x800 and portrait 720x1280.
- The actual WebM clips exist in marketing/site/ and marketing/assets/. They are silent, captioned animated replays of saved public CLI output. No new live CLI execution or narrated/MP4 export is claimed.
- Complete and partial JSON fixtures are exact copies of the prior public verification records. No fabricated customer outcomes, savings, testimonials or stars.
- Sites native deployment returned succeeded for project appgprj_6afbf436c5fc819198c290bde0d5f3dd, deployment appgdep_6afbfa649d6c8191843e814b90cda5d0. URL: https://ci-efficiency-auditor.dancingoats.chatgpt.site . Audience remains owner-private. It is not a public launch URL yet.

## Reproduction and limits

Start marketing/scripts/preview.mjs with the site directory, then run record-demo.mjs or check-media.mjs with an available playwright-core package path and Chromium executable. This session reused an already installed playwright-core and Chromium 1255; no CLI dependency changes were needed. The first sandbox browser launch failed; a supported elevated browser/server execution path passed. An initial server was inaccessible across the sandbox boundary; it was stopped and replaced by the owned elevated server. A Site credential expired during preparation and was renewed for the same Site; no duplicate Site was created and no credential was written into the source.

All public/social posts in [the launch kit](../../marketing/LAUNCH.md) are drafts. No outreach was sent. Video files are WebM; platform-specific MP4 conversion is documented but has not been executed. Marketing does not add report generation or analysis to the CLI. The existing production CLI test suite was not rerun for static marketing files; browser/media checks are the relevant verification.

Publication to the project's GitHub repository is tracked in the work item and handoff. This record establishes the local artifacts and successful private Site deployment, not social reach or business validation.
