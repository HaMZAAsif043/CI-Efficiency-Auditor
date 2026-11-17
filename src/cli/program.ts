import { Command, CommanderError } from 'commander';

export function createProgram(version: string): Command {
  const program = new Command();
  program
    .name('ci-audit')
    .description('GitHub Actions efficiency auditor. Foundation release: help and version only.')
    .version(version)
    .showHelpAfterError('(Run ci-audit --help for available commands.)')
    .exitOverride();

  for (const name of ['collect', 'report', 'compare']) {
    program
      .command(name)
      .description('Planned; unavailable in this foundation release.')
      .action(() => {
        program.error(`error: '${name}' is not implemented yet. No data was collected or written.`, {
          code: 'ci-audit.unavailable',
          exitCode: 2,
        });
      });
  }
  return program;
}

export async function runCli(args: string[], version: string): Promise<number> {
  const program = createProgram(version);
  try {
    if (args.length === 0) program.help();
    await program.parseAsync(args, { from: 'user' });
    return 0;
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
