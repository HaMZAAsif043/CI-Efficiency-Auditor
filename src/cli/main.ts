#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { runCli } from './program.js';

try {
  // This relative location is identical for src/cli and the packaged dist/cli.
  const manifest: unknown = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  if (typeof manifest !== 'object' || manifest === null || !('version' in manifest)
    || typeof manifest.version !== 'string') {
    throw new Error('Invalid package metadata');
  }
  process.exitCode = await runCli(process.argv.slice(2), manifest.version);
} catch {
  process.stderr.write('error: Unable to load CLI metadata. Reinstall or rebuild the package.\n');
  process.exitCode = 1;
}
