import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { readSnapshot } from '../dist/snapshot/io.js';

const [path, output] = process.argv.slice(2);
assert.ok(path && output, 'Usage: node scripts/verify-public-snapshot.mjs snapshot.json checks.json');
const snapshot = await readSnapshot(path);
const run = snapshot.runs[0];
const job = snapshot.jobs.find((value) => value.runId === run?.id);
assert.ok(run && job, 'Use a public snapshot with at least one run and job.');
const attempt = snapshot.attempts.find((value) => value.runId === run.id && value.number === job.attempt);
assert.ok(attempt);
const checks = [];
for (const resource of [
  `/repos/${snapshot.repository}/actions/runs/${run.id}/attempts/${attempt.number}`,
  `/repos/${snapshot.repository}/actions/runs/${run.id}/attempts/${attempt.number}/jobs?per_page=100`,
]) {
  const response = await fetch(`https://api.github.com${resource}`, {
    method: 'GET', redirect: 'error', signal: AbortSignal.timeout(15_000),
    headers: { accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': snapshot.apiVersion, 'user-agent': 'ci-audit-public-verification' },
  });
  assert.equal(response.status, 200, `Public verification HTTP status ${response.status}`);
  const data = await response.json();
  if (resource.includes('/jobs?')) {
    const actual = data.jobs.find((value) => value.id === job.id);
    assert.ok(actual, 'Expected job must be present in independent response.');
    assert.equal(actual.run_id, run.id);
    if (actual.run_attempt !== undefined) assert.equal(actual.run_attempt, job.attempt);
    checks.push({ method: 'GET', resource, status: response.status, jobId: actual.id, runId: actual.run_id,
      attempt: actual.run_attempt ?? null, identityMatches: true });
  } else {
    assert.equal(data.id, run.id); assert.equal(data.run_attempt, attempt.number); assert.equal(data.head_sha, run.sha);
    checks.push({ method: 'GET', resource, status: response.status, runId: data.id, attempt: data.run_attempt,
      commitMatches: true, identityMatches: true });
  }
}
await writeFile(output, JSON.stringify({ checkedAt: new Date().toISOString(), repository: snapshot.repository,
  apiVersion: snapshot.apiVersion, authentication: 'anonymous', snapshotComplete: snapshot.coverage.complete,
  collectionRequests: snapshot.coverage.requestCount, independentVerificationRequests: checks.length, checks }, null, 2) + '\n');
console.log('PASS: independent public GET responses match the snapshot run, attempt, commit and job identities.');
