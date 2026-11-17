import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Run via npm run verify:package so npm's own entry point is available on every OS.
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run this check with npm run verify:package.');
const root = fileURLToPath(new URL('../', import.meta.url));
const scratchRoot = join(root, '.tmp');
mkdirSync(scratchRoot, { recursive: true });
const scratch = mkdtempSync(join(scratchRoot, 'package-check-'));
const checks = [];

function npm(args, cwd = root) {
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd, encoding: 'utf8', timeout: 120_000,
    env: { ...process.env, NO_COLOR: '1' },
  });
  checks.push({ command: ['npm', ...args], cwd, status: result.status,
    stdout: result.stdout, stderr: result.stderr });
  if (result.error) throw result.error;
  return result;
}

try {
  const packed = npm(['pack', '--json', '--pack-destination', scratch]);
  assert.equal(packed.status, 0, packed.stderr);
  const packInfo = JSON.parse(packed.stdout);
  const files = packInfo[0].files.map(({ path }) => path).sort();
  const expected = ['LICENSE', 'NOTICE', 'README.md',
    'dist/cli/collect-command.js', 'dist/cli/main.js', 'dist/cli/program.js',
    'dist/github/api.js', 'dist/github/collect.js', 'dist/github/normalize.js',
    'dist/snapshot/cache.js', 'dist/snapshot/io.js', 'dist/snapshot/schema.js',
    'docs/CLI.md', 'package.json'];
  assert.deepEqual(files, expected, 'Package contents changed; inspect and update the explicit allowlist.');
  const archive = join(scratch, packInfo[0].filename);
  const sha256 = createHash('sha256').update(readFileSync(archive)).digest('hex');
  writeFileSync(join(scratch, 'package-contents.json'), JSON.stringify({ files, sha256, packInfo }, null, 2) + '\n');

  const installation = join(scratch, 'clean-install');
  mkdirSync(installation);
  writeFileSync(join(installation, 'package.json'), JSON.stringify({ name: 'ci-audit-package-rehearsal', private: true }));
  const install = npm(['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund',
    '--package-lock=false', '--cache', resolve(root, '.cache/npm'), archive], installation);
  assert.equal(install.status, 0, install.stderr);
  const shim = join(installation, 'node_modules', '.bin', process.platform === 'win32' ? 'ci-audit.cmd' : 'ci-audit');
  assert.ok(existsSync(shim), 'npm did not create an executable shim.');

  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  for (const [args, status, match] of [
    [['--help'], 0, 'Read-only collection'],
    [['--version'], 0, manifest.version],
    [['collect'], 2, 'required option'],
    [['--bogus'], 2, 'unknown option'],
  ]) {
    const result = npm(['exec', '--offline', '--', 'ci-audit', ...args], installation);
    assert.equal(result.status, status, result.stderr);
    assert.ok((result.stdout + result.stderr).includes(match), `Missing diagnostic: ${match}`);
  }
  writeFileSync(join(scratch, 'checks.json'), JSON.stringify(checks, null, 2) + '\n');
  console.log(`PASS: exact package allowlist (${files.length} files), offline clean installation and executable shim.`);
  console.log(`SHA256: ${sha256}`);
  console.log(`Evidence scratch directory: ${scratch}`);
} catch (error) {
  writeFileSync(join(scratch, 'checks.json'), JSON.stringify(checks, null, 2) + '\n');
  console.error(`Package rehearsal failed; inspect ${scratch}`);
  throw error;
}
