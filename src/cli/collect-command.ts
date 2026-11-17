import { z } from 'zod';
import { createGitHubApi } from '../github/api.js';
import { collect, CollectionFailure } from '../github/collect.js';
import { repositorySchema, timestamp } from '../snapshot/schema.js';
import { writeSnapshot } from '../snapshot/io.js';

const flagsSchema = z.object({
  repo: repositorySchema, out: z.string().min(1), days: z.coerce.number().int().min(1).max(90).default(30),
  from: timestamp.optional(), to: timestamp.optional(), maxRuns: z.coerce.number().int().min(1).max(1000).default(500),
  maxRequests: z.coerce.number().int().min(1).max(10_000).default(2000),
  cache: z.boolean().default(true), cacheDir: z.string().min(1).default('.cache/ci-audit'), anonymous: z.boolean().default(false),
});

export async function runCollection(rawFlags: unknown, version: string): Promise<number> {
  const parsed = flagsSchema.safeParse(rawFlags);
  if (!parsed.success) {
    process.stderr.write('error: Invalid collection options. Use owner/repo, ISO dates, days 1-90 and positive bounded limits; see collect --help.\n');
    return 2;
  }
  const flags = parsed.data;
  const to = new Date(flags.to ?? Date.now());
  const from = new Date(flags.from ?? (to.getTime() - flags.days * 86_400_000));
  if (from >= to || to.getTime() - from.getTime() > 90 * 86_400_000) {
    process.stderr.write('error: Collection window must be positive and at most 90 days.\n');
    return 2;
  }
  const controller = new AbortController();
  const interrupt = () => controller.abort();
  process.once('SIGINT', interrupt);
  try {
    const snapshot = await collect({ repository: flags.repo, version,
      window: { from: from.toISOString(), to: to.toISOString() }, maxRuns: flags.maxRuns, maxRequests: flags.maxRequests,
      ...(flags.cache ? { cacheDirectory: flags.cacheDir } : {}),
    }, createGitHubApi(flags.anonymous ? undefined : process.env.GITHUB_TOKEN), { signal: controller.signal });
    try { await writeSnapshot(flags.out, snapshot); }
    catch {
      process.stderr.write('error: Unable to write snapshot. Check the output path and permissions; existing output was not intentionally removed.\n');
      return 1;
    }
    process.stdout.write(`${snapshot.coverage.complete ? 'Complete' : 'Partial'} snapshot: ${snapshot.runs.length} runs, ${snapshot.attempts.length} attempts, ${snapshot.jobs.length} jobs, ${snapshot.coverage.requestCount} requests.\n`);
    if (!snapshot.coverage.complete) process.stderr.write(`Incomplete coverage: ${snapshot.coverage.reasons.join(', ')}.\n`);
    return snapshot.coverage.complete ? 0 : 3;
  } catch (error) {
    if (error instanceof CollectionFailure) {
      process.stderr.write(`error: Collection failed (${error.code}). Check repository access, credentials or network; see collect --help.\n`);
      return error.exitCode === 3 ? 1 : error.exitCode;
    }
    process.stderr.write('error: Collection failed. No successful audit is claimed.\n');
    return 1;
  } finally {
    process.removeListener('SIGINT', interrupt);
  }
}
