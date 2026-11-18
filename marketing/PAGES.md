# GitHub Pages publishing

The user authorized public GitHub Pages hosting on 2026-11-18. Website files come from marketing/site/ and are published to the root of a dedicated gh-pages branch. Only curated public website/media files, LICENSE, .nojekyll and a deployment manifest are included. The CLI, private snapshots and Sites credentials are not published as website files.

## Publish an update

1. Review and commit changes to marketing/site/ and the publisher on a normal task branch.
2. Run node marketing/scripts/publish-pages.mjs to stage an inspectable local artifact without network mutation.
3. Run node marketing/scripts/publish-pages.mjs --push to commit the curated artifact and push normally to gh-pages. Existing published history is preserved; no force push is used.
4. Verify the repository's Pages source remains gh-pages, root, branch build mode. GitHub's built-in Pages workflow publishes subsequent branch updates.
5. Check the Pages build and live site. deployment.json identifies the source commit and hashes, so a saved source revision alone is not treated as proof of live publication.

The publisher refuses uncommitted site/publisher edits for actual deployment. It stages only explicit public filenames, then verifies the remote branch commit. GitHub authentication and permission to configure Pages are required; it never reads or prints tokens itself.

GitHub Pages serves this repository under /CI-Efficiency-Auditor/. Page styles, scripts, JSON, captions and video URLs are relative so they work beneath that prefix. Social/canonical metadata uses the public Pages URL. The original owner-private Sites deployment is independent and remains unchanged.

Source references: [GitHub publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Pages REST API](https://docs.github.com/en/rest/pages/pages). Deployment results and live checks are recorded in evidence/M2/VERIFICATION.md after execution.
