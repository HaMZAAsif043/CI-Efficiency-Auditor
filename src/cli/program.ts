import { Command, CommanderError } from 'commander';

export function createProgram(version: string, onResult: (code: number) => void = () => undefined): Command {
  const program = new Command();
  program
    .name('ci-audit')
    .description('GitHub Actions efficiency auditor. Read-only collection; reports and analysis are planned.')
    .version(version)
    .showHelpAfterError('(Run ci-audit --help for available commands.)')
    .exitOverride();

  program.command('collect')
    .description('Collect read-only GitHub Actions metadata into a local snapshot.')
    .requiredOption('--repo <owner/repo>', 'GitHub repository')
    .requiredOption('--out <path>', 'Snapshot output path (atomic replacement)')
    .option('--days <number>', 'Lookback days, 1-90 (ignored when --from is explicit)', '30')
    .option('--from <ISO-date>', 'Inclusive start; use with --to for repeatable cache windows')
    .option('--to <ISO-date>', 'Exclusive end (default: collection start time)')
    .option('--max-runs <number>', 'Run cap, 1-1000', '500')
    .option('--max-requests <number>', 'Request cap including retries, 1-10000', '2000')
    .option('--cache-dir <path>', 'Completed-attempt cache directory', '.cache/ci-audit')
    .option('--no-cache', 'Disable cache reads and writes')
    .option('--anonymous', 'Ignore GITHUB_TOKEN and use public anonymous access')
    .action(async (options: unknown) => {
      const { runCollection } = await import('./collect-command.js');
      onResult(await runCollection(options, version));
    });

  for (const name of ['report', 'compare']) {
    program
      .command(name)
      .description('Planned; unavailable in this foundation release.')
      .action(() => {
        program.error(`error: '${name}' is not implemented yet. No report was written.`, {
          code: 'ci-audit.unavailable',
          exitCode: 2,
        });
      });
  }
  return program;
}

export async function runCli(args: string[], version: string): Promise<number> {
  let resultCode = 0;
  const program = createProgram(version, (code) => { resultCode = code; });
  try {
    if (args.length === 0) program.help();
    await program.parseAsync(args, { from: 'user' });
    return resultCode;
  } catch (error: unknown) {
    if (error instanceof CommanderError) {
      // Help/version use CommanderError as control flow; argument errors use exit 2.
      return error.exitCode === 0 ? 0 : 2;
    }
    // Avoid dumping arbitrary exception messages, which may contain private input.
    process.stderr.write('error: Unexpected CLI failure. No audit was completed.\n');
    return 1;
  }
}
