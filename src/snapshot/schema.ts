import { z } from 'zod';

export const timestamp = z.iso.datetime({ offset: true });
const id = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
const attemptNumber = z.number().int().min(1).max(1000);
export const repositorySchema = z.string().max(140)
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}\/[a-zA-Z0-9_.-]{1,100}$/)
  .refine((value) => !['.', '..'].includes(value.split('/')[1] ?? ''));
export const windowSchema = z.object({ from: timestamp, to: timestamp }).strict()
  .refine(({ from, to }) => Date.parse(from) < Date.parse(to));
export const runSchema = z.object({
  id, workflowId: id, name: z.string().nullable(), sha: z.string(), branch: z.string().nullable(),
  event: z.string(), status: z.string(), conclusion: z.string().nullable(),
  createdAt: timestamp, startedAt: timestamp.nullable(), updatedAt: timestamp,
  attempt: attemptNumber, url: z.url(),
}).strict();
export const attemptSchema = z.object({
  runId: id, number: attemptNumber, status: z.string(), conclusion: z.string().nullable(),
  startedAt: timestamp.nullable(), updatedAt: timestamp,
}).strict();
export const stepSchema = z.object({
  number: z.number().int().nonnegative(), name: z.string(), status: z.string(),
  conclusion: z.string().nullable(), startedAt: timestamp.nullable(), completedAt: timestamp.nullable(),
}).strict();
export const jobSchema = z.object({
  id, runId: id, attempt: attemptNumber, name: z.string(), labels: z.array(z.string()),
  status: z.string(), conclusion: z.string().nullable(), startedAt: timestamp.nullable(),
  completedAt: timestamp.nullable(), url: z.url(), steps: z.array(stepSchema),
}).strict();
export const diagnosticCodes = [
  'run_limit', 'request_limit', 'provider_search_cap', 'http_401', 'http_403', 'http_404',
  'rate_limit', 'retry_wait_exceeds_limit', 'transport_error', 'server_error', 'malformed_response',
  'cache_unavailable', 'cache_invalid', 'in_progress', 'missing_timestamps', 'collection_interrupted',
  'run_changed', 'job_identity_mismatch', 'inherited_job_ignored', 'missing_attempt', 'missing_steps', 'missing_job_attempt',
] as const;
export const diagnosticSchema = z.object({
  code: z.enum(diagnosticCodes), severity: z.enum(['warning', 'incomplete']),
  runId: id.optional(), attempt: attemptNumber.optional(),
}).strict();
export const snapshotSchema = z.object({
  schemaVersion: z.literal(1), collectorVersion: z.string(), collectedAt: timestamp,
  repository: repositorySchema, apiVersion: z.literal('2026-03-10'), window: windowSchema,
  coverage: z.object({
    complete: z.boolean(), reasons: z.array(z.enum(diagnosticCodes)), requestCount: z.number().int().nonnegative(),
    maxRequests: z.number().int().positive(), maxRuns: z.number().int().positive(), returnedRunCount: z.number().int().nonnegative(),
    cache: z.object({ hits: z.number().int().nonnegative(), misses: z.number().int().nonnegative(), oldestEntryAt: timestamp.nullable() }).strict(),
  }).strict(),
  runs: z.array(runSchema), attempts: z.array(attemptSchema), jobs: z.array(jobSchema),
  diagnostics: z.array(diagnosticSchema),
}).strict();

export type Snapshot = z.infer<typeof snapshotSchema>;
export type Run = z.infer<typeof runSchema>;
export type Attempt = z.infer<typeof attemptSchema>;
export type Job = z.infer<typeof jobSchema>;
export type Diagnostic = z.infer<typeof diagnosticSchema>;
export type DiagnosticCode = Diagnostic['code'];
