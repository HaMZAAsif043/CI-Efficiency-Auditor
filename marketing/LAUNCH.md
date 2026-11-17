# Launch kit — CI Efficiency Auditor

Prepared 2026-11-17. All copy below is a draft. No posts, outreach, customer claims or paid campaigns have been sent. Website audience starts owner-private. Publication of the GitHub branch/draft PR does not make the Site public.

## Positioning

**Headline:** Your CI has a story. Get the receipts.

**One line:** An open-source CLI that collects bounded GitHub Actions evidence into inspectable local JSON, with explicit coverage and attempt identity.

**Who it is for:** developers investigating CI behavior who want a portable record without setting up another hosted dashboard.

Current scope is collection, not optimization recommendations. Do not promise savings, flaky-test detection, analysis reports or automatic fixes. The practical value of the current release is collecting and inspecting evidence. More advanced conclusions are roadmap work.

## Assets and truthful demo

The landing page has a replay button, real downloadable complete/partial snapshots, a JSON inspector and copyable source-install commands. It does not execute GitHub requests in the browser.

Clips are silent animated replays of previously saved public evidence, with on-screen captions. They are not recordings of a new live CLI execution. The complete example is a one-minute window from cli/cli: one run, one attempt, one job, six steps and four collection requests. The partial sample is a separate saved collection with a run cap. Numbers must stay tied to those samples.

Desktop/mobile screenshots, social preview and landscape/portrait WebM clips live in assets/. Browser-check results describe actual exercised behavior. Raw recorder filenames are intermediate output, not additional release assets. Some upload platforms need MP4; convert with an available full FFmpeg build before uploading, for example:

    ffmpeg -i demo-landscape.webm -c:v libx264 -pix_fmt yuv420p -movflags +faststart demo-landscape.mp4

The original bundled recorder only supplies a VP9 encoder. A later LinkedIn-specific export is now available as H.264 MP4: see [the upload package](./linkedin/README.md). No voiceover is claimed. Do not publish a private preview URL in public posts; use the GitHub repository until a public landing URL has been authorized and verified.

## A 20-second video / optional voiceover

| Time | Visual | Optional narration |
|---|---|---|
| 0-3s | Hook and CLI command | Before optimizing your CI, collect the evidence. |
| 3-8s | Complete saved output and receipt | This public sample collects a run, its job and six steps into local JSON. |
| 8-14s | Toggle capped collection | Hit a limit? The snapshot tells you coverage is partial. |
| 14-18s | JSON/download and scope | GET-only collection. Inspectable evidence. Analysis comes next. |
| 18-20s | GitHub URL | Try the source, or help build what comes next. |

Use captions even when adding narration. The deliverable WebM timing may differ slightly because it includes browser startup frames; trim to the desired platform format rather than claiming exact duration.

## X / Bluesky draft

Your CI has a story. Get the receipts.

I built an open-source CLI that collects GitHub Actions runs, attempts and step timings into local JSON. Bounded requests. Explicit partial coverage. GET-only access.

Early release: collection works; analysis is next.

https://github.com/HaMZAAsif043/CI-Efficiency-Auditor

Attach the short clip. Check the destination's current character limit and split into two posts if necessary. This draft has not been posted.

## LinkedIn draft

A useful CI investigation starts with evidence you can inspect.

CI Efficiency Auditor is an early open-source CLI for collecting GitHub Actions metadata into local JSON. It keeps provider attempt identity, applies run/request budgets, and records incomplete coverage instead of silently presenting a partial picture as complete.

The current release collects evidence. It does not calculate savings or diagnose flaky tests. The demo replays a real saved public collection; the source includes the validation records and limitations.

I'm looking for developers willing to try it on a public repository and tell me what makes the output useful—or what is missing.

Source: https://github.com/HaMZAAsif043/CI-Efficiency-Auditor

## Show HN draft

**Title:** Show HN: CI Efficiency Auditor — local GitHub Actions snapshots with explicit coverage

I built a small open-source CLI that collects GitHub Actions runs, attempt outcomes, jobs and step timings into a versioned local JSON snapshot.

It uses bounded GET requests, preserves attempt identity, and records caps/missing data. I wanted a portable starting point for investigation without requiring a hosted dashboard. GitHub already provides metrics; this project currently focuses on the evidence artifact, not replacing those metrics.

This is early: collection is implemented; analysis and reports are still planned. The repository includes real public API verification and independent fixture tests. Windows has been checked; other platforms and private-repository authentication need more validation.

I'd appreciate feedback on whether the snapshot helps an actual investigation, and which conclusion you would want it to support next.

https://github.com/HaMZAAsif043/CI-Efficiency-Auditor

## Launch sequence and useful signals

1. Before launch: review the page/video, confirm clone/build instructions, make the landing public only if desired, and ensure the linked branch or PR is reviewable.
2. First release: share one clear demo and repository link in a community whose rules allow it. Do not mass-post identical copy.
3. First week: collect feedback from up to five willing users. Ask what investigation they attempted, what GitHub's existing tools answered, and what remained unclear.
4. Publish a permissioned case study only after a real result. Document the input, intervention and limitations; do not turn a suggested cache change into a savings claim.
5. Offer one fixed-scope audit only once you can demonstrate a useful finding. The CLI alone currently collects data; sell interpretation/implementation work only within your actual capability and agreement.

Early targets, not achieved metrics: 10 successful source installs, three concrete feedback reports, two repeat users and one useful investigation. Stars/views are discovery signals, not retention or revenue. Avoid donation/sponsorship forecasts until real adoption exists.

## Recording and maintenance

Start the static preview with marketing/scripts/preview.mjs and an absolute site directory. Use marketing/scripts/record-demo.mjs with an available playwright-core package path and Chromium executable path. Read the script before rerunning; it creates local screenshots/clips and exercises clipboard/download behavior in its isolated browser context.

Landing source is mirrored under site/ for GitHub review. Sites has a separate source checkout and hosting manifest; do not copy its .git, credentials or transient state into this repository. No credentials belong in a launch kit.
