# Narrated LinkedIn demo — recommended upload

Upload marketing/assets/linkedin-demo-voiced.mp4. This replaces the silent version as the recommended LinkedIn asset. It explains the audience, purpose, current features and limits using synthetic English narration (Microsoft Zira Desktop), with large on-screen text.

Actual export: 33.03 seconds, 1080x1350, 30 fps, H.264 video and AAC audio, 914059 bytes. The file has one audio track, a measured mean level of -16.8 dB, full decode exit 0, verified browser playback and fast-start metadata. See marketing/assets/linkedin-voiced-checks.json. SHA256: 24cf02294b56978ae7c7cdd13aaa6dd3eaf0b846604730fb2cc62f76d7100205.

Use marketing/assets/linkedin-voiced-thumbnail.png and optionally linkedin-voiced-captions.srt. The transcript is narration.json. Scene timing follows actual generated speech durations, including short pauses; timings are preserved in voice-timings.json. The visual sequence is a replay of saved public metadata, not a live CLI run. No claim is made that the tool already diagnoses or fixes CI issues. Nothing has been posted to LinkedIn.

## Reproduction

1. Run marketing/scripts/narrate-demo.ps1 on Windows with the installed Microsoft Zira Desktop voice. WAV segments stay in ignored .cache/voiced-demo/.
2. Run marketing/scripts/assemble-narration.py with a Python interpreter to combine audio, write captions and a frame concat manifest.
3. Run marketing/scripts/render-voiced.mjs with the playwright-core module directory and Chromium executable to generate five explanatory PNGs.
4. Use a full FFmpeg build to encode frames.ffconcat and narration.wav as H.264/AAC. This session normalized speech to -16 LUFS target, encoded 128 kbps AAC at 48 kHz and used MP4 fast-start.
5. Run marketing/scripts/verify-voiced.mjs with FFmpeg, playwright-core and Chromium paths. It checks full decode, non-silent audio level, an actual browser audio track and playback.

The first file-origin browser capture was blocked by the browser's cross-origin rule. The final check used an in-memory same-origin Blob of the exact MP4; no browser security protection was disabled. The first sandbox Windows voice enumeration also failed; the supported elevated execution path exposed the installed voices and generated the audio successfully. Frames were inspected visually. These technical checks do not claim a human listening review.
