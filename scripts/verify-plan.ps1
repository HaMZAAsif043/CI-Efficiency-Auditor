param(
    [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
$planRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$failures = [System.Collections.Generic.List[string]]::new()
$excludedDirectories = @('.git', 'node_modules', '.cache', '.tmp', 'dist', 'coverage', 'snapshots', 'reports')
function Get-PlanningMarkdown([string]$directory) {
    Get-ChildItem -LiteralPath $directory -Filter '*.md' -File
    foreach ($child in Get-ChildItem -LiteralPath $directory -Directory) {
        if ($excludedDirectories -notcontains $child.Name) { Get-PlanningMarkdown $child.FullName }
    }
}
$markdownFiles = @(Get-PlanningMarkdown $planRoot)
$localLinkCount = 0
$acceptanceCount = 0

foreach ($document in $markdownFiles) {
    $body = [System.IO.File]::ReadAllText($document.FullName)
    foreach ($link in [regex]::Matches($body, '\[[^\]\r\n]+\]\(([^)\r\n]+)\)')) {
        $target = $link.Groups[1].Value.Trim().Trim('<', '>')
        if ($target -match '^[a-zA-Z][a-zA-Z0-9+.-]*:' -or $target.StartsWith('#')) {
            continue
        }
        $target = ($target -split '#', 2)[0]
        $localLinkCount++
        $resolved = [System.IO.Path]::GetFullPath((Join-Path $document.DirectoryName $target))
        if (-not (Test-Path -LiteralPath $resolved)) {
            $failures.Add("Missing link in $($document.Name): $target")
        }
    }
}

$roadmap = [System.IO.File]::ReadAllText((Join-Path $planRoot 'ROADMAP.md'))
for ($featureNumber = 0; $featureNumber -le 6; $featureNumber++) {
    $featureId = "F$featureNumber"
    $cards = @(Get-ChildItem -LiteralPath (Join-Path $planRoot 'features') -Filter "$featureId-*.md" -File)
    if ($cards.Count -ne 1) {
        $failures.Add("Expected exactly one card for $featureId; found $($cards.Count).")
        continue
    }
    $card = $cards[0]
    $body = [System.IO.File]::ReadAllText($card.FullName)
    if ($body -notmatch '(?m)^Status: (planned|in_progress|implemented|verified|ready_for_review|blocked)\.') {
        $failures.Add("Missing or unsupported status in $($card.Name).")
    }
    $criteria = @([regex]::Matches($body, '(?m)^- \[[ xX]\] (F\d+-A\d+):'))
    if ($criteria.Count -eq 0) {
        $failures.Add("No numbered acceptance criteria in $($card.Name).")
    }
    $ids = @($criteria | ForEach-Object { $_.Groups[1].Value })
    $acceptanceCount += $ids.Count
    if (@($ids | Select-Object -Unique).Count -ne $ids.Count) {
        $failures.Add("Duplicate acceptance IDs in $($card.Name).")
    }
    foreach ($criterionId in $ids) {
        if (-not $criterionId.StartsWith("$featureId-A")) {
            $failures.Add("Wrong acceptance ID $criterionId in $($card.Name).")
        }
    }
    if (-not $roadmap.Contains("./features/$($card.Name)")) {
        $failures.Add("Roadmap does not link $($card.Name).")
    }
}

Write-Output "Markdown files inspected: $($markdownFiles.Count)"
Write-Output "Local links checked: $localLinkCount"
Write-Output 'Feature cards inspected: 7'
Write-Output "Numbered acceptance criteria: $acceptanceCount"
if ($failures.Count -gt 0) {
    foreach ($failure in $failures) { Write-Output "FAIL: $failure" }
    exit 1
}
Write-Output 'PASS: planning links and acceptance-card structure.'
Write-Output 'Application implementation and feature verification: not checked by this script.'
exit 0
