import { z } from 'zod';
import { timestamp, type Run, type Attempt, type Job } from '../snapshot/schema.js';

const id = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
const attempt = z.number().int().min(1).max(1000);
export const rawRunSchema = z.object({
  id, workflow_id: id, name: z.string().nullable(), head_sha: z.string(), head_branch: z.string().nullable(),
  event: z.string(), status: z.string(), conclusion: z.string().nullable(), created_at: timestamp,
  run_started_at: timestamp.nullable().optional(), updated_at: timestamp, run_attempt: attempt,
});
export const rawJobSchema = z.object({
  id, run_id: id, run_attempt: attempt.optional(), name: z.string(), labels: z.array(z.string()),
  status: z.string(), conclusion: z.string().nullable(), started_at: timestamp.nullable(), completed_at: timestamp.nullable(),
  steps: z.array(z.object({ number: z.number().int().nonnegative(), name: z.string(), status: z.string(),
    conclusion: z.string().nullable(), started_at: timestamp.nullable().optional(), completed_at: timestamp.nullable().optional() })).optional(),
});
export const runPageSchema = z.object({ total_count: z.number().int().nonnegative(), workflow_runs: z.array(rawRunSchema) });
export const jobPageSchema = z.object({ total_count: z.number().int().nonnegative(), jobs: z.array(rawJobSchema) });

export function normalizeRun(value: z.infer<typeof rawRunSchema>, repository: string): Run {
  return { id: value.id, workflowId: value.workflow_id, name: value.name, sha: value.head_sha,
    branch: value.head_branch, event: value.event, status: value.status, conclusion: value.conclusion,
    createdAt: value.created_at, startedAt: value.run_started_at ?? null, updatedAt: value.updated_at,
    attempt: value.run_attempt, url: `https://github.com/${repository}/actions/runs/${value.id}` };
}

export function normalizeAttempt(value: z.infer<typeof rawRunSchema>): Attempt {
  return { runId: value.id, number: value.run_attempt, status: value.status,
    conclusion: value.conclusion, startedAt: value.run_started_at ?? null, updatedAt: value.updated_at };
}

export function normalizeJob(value: z.infer<typeof rawJobSchema>, repository: string, requestedAttempt: number): Job {
  return { id: value.id, runId: value.run_id, attempt: value.run_attempt ?? requestedAttempt, name: value.name,
    labels: [...value.labels].sort(), status: value.status, conclusion: value.conclusion,
    startedAt: value.started_at, completedAt: value.completed_at,
    url: `https://github.com/${repository}/actions/runs/${value.run_id}/job/${value.id}`,
    steps: (value.steps ?? []).map((step) => ({ number: step.number, name: step.name,
      status: step.status, conclusion: step.conclusion, startedAt: step.started_at ?? null, completedAt: step.completed_at ?? null })) };
}
