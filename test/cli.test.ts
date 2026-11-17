import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { afterAll, describe, expect, test } from 'vitest';

const cli = resolve('dist/cli/main.js');
const scratchRoot = resolve('.tmp');
mkdirSync(scratchRoot, { recursive: true });
const scratch = mkdtempSync(join(scratchRoot, 'cli-test-'));
afterAll(() => {
  if (!resolve(scratch).startsWith(scratchRoot + sep)) throw new Error('Unexpected cleanup target');
  rmSync(scratch, { recursive: true, force: true });
});

function invoke(args: string[]) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8', cwd: scratch, timeout: 10_000,
  });
  if (result.error) throw result.error;
  return result;
}

describe('actual CLI process contract', () => {
  test.each([[], ['--help'], ['help']])('help invocation %j is accurate and exits zero', (...args: string[]) => {
    const result = invoke(args);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Usage: ci-audit');
    expect(result.stdout).toContain('help and version only');
    expect(result.stdout).toContain('unavailable');
    expect(result.stderr).toBe('');
  });

  test('version comes from package metadata', () => {
    const result = invoke(['--version']);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe('0.1.0');
    expect(result.stderr).toBe('');
  });

  test.each([
    { args: ['collec'], diagnostic: 'unknown command' },
    { args: ['--bogus'], diagnostic: 'unknown option' },
    { args: ['collect', '--repo', 'owner/repo'], diagnostic: 'unknown option' },
    { args: ['collect', 'extra'], diagnostic: 'too many arguments' },
  ])('invalid arguments $args fail with actionable errors', ({ args, diagnostic }) => {
    const result = invoke(args);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain(diagnostic);
    expect(result.stderr).toContain('--help');
  });

  test.each(['collect', 'report', 'compare'])('%s cannot fabricate successful work', (command) => {
    const result = invoke([command]);
    expect(result.status).toBe(2);
    expect(result.stderr).toContain('not implemented yet');
    expect(result.stdout).toBe('');
    expect(readdirSync(scratch)).toEqual([]);
  });

  test.each(['collect', 'report', 'compare'])('%s help is available without running work', (command) => {
    const result = invoke([command, '--help']);
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('unavailable');
    expect(result.stderr).toBe('');
  });
});
