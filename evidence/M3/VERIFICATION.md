# M3 — Actual-run demo evidence

Recorded 2026-11-18, Asia/Karachi. Implementation revision: a425f6bb3efce8f39f3f34822592c2b70cc11374, clean after commit. Recording/checks were created before that commit with the task files uncommitted. This evidence-only follow-up does not change the clip or executable code.

Environment: Windows, Node v24.21.0, npm 11.19.0, playwright-core 1.65.1, local Chromium build directory chromium-1255, FFmpeg 9.0.2. Browser/encoder were existing local tools, not added runtime dependencies.

| Acceptance | Observation | Result and evidence |
|---|---|---|
| M3-A1 actual collection | Public anonymous cli/cli invocation, 7.449 seconds, exit 3, 1 run/attempt/job, 4 requests; partial coverage is explicit | pass: [full trace and public snapshot](../../marketing/authentic/actual-run.json) |
| M3-A2 actual output recording | Plain browser wrapper displays the actual subprocess output and selected saved JSON; original network wait retained | pass: [MP4](../../marketing/assets/straight-demo.mp4), [thumbnail](../../marketing/assets/straight-demo-thumbnail.png), [method](../../marketing/authentic/VERIFICATION.md) |
| M3-A3 usable export | H.264, 1440x1080, 16.866667 seconds, full decode exit 0, fast-start, browser playback; no audio | pass: [machine checks](../../marketing/authentic/checks.json) |
| M3-A4 honest launch copy | Current collection scope, partial result and future analysis are stated; optional own-voice guide provided | pass: [post](../../marketing/authentic/POST.md), [script](../../marketing/authentic/VOICEOVER.md), [asset index](../../marketing/START-HERE.md) |

Reproduction from the repository root (PowerShell; browser paths reflect this workstation):

```powershell
npm.cmd run build
node marketing/scripts/serve-straight-demo.mjs
# In another terminal, while the one-shot server is running:
node marketing/scripts/record-straight-demo.mjs D:/dev/personal/experiment/review-markitdown-fe/node_modules/playwright-core C:/Users/USER/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe
.cache/linkedin-tools/ffmpeg.exe -hide_banner -y -i .cache/straight-demo/actual-cli.webm -vf fps=30,format=yuv420p -c:v libx264 -preset medium -crf 18 -movflags +faststart -an marketing/assets/straight-demo.mp4
node marketing/scripts/verify-straight-demo.mjs .cache/linkedin-tools/ffmpeg.exe D:/dev/personal/experiment/review-markitdown-fe/node_modules/playwright-core C:/Users/USER/AppData/Local/ms-playwright/chromium-1255/chrome-win64/chrome.exe
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/verify-plan.ps1
git diff --check
```

Observed: build, recorder, encoder, media checks, plan verification and whitespace checks exited 0. The spawned collection intentionally exited 3 for bounded partial coverage. A fresh reproduction queries changing public data and may differ; restart the one-shot server before another recording. Stop it after recording. Saved evidence is a real public response, not a synthetic fixture. The displayed JSON is a projection of the saved snapshot.

Publication: pushed feat/straightforward-demo; [draft PR #3](https://github.com/HaMZAAsif043/CI-Efficiency-Auditor/pull/3) created, not merged. No website replacement or social post. No human narration was recorded; the supplied MP4 is silent. Customer validation, reach and revenue were not measured. Next: review the clip/copy and optionally record the supplied narration in the author's voice.
