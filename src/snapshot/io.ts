import { mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { snapshotSchema, type Snapshot } from './schema.js';

export async function atomicJson(path: string, value: unknown): Promise<void> {
  const destination = resolve(path);
  await mkdir(dirname(destination), { recursive: true, mode: 0o700 });
  const temporary = `${destination}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    await rename(temporary, destination);
  } finally {
    await unlink(temporary).catch(() => undefined);
  }
}

export async function writeSnapshot(path: string, snapshot: unknown): Promise<void> {
  await atomicJson(path, snapshotSchema.parse(snapshot));
}

export async function readSnapshot(path: string): Promise<Snapshot> {
  try { return snapshotSchema.parse(JSON.parse(await readFile(path, 'utf8'))); }
  catch { throw new Error('Snapshot is unreadable, invalid or uses an unsupported schema version.'); }
}
