# F4 - Local reports

Status: planned. Dependencies: F3. Completion evidence: none.

## Outcome and scope

Generate self-contained HTML and Markdown reports from a snapshot, offline after collection. Prioritize a small number of useful findings and preserve evidence/limitations for all reported values.

## Acceptance criteria

- [ ] F4-A1: Report shows repository, window, collection timestamp/version, coverage, units, observed totals and prioritized findings with supporting run/job links.
- [ ] F4-A2: Every finding explains observation versus heuristic and the next investigation; suggestions are not presented as achieved savings.
- [ ] F4-A3: Empty/partial snapshots and unknown durations produce readable states and limitations without green/success wording that hides missing coverage.
- [ ] F4-A4: Script tags, HTML attributes, Markdown link syntax and malicious URLs in input render safely; evidence URLs are validated. Output contains no remote assets or executable content.
- [ ] F4-A5: HTML is readable in a browser at desktop and narrow widths, with usable keyboard focus on links; Markdown is readable as plain text. Inspect at least one actual generated artifact of each format.
- [ ] F4-A6: Output matches analysis values, works offline without extra network requests, and follows documented exit behavior for complete/partial data and output errors.

## Proof

Save synthetic sample HTML/Markdown, render-safety checks, command exits and browser observation notes with optional screenshots. A screenshot supports layout; independent numeric tests establish correctness. Keep actual private reports out of public evidence.
