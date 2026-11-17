import { z } from 'zod';
import { API_VERSION, type ApiResponse, type ReadOnlyApi } from './api.js';
import { jobPageSchema, normalizeAttempt, normalizeJob, normalizeRun, rawRunSchema, runPageSchema } from './normalize.js';
import { repositorySchema, snapshotSchema, windowSchema, type Diagnostic, type DiagnosticCode, type Run, type Snapshot, type Attempt, type Job } from '../snapshot/schema.js';
import { cacheIdentity, readAttemptCache, writeAttemptCache } from '../snapshot/cache.js';

export const collectionOptionsSchema = z.object({
  repository: repositorySchema, window: windowSchema.refine(({ from, to }) => Date.parse(to) - Date.parse(from) <= 90 * 86_400_000), version: z.string(),
  maxRuns: z.number().int().min(1).max(1000).default(500),
  maxRequests: z.number().int().min(1).max(10_000).default(2000),
  cacheDirectory: z.string().optional(),
});
export type CollectionOptions = z.input<typeof collectionOptionsSchema>;
export class CollectionFailure extends Error {
  constructor(readonly code: DiagnosticCode, readonly exitCode: 1 | 2 | 3 = 3) { super(code); }
}
interface Controls {
  signal?: AbortSignal;
  now?: () => Date;
  sleep?: (milliseconds: number) => Promise<void>;
  pageSize?: number;
}

export async function collect(input: CollectionOptions, api: ReadOnlyApi, controls: Controls = {}): Promise<Snapshot> {
  const options = collectionOptionsSchema.parse(input);
  const now = controls.now ?? (() => new Date());
  const sleep = controls.sleep ?? ((ms: number) => new Promise<void>((done) => setTimeout(done, ms)));
  const pageSize = Math.min(100, Math.max(1, controls.pageSize ?? 100));
  const diagnostics: Diagnostic[] = [];
  const runs = new Map<number, Run>();
  const attempts = new Map<string, Attempt>();
  const jobs = new Map<string, Job>();
  const cache = { hits: 0, misses: 0, oldestEntryAt: null as string | null };
  let requestCount = 0;
  let halt = false;
  const prefix = `/repos/${options.repository}/actions/runs`;

  function diagnose(code: DiagnosticCode, runId?: number, attempt?: number, severity: Diagnostic['severity'] = 'incomplete') {
    if (!diagnostics.some((value) => value.code === code && value.runId === runId && value.attempt === attempt && value.severity === severity)) {
      diagnostics.push({ code, severity, ...(runId ? { runId } : {}), ...(attempt ? { attempt } : {}) });
    }
  }
  async function get(path: string, params: Record<string, string | number> = {}): Promise<ApiResponse> {
    for (let retry = 0; retry <= 2; retry++) {
      if (controls.signal?.aborted) throw new CollectionFailure('collection_interrupted');
      if (requestCount >= options.maxRequests) throw new CollectionFailure('request_limit');
      requestCount++;
      try {
        return await api.get(path, params, controls.signal);
      } catch (error: unknown) {
        if (controls.signal?.aborted) throw new CollectionFailure('collection_interrupted');
        const details = (typeof error === 'object' && error !== null ? error : {}) as {
          status?: number; response?: { headers?: Record<string, string | number | undefined> };
        };
        const status = details.status;
        const headers = details.response?.headers ?? {};
        if (status === 401) throw new CollectionFailure('http_401', 2);
        if (status === 404) throw new CollectionFailure('http_404');
        const limited = status === 429 || (status === 403 && (String(headers['x-ratelimit-remaining']) === '0' || headers['retry-after'] !== undefined));
        if (status === 403 && !limited) throw new CollectionFailure('http_403');
        const code: DiagnosticCode = limited ? 'rate_limit' : status && status >= 500 ? 'server_error' : 'transport_error';
        if (retry === 2 || (status !== undefined && status < 500 && !limited)) throw new CollectionFailure(code);
        let wait = 250 * (retry + 1);
        if (limited) {
          const after = headers['retry-after'];
          if (after !== undefined) {
            wait = /^\d+(\.\d+)?$/.test(String(after)) ? Number(after) * 1000 : Date.parse(String(after)) - now().getTime();
          } else if (headers['x-ratelimit-reset'] !== undefined) {
            wait = Number(headers['x-ratelimit-reset']) * 1000 - now().getTime();
          } else {
            // A secondary limit without a retry time is unsafe to retry immediately.
            throw new CollectionFailure('rate_limit');
          }
          if (!Number.isFinite(wait) || wait > 10_000) throw new CollectionFailure('retry_wait_exceeds_limit');
        }
        await sleep(Math.max(0, wait));
      }
    }
    throw new CollectionFailure('transport_error');
  }
  function handle(error: unknown, runId?: number, attempt?: number) {
    const failure = error instanceof CollectionFailure ? error : new CollectionFailure('malformed_response');
    if (failure.exitCode === 2) throw failure;
    diagnose(failure.code, runId, attempt);
    if (['request_limit', 'collection_interrupted', 'rate_limit', 'retry_wait_exceeds_limit', 'transport_error', 'server_error'].includes(failure.code)) halt = true;
  }

  // Always refresh the run inventory. Cache entries cannot create a stale run list.
  const rawRunIds = new Set<number>();
  try {
    for (let page = 1; page <= Math.ceil(1000 / pageSize); page++) {
      const response = await get(prefix, { created: `${options.window.from}..${options.window.to}`, per_page: pageSize, page });
      const data = runPageSchema.parse(response.data);
      if (data.total_count > 1000) diagnose('provider_search_cap');
      for (const value of data.workflow_runs) rawRunIds.add(value.id);
      for (const value of data.workflow_runs) {
        const created = Date.parse(value.created_at);
        if (created < Date.parse(options.window.from) || created >= Date.parse(options.window.to)) continue;
        if (runs.has(value.id)) continue;
        if (runs.size >= options.maxRuns) { diagnose('run_limit'); break; }
        runs.set(value.id, normalizeRun(value, options.repository));
      }
      const more = String(response.headers.link ?? '').includes('rel="next"') || (data.workflow_runs.length === pageSize && page * pageSize < data.total_count);
      if (!more) {
        if (rawRunIds.size < Math.min(data.total_count, 1000)) diagnose('malformed_response');
        break;
      }
      if (runs.size >= options.maxRuns) { diagnose('run_limit'); break; }
      if (page * pageSize >= 1000) diagnose('provider_search_cap');
    }
  } catch (error) {
    if (error instanceof CollectionFailure && requestCount === 1 && !controls.signal?.aborted) {
      throw new CollectionFailure(error.code, ['http_401', 'http_403', 'http_404'].includes(error.code) ? 2 : 1);
    }
    handle(error);
  }

  for (const run of runs.values()) {
    if (halt) break;
    if (run.status !== 'completed') diagnose('in_progress', run.id);
    for (let number = 1; number <= run.attempt && !halt; number++) {
      const identity = cacheIdentity(options.repository, options.window, run, number);
      try {
        let cached = null;
        if (options.cacheDirectory && run.status === 'completed') {
          try { cached = await readAttemptCache(options.cacheDirectory, identity); }
          catch { diagnose('cache_invalid', run.id, number, 'warning'); }
          if (!cached) cache.misses++;
        }
        if (cached && (cached.attempt.runId !== run.id || cached.attempt.number !== number || cached.attempt.status !== 'completed' || cached.jobs.some((job) => job.runId !== run.id || job.attempt !== number))) {
          diagnose('cache_invalid', run.id, number, 'warning'); cached = null; cache.misses++;
        }
        if (cached) {
          cache.hits++;
          if (cache.oldestEntryAt === null || cached.cachedAt < cache.oldestEntryAt) cache.oldestEntryAt = cached.cachedAt;
          attempts.set(`${run.id}:${number}`, cached.attempt);
          for (const job of cached.jobs) jobs.set(`${job.id}:${job.attempt}`, job);
          continue;
        }
        const rawAttempt = rawRunSchema.parse((await get(`${prefix}/${run.id}/attempts/${number}`)).data);
        if (rawAttempt.id !== run.id || rawAttempt.run_attempt !== number || rawAttempt.head_sha !== run.sha) throw new CollectionFailure('run_changed');
        const normalized = normalizeAttempt(rawAttempt);
        attempts.set(`${run.id}:${number}`, normalized);
        const attemptJobs = new Map<string, Job>();
        const rawJobIds = new Set<string>();
        const before = diagnostics.filter((value) => value.severity === 'incomplete').length;
        for (let page = 1; ; page++) {
          const response = await get(`${prefix}/${run.id}/attempts/${number}/jobs`, { per_page: pageSize, page });
          const data = jobPageSchema.parse(response.data);
          for (const value of data.jobs) {
            rawJobIds.add(`${value.id}:${value.run_attempt ?? number}`);
            if (value.steps === undefined) diagnose('missing_steps', run.id, number);
            const job = normalizeJob(value, options.repository, number);
            if (job.runId !== run.id || job.attempt > number) { diagnose('job_identity_mismatch', run.id, number); continue; }
            if (job.attempt < number) { diagnose('inherited_job_ignored', run.id, number, 'warning'); continue; }
            const key = `${job.id}:${job.attempt}`;
            jobs.set(key, job); attemptJobs.set(key, job);
          }
          const more = String(response.headers.link ?? '').includes('rel="next"') || (data.jobs.length === pageSize && page * pageSize < data.total_count);
          if (!more) {
            if (rawJobIds.size < data.total_count) diagnose('malformed_response', run.id, number);
            break;
          }
          if (data.jobs.length === 0) throw new CollectionFailure('malformed_response');
        }
        const cacheableJobs = [...attemptJobs.values()].every((job) => job.status === 'completed' && (job.conclusion === 'skipped' || (job.startedAt && job.completedAt)) && job.steps.every((step) => step.conclusion === 'skipped' || (step.startedAt && step.completedAt)));
        if (options.cacheDirectory && run.status === 'completed' && normalized.status === 'completed' && cacheableJobs && diagnostics.filter((value) => value.severity === 'incomplete').length === before) {
          try { await writeAttemptCache(options.cacheDirectory, { identity, cachedAt: now().toISOString(), attempt: normalized, jobs: [...attemptJobs.values()] }); }
          catch { diagnose('cache_unavailable', run.id, number, 'warning'); }
        }
      } catch (error) {
        if (error instanceof CollectionFailure && error.code === 'http_404') diagnose('missing_attempt', run.id, number);
        handle(error, run.id, number);
      }
    }
    if (!halt) {
      try {
        const refreshed = rawRunSchema.parse((await get(`${prefix}/${run.id}`)).data);
        if (refreshed.id !== run.id || refreshed.run_attempt !== run.attempt || refreshed.status !== run.status || refreshed.head_sha !== run.sha || refreshed.updated_at !== run.updatedAt) diagnose('run_changed', run.id);
      } catch (error) { handle(error, run.id); }
    }
  }
  for (const job of jobs.values()) {
    if (job.status !== 'completed') diagnose('in_progress', job.runId, job.attempt);
    if (job.conclusion !== 'skipped' && (!job.startedAt || !job.completedAt)) diagnose('missing_timestamps', job.runId, job.attempt);
    if (job.steps.some((step) => step.conclusion !== 'skipped' && (!step.startedAt || !step.completedAt))) diagnose('missing_timestamps', job.runId, job.attempt);
  }
  if (controls.signal?.aborted && !diagnostics.some((value) => value.code === 'collection_interrupted')) diagnose('collection_interrupted');
  const reasons = [...new Set(diagnostics.filter((value) => value.severity === 'incomplete').map((value) => value.code))].sort();
  return snapshotSchema.parse({ schemaVersion: 1, collectorVersion: options.version, collectedAt: now().toISOString(),
    repository: options.repository, apiVersion: API_VERSION, window: options.window,
    coverage: { complete: reasons.length === 0, reasons, requestCount, maxRequests: options.maxRequests,
      maxRuns: options.maxRuns, returnedRunCount: runs.size, cache },
    runs: [...runs.values()].sort((a, b) => a.id - b.id),
    attempts: [...attempts.values()].sort((a, b) => a.runId - b.runId || a.number - b.number),
    jobs: [...jobs.values()].sort((a, b) => a.id - b.id || a.attempt - b.attempt), diagnostics });
}
