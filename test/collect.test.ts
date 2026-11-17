import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { collect } from '../src/github/collect.js';
import { createGitHubApi, type ApiResponse, type ReadOnlyApi } from '../src/github/api.js';
import { readSnapshot, writeSnapshot } from '../src/snapshot/io.js';
import { snapshotSchema } from '../src/snapshot/schema.js';
import { cacheIdentity } from '../src/snapshot/cache.js';
import { normalizeRun, rawRunSchema } from '../src/github/normalize.js';
import { options, rawJob, rawRun } from './fixtures/github.js';

const scratchRoot = resolve('.tmp');
const directories: string[] = [];
async function scratch() {
  await mkdir(scratchRoot, { recursive: true });
  const directory = await mkdtemp(join(scratchRoot, 'collect-test-'));
  directories.push(directory); return directory;
}
afterEach(async () => {
  for (const directory of directories.splice(0)) {
    if (!resolve(directory).startsWith(scratchRoot + sep)) throw new Error('Unexpected cleanup target');
    await rm(directory, { recursive: true, force: true });
  }
});

type Call = { path: string; params: Record<string, string | number> };
const response = (data: unknown, headers: ApiResponse['headers'] = {}): ApiResponse => ({ data, headers });
function fixtureApi(custom?: (call: Call) => ApiResponse | undefined): ReadOnlyApi & { calls: Call[] } {
  const calls: Call[] = [];
  return { calls, async get(path, params) {
    const call = { path, params }; calls.push(call);
    const special = custom?.(call); if (special) return special;
    if (path.endsWith('/runs')) return response({ total_count: 1, workflow_runs: [rawRun()] });
    if (path.endsWith('/jobs')) return response({ total_count: 1, jobs: [rawJob()] });
    return response(rawRun());
  } };
}
const httpError = (status: number, headers = {}) => ({ status, message: 'synthetic-secret-do-not-persist', response: { headers } });

describe('collection correctness and bounded requests', () => {
  test('deduplicates multi-page inventories, filters half-open window and keeps executions separate', async () => {
    const run = rawRun(10, 2);
    const other = rawRun(20);
    const old = rawRun(30, 1, { created_at: '2026-11-14T23:59:59Z' });
    const boundary = rawRun(40, 1, { created_at: options.window.to });
    const api = fixtureApi(({ path, params }) => {
      if (path.endsWith('/runs')) {
        const pages = [[run, old], [run, other], [boundary]];
        const page = Number(params.page);
        return response({ total_count: 4, workflow_runs: pages[page - 1] ?? [] }, page < 3 ? { link: '<ignored>; rel="next"' } : {});
      }
      if (path.endsWith('/jobs')) {
        if (path.includes('/20/')) return response({ total_count: 1, jobs: [rawJob(200, 20)] });
        if (path.includes('/attempts/2/')) return response({ total_count: 1, jobs: [rawJob(102, 10, 2)] });
        return Number(params.page) === 1
          ? response({ total_count: 2, jobs: [rawJob(100)] }, { link: '<ignored>; rel="next"' })
          : response({ total_count: 2, jobs: [rawJob(100), rawJob(101)] });
      }
      if (path.endsWith('/attempts/1')) return response(path.includes('/20/') ? other : rawRun(10, 1, { conclusion: 'failure' }));
      return response(path.includes('/20') ? other : run);
    });
    const snapshot = await collect(options, api, { pageSize: 2 });
    expect(snapshot.coverage.complete).toBe(true);
    expect(snapshot.runs.map(({ id }) => id)).toEqual([10, 20]);
    expect(snapshot.attempts.map(({ runId, number }) => [runId, number])).toEqual([[10, 1], [10, 2], [20, 1]]);
    expect(snapshot.jobs.map(({ id, attempt }) => [id, attempt])).toEqual([[100, 1], [101, 1], [102, 2], [200, 1]]);
    expect(snapshot.attempts[0]?.conclusion).toBe('failure');
    expect(snapshot.coverage.requestCount).toBe(api.calls.length);
    expect(api.calls.every(({ path }) => path.startsWith('/repos/acme/widget/actions/runs'))).toBe(true);
  });

  test('does not synthesize executions for inherited jobs in a partial rerun', async () => {
    const api = fixtureApi(({ path }) => {
      if (path.endsWith('/runs')) return response({ total_count: 1, workflow_runs: [rawRun(10, 2)] });
      if (path.endsWith('/jobs')) return response({ total_count: 1, jobs: [rawJob(100, 10, 1)] });
      return response(rawRun(10, path.endsWith('/attempts/1') ? 1 : 2));
    });
    const result = await collect(options, api);
    expect(result.jobs.map(({ id, attempt }) => [id, attempt])).toEqual([[100, 1]]);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'inherited_job_ignored', severity: 'warning' }));
  });

  test('run cap, provider cap and request cap are explicit', async () => {
    const api = fixtureApi(({ path }) => path.endsWith('/runs') ? response({ total_count: 1005, workflow_runs: [rawRun(10), rawRun(20)] }) : undefined);
    const result = await collect({ ...options, maxRuns: 1, maxRequests: 2 }, api);
    expect(result.runs).toHaveLength(1);
    expect(result.coverage.complete).toBe(false);
    expect(result.coverage.reasons).toEqual(expect.arrayContaining(['run_limit', 'provider_search_cap', 'request_limit']));
    expect(api.calls).toHaveLength(2);
  });

  test('deliberately skipping the rest of a fetched page is a run cap, not malformed API data', async () => {
    const api = fixtureApi(({ path }) => path.endsWith('/runs')
      ? response({ total_count: 3, workflow_runs: [rawRun(10), rawRun(20), rawRun(30)] }) : undefined);
    const result = await collect({ ...options, maxRuns: 1 }, api);
    expect(result.coverage.reasons).toEqual(['run_limit']);
  });

  test('missing attempt, access failure and malformed pages cannot report complete coverage', async () => {
    for (const status of [403, 404]) {
      const api = fixtureApi(({ path }) => { if (path.includes('/attempts/')) throw httpError(status); return undefined; });
      const result = await collect(options, api);
      expect(result.coverage.complete).toBe(false);
      expect(result.coverage.reasons).toContain(`http_${status}`);
      expect(JSON.stringify(result)).not.toContain('synthetic-secret');
    }
    const result = await collect(options, fixtureApi(({ path }) => path.endsWith('/jobs') ? response({ total_count: 2, jobs: [] }) : undefined));
    expect(result.coverage.reasons).toContain('malformed_response');
  });

  test.each([401, 403, 404])('initial HTTP %s fails safely without pointless retries', async (status) => {
    const api = fixtureApi(() => { throw httpError(status); });
    await expect(collect(options, api)).rejects.toMatchObject({ code: `http_${status}`, exitCode: 2 });
    expect(api.calls).toHaveLength(1);
  });

  test('retry-after is honored, retries consume the budget, and automatic retries are finite', async () => {
    let failures = 0;
    const api = fixtureApi(() => { if (failures++ < 2) throw httpError(429, { 'retry-after': '1' }); return undefined; });
    const sleep = vi.fn(async (_ms: number) => undefined);
    const result = await collect(options, api, { sleep });
    expect(result.coverage.complete).toBe(true);
    expect(sleep.mock.calls).toEqual([[1000], [1000]]);
    expect(result.coverage.requestCount).toBe(6);
    const failing = fixtureApi(() => { throw httpError(503); });
    const partial = await collect(options, failing, { sleep });
    expect(failing.calls).toHaveLength(3);
    expect(partial.coverage.reasons).toContain('server_error');
  });

  test('does not retry before a long provider wait or keep working after interruption', async () => {
    const limited = fixtureApi(({ path }) => { if (path.includes('/attempts')) throw httpError(429, { 'retry-after': '60' }); return undefined; });
    const sleep = vi.fn(async () => undefined);
    const result = await collect(options, limited, { sleep });
    expect(result.coverage.reasons).toContain('retry_wait_exceeds_limit');
    expect(sleep).not.toHaveBeenCalled();
    const controller = new AbortController();
    const aborted = fixtureApi(({ path }) => { if (path.includes('/attempts')) { controller.abort(); throw Error('secret'); } return undefined; });
    const interrupted = await collect(options, aborted, { signal: controller.signal });
    expect(interrupted.coverage.reasons).toContain('collection_interrupted');
    expect(aborted.calls).toHaveLength(2);
  });

  test('retains unknown times and marks in-flight changes instead of pretending zero cost', async () => {
    const api = fixtureApi(({ path }) => {
      if (path.endsWith('/jobs')) return response({ total_count: 1, jobs: [rawJob(100, 10, 1, { completed_at: null, status: 'in_progress' })] });
      if (path.endsWith('/runs/10')) return response(rawRun(10, 2));
      return undefined;
    });
    const result = await collect(options, api);
    expect(result.jobs[0]?.completedAt).toBeNull();
    expect(result.coverage.reasons).toEqual(expect.arrayContaining(['missing_timestamps', 'in_progress', 'run_changed']));
  });

  test('missing steps and malformed inventory counts remain incomplete', async () => {
    const missingSteps = await collect(options, fixtureApi(({ path }) => path.endsWith('/jobs')
      ? response({ total_count: 1, jobs: [rawJob(100, 10, 1, { steps: undefined })] }) : undefined));
    expect(missingSteps.coverage.reasons).toContain('missing_steps');
    const missingRuns = await collect(options, fixtureApi(({ path }) => path.endsWith('/runs')
      ? response({ total_count: 1, workflow_runs: [] }) : undefined));
    expect(missingRuns.coverage.reasons).toContain('malformed_response');
  });

  test('an unfinished attempt cannot produce a complete snapshot even without jobs', async () => {
    const result = await collect(options, fixtureApi(({ path }) => {
      if (path.endsWith('/attempts/1')) return response(rawRun(10, 1, { status: 'in_progress', conclusion: null }));
      if (path.endsWith('/jobs')) return response({ total_count: 0, jobs: [] });
      return undefined;
    }));
    expect(result.coverage.complete).toBe(false);
    expect(result.coverage.reasons).toContain('in_progress');
  });

  test('missing job attempt identity never invents an execution during a partial rerun', async () => {
    const result = await collect(options, fixtureApi(({ path }) => {
      if (path.endsWith('/runs')) return response({ total_count: 1, workflow_runs: [rawRun(10, 2)] });
      if (path.endsWith('/jobs')) return response({ total_count: 1, jobs: [rawJob(100, 10, 1, { run_attempt: undefined })] });
      return response(rawRun(10, path.endsWith('/attempts/1') ? 1 : 2));
    }));
    expect(result.coverage.complete).toBe(false);
    expect(result.coverage.reasons).toContain('missing_job_attempt');
    expect(result.jobs).toEqual([]);
  });
});

describe('cache identity, safe snapshots and output', () => {
  test('refreshes inventory, uses only completed cache entries, and invalidates new attempts', async () => {
    const cacheDirectory = await scratch();
    const firstApi = fixtureApi();
    await collect({ ...options, cacheDirectory }, firstApi);
    const cachedApi = fixtureApi();
    const cached = await collect({ ...options, cacheDirectory }, cachedApi);
    expect(cached.coverage.cache.hits).toBe(1);
    expect(cachedApi.calls.map(({ path }) => path)).toEqual(['/repos/acme/widget/actions/runs', '/repos/acme/widget/actions/runs/10']);
    const rerunApi = fixtureApi(({ path }) => {
      if (path.endsWith('/runs')) return response({ total_count: 1, workflow_runs: [rawRun(10, 2)] });
      if (path.endsWith('/jobs')) return response({ total_count: 1, jobs: [rawJob(100 + (path.includes('/attempts/2/') ? 1 : 0), 10, path.includes('/attempts/2/') ? 2 : 1)] });
      return response(rawRun(10, path.endsWith('/attempts/1') ? 1 : 2));
    });
    const rerun = await collect({ ...options, cacheDirectory }, rerunApi);
    expect(rerun.coverage.cache.hits).toBe(0);
    expect(rerun.attempts).toHaveLength(2);
    expect(cacheIdentity(options.repository, options.window, normalizeRun(rawRunSchema.parse(rawRun()), options.repository), 1))
      .not.toBe(cacheIdentity('other/repo', options.window, normalizeRun(rawRunSchema.parse(rawRun()), options.repository), 1));
    const newWindow = await collect({ ...options, window: { ...options.window, from: '2026-11-15T00:30:00Z' }, cacheDirectory }, fixtureApi());
    expect(newWindow.coverage.cache.hits).toBe(0);
    const otherRepo = await collect({ ...options, repository: 'another/widget', cacheDirectory }, fixtureApi());
    expect(otherRepo.coverage.cache.hits).toBe(0);
  });

  test('corrupt cache falls back to API; in-progress data is never cached', async () => {
    const cacheDirectory = await scratch();
    await collect({ ...options, cacheDirectory }, fixtureApi());
    const name = (await readdir(cacheDirectory))[0]!;
    await writeFile(join(cacheDirectory, name), '{invalid');
    const result = await collect({ ...options, cacheDirectory }, fixtureApi());
    expect(result.coverage.complete).toBe(true);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'cache_invalid' }));
    const activeDirectory = await scratch();
    const active = fixtureApi(({ path }) => path.endsWith('/jobs') ? undefined : path.endsWith('/runs')
      ? response({ total_count: 1, workflow_runs: [rawRun(10, 1, { status: 'in_progress', conclusion: null })] })
      : response(rawRun(10, 1, { status: 'in_progress', conclusion: null })));
    await collect({ ...options, cacheDirectory: activeDirectory }, active);
    expect(await readdir(activeDirectory)).toEqual([]);
  });

  test('strips extra API fields, validates schema versions, and atomically preserves valid output on failure', async () => {
    const directory = await scratch();
    const api = fixtureApi(({ path }) => path.endsWith('/runs')
      ? response({ total_count: 1, workflow_runs: [rawRun(10, 1, { raw_logs: 'SECRET_LOG', token: 'SECRET_TOKEN', source: 'PRIVATE_SOURCE' })] })
      : undefined);
    const snapshot = await collect(options, api);
    expect(JSON.stringify(snapshot)).not.toMatch(/SECRET_LOG|SECRET_TOKEN|PRIVATE_SOURCE/);
    const destination = join(directory, 'snapshot.json');
    await writeSnapshot(destination, snapshot);
    await expect(writeSnapshot(destination, { ...snapshot, schemaVersion: 2 })).rejects.toThrow();
    expect(await readSnapshot(destination)).toEqual(snapshot);
    await expect(writeSnapshot(join(destination, 'blocked.json'), snapshot)).rejects.toThrow();
    expect(await readSnapshot(destination)).toEqual(snapshot);
    await expect(writeSnapshot(directory, snapshot)).rejects.toThrow();
    expect(await readSnapshot(destination)).toEqual(snapshot);
    await writeFile(join(directory, 'unknown.json'), JSON.stringify({ ...snapshot, schemaVersion: 2 }));
    await expect(readSnapshot(join(directory, 'unknown.json'))).rejects.toThrow(/unsupported schema/);
    expect(snapshotSchema.safeParse({ ...snapshot, token: 'secret' }).success).toBe(false);
    expect(await readFile(destination, 'utf8')).not.toContain('SECRET');
  });

  test('production API adapter sends only GET to fixed GitHub routes and disables redirects', async () => {
    const requests: { url: string; method: string; redirect?: RequestRedirect }[] = [];
    const fetcher: typeof fetch = async (input, init) => {
      requests.push({ url: String(input), method: init?.method ?? 'GET', ...(init?.redirect ? { redirect: init.redirect } : {}) });
      return new Response(JSON.stringify({ total_count: 0, workflow_runs: [] }), { status: 200, headers: { 'content-type': 'application/json' } });
    };
    const api = createGitHubApi('synthetic-secret-do-not-persist', fetcher);
    const snapshot = await collect(options, api);
    expect(snapshot.coverage.complete).toBe(true);
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({ method: 'GET', redirect: 'error' });
    expect(requests[0]?.url).toMatch(/^https:\/\/api.github.com\/repos\/acme\/widget\/actions\/runs\?/);
    await expect(api.get('/repos/acme/widget/actions/runs/10/rerun', {})).rejects.toThrow(/Unsupported/);
    expect(requests).toHaveLength(1);
    expect(JSON.stringify(snapshot)).not.toContain('synthetic-secret');
  });
});
