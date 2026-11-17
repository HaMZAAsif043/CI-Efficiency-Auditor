// Synthetic, locally authored fixtures. No real users, tokens or GitHub records.
export const window = { from: '2026-11-15T00:00:00.000Z', to: '2026-11-16T00:00:00.000Z' };
export const options = { repository: 'acme/widget', window, version: '0.1.0' };
export function rawRun(id = 10, number = 1, overrides: Record<string, unknown> = {}) {
  return { id, workflow_id: 5, name: 'CI', head_sha: 'a'.repeat(40), head_branch: 'main', event: 'push',
    status: 'completed', conclusion: 'success', created_at: '2026-11-15T01:00:00Z',
    run_started_at: '2026-11-15T01:00:00Z', updated_at: '2026-11-15T01:02:00Z', run_attempt: number, ...overrides };
}
export function rawJob(id = 100, runId = 10, number = 1, overrides: Record<string, unknown> = {}) {
  return { id, run_id: runId, run_attempt: number, name: 'test', labels: ['ubuntu-latest'],
    status: 'completed', conclusion: 'success', started_at: '2026-11-15T01:00:00Z', completed_at: '2026-11-15T01:02:00Z',
    steps: [{ number: 1, name: 'Install dependencies', status: 'completed', conclusion: 'success',
      started_at: '2026-11-15T01:00:00Z', completed_at: '2026-11-15T01:01:00Z' }], ...overrides };
}
