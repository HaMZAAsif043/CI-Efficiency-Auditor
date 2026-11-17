# LinkedIn upload package

Use marketing/assets/linkedin-demo.mp4 and optionally marketing/assets/linkedin-thumbnail.png. The MP4 is a new 4:5 cut with large text and five scenes, not just a renamed WebM. It is silent; all essential information is on screen. The video replays saved public evidence, with no live API execution or savings claim.

Use POST.md as the accompanying post text. The optional linkedin-captions.srt follows the scene narration; the exported video already has readable on-screen text.

## Upload

1. In LinkedIn's post composer, select Video and upload the MP4 itself.
2. Select the supplied PNG as a custom thumbnail if desired.
3. Paste the post text and inspect LinkedIn's own preview before posting.
4. Choose the audience and publish when ready. Nothing has been posted automatically.

Checked against LinkedIn's [video requirements](https://www.linkedin.com/help/linkedin/answer/a7494039) and [supported media types](https://www.linkedin.com/help/linkedin/answer/a564109/) on 2026-11-17. MP4 works across the listed desktop/mobile platforms. Platform acceptance/transcoding can only be confirmed by an actual upload; this package is checked locally.

## Reproduce

Run marketing/scripts/record-linkedin.mjs with an available playwright-core module directory and Chromium executable. It renders marketing/linkedin/render.html into an ignored WebM intermediate. Encode using an available full FFmpeg build:

    ffmpeg -i .cache/linkedin-render/linkedin-source.webm -vf fps=30,format=yuv420p -c:v libx264 -preset medium -crf 18 -movflags +faststart -an marketing/assets/linkedin-demo.mp4

The encoder used in this session was downloaded to ignored .cache/linkedin-tools from a checksum-verified imageio-ffmpeg wheel; no runtime dependency was added to the CLI. The binary is not distributed with the project. Render/encoding verification records are saved alongside the exported asset.
