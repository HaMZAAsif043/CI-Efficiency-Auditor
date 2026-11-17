import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { z } from 'zod';
import { atomicJson } from './io.js';
import { attemptSchema, jobSchema, timestamp, windowSchema, type Run } from './schema.js';

const entrySchema = z.object({
  identity: z.string(), cachedAt: timestamp, attempt: attemptSchema, jobs: z.array(jobSchema),
}).strict();
export type CacheEntry = z.infer<typeof entrySchema>;

export function cacheIdentity(repository: string, window: z.infer<typeof windowSchema>, run: Run, attempt: number): string {
  return JSON.stringify([1, repository.toLowerCase(), window.from, window.to, run.id, run.sha, run.attempt, run.updatedAt, attempt]);
}
function cachePath(directory: string, identity: string): string {
  return join(directory, createHash('sha256').update(identity).digest('hex') + '.json');
}
export async function readAttemptCache(directory: string, identity: string): Promise<CacheEntry | null> {
  try {
    const entry = entrySchema.parse(JSON.parse(await readFile(cachePath(directory, identity), 'utf8')));
    if (entry.identity !== identity) throw new Error('Cache identity mismatch');
    return entry;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return null;
    throw new Error('Cache unavailable or invalid');
  }
}
export async function writeAttemptCache(directory: string, entry: CacheEntry): Promise<void> {
  await atomicJson(cachePath(directory, entry.identity), entrySchema.parse(entry));
}
