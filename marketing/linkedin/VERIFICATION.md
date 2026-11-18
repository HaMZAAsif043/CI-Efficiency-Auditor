# LinkedIn demo verification

Recorded 2026-11-17, Asia/Karachi. Follow-up to the launch kit, on the same feat/launch-kit branch and draft PR #1.

Export: marketing/assets/linkedin-demo.mp4. Actual checks in linkedin-video-checks.json: 1080x1350 (4:5), 24.8 seconds, 30 fps, H.264/yuv420p, MP4 fast-start, 625608 bytes. Full FFmpeg decode exited 0; browser metadata and playback passed. The file is silent and all essential content is visible on screen. It has not been uploaded or posted to LinkedIn.

SHA256: 5308c2d2b8504035ac900b90cae62fb0a6d6ed39c9def975d6fd245f7e133794.

Five scenes were rendered from locally authored HTML using an already installed Chromium/playwright-core. Saved complete/partial public fixtures supply the displayed output; this is not a live CLI recording. Visually inspected complete and partial scenes, corrected a literal newline before the final render, and inspected the MP4 playback frame. Render checks, all scene PNGs, thumbnail, optional SRT and copy-ready post are included.

A full FFmpeg binary was downloaded only into ignored local cache from a checksum-verified imageio-ffmpeg Windows wheel after the existing Python environment was found to have no pip. No binary or new runtime dependency is bundled with the project. Reproduction commands and LinkedIn's official requirements are linked in marketing/linkedin/README.md. The prior WebM assets remain unchanged. No website deployment change, social posting or CLI behavior change occurred.
