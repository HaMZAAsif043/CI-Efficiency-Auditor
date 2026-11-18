# Straightforward demo verification

Date: 2026-11-18 (Asia/Karachi). This is a separate alternative responding to feedback that the narrated slide-style demo felt AI-generated.

The actual CLI was built with npm.cmd run build, then invoked once against public cli/cli with --anonymous, --max-runs 1, --max-requests 8 and --no-cache. [The run record](./actual-run.json) preserves exact arguments, stdout/stderr chunks, elapsed timing, exit code and the resulting public snapshot. It took 7449 milliseconds and returned exit 3 with provider_search_cap and run_limit coverage reasons. One run, attempt and job were observed, using four requests. No output was manufactured or replayed into a supposed live run.

The recording displays the actual process output through a local browser console wrapper and selected fields from the actual file. It is not a native terminal screen capture or a new browser product feature. The full wait is retained; no playback speed-up was applied. A seven-second end hold allows inspection. The output is intentionally partial; it is not an analysis or savings report.

[Export checks](./checks.json) verified 16.866667 seconds, 1440x1080, H.264 MP4 with fast-start, full decode exit 0 and actual browser playback. File size: 325092 bytes. SHA256: 977e3ef8ad1036baf78425d6a2eb05e7abe90c68956532b4638142eb6aab62f7. It has no audio track or synthetic narration. The thumbnail was inspected visually. Actual stdout/stderr shown in the browser matches the run record.

The recording server bound only to loopback and ran only one fixed command; it was stopped after recording. Existing CLI behavior/dependencies, earlier videos and both hosted websites were unchanged. No LinkedIn posting occurred. A short script is supplied for the user to record in their own voice; no user voice was fabricated.

Reproduction: run marketing/scripts/serve-straight-demo.mjs, then record-straight-demo.mjs with an installed playwright-core directory and Chromium executable. Restart the one-shot server for each new actual recording. Transcode its ignored WebM intermediate with a full FFmpeg build to H.264/yuv420p, 30 fps, fast-start, no audio. Run verify-straight-demo.mjs with FFmpeg/playwright/Chromium paths. This session reused the existing local encoder and browser; no runtime dependency was added.
