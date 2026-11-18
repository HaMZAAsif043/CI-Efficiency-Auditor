# LinkedIn post — straightforward demo

I've got the first part of CI Efficiency Auditor working: collecting GitHub Actions history into a local JSON file for investigation.

This clip shows a real run against the public cli/cli repository. I limit it to one workflow run, so it returns a partial snapshot and exit code 3. The output makes that limit explicit.

It collects runs, attempts, jobs and step timings. It doesn't recommend fixes yet—analysis and reports are the next step.

If you use GitHub Actions, what would you want to investigate with this data?

https://github.com/HaMZAAsif043/CI-Efficiency-Auditor

#OpenSource #GitHubActions
