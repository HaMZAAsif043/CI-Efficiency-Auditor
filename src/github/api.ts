import { Octokit } from 'octokit';

export const API_VERSION = '2026-03-10' as const;
export interface ApiResponse { data: unknown; headers: Record<string, string | number | undefined> }
export interface ReadOnlyApi { get(path: string, params: Record<string, string | number>, signal?: AbortSignal): Promise<ApiResponse> }

export function createGitHubApi(token?: string, fetch: typeof globalThis.fetch = globalThis.fetch): ReadOnlyApi {
  const octokit = new Octokit({
    ...(token ? { auth: token } : {}),
    retry: { enabled: false }, throttle: { enabled: false },
    request: { timeout: 15_000, fetch },
    log: { debug() {}, info() {}, warn() {}, error() {} },
  });
  return {
    async get(path, params, signal) {
      // No caller-controlled base URL or method. Redirects cannot carry a token elsewhere.
      if (!/^\/repos\/[^/]+\/[^/]+\/actions\/runs(?:\/\d+(?:\/attempts\/\d+(?:\/jobs)?)?)?$/.test(path)) {
        throw new Error('Unsupported read-only route');
      }
      const result = await octokit.request(`GET ${path}`, {
        ...params,
        headers: { accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': API_VERSION },
        request: { ...(signal ? { signal } : {}), redirect: 'error' },
      });
      return { data: result.data, headers: result.headers };
    },
  };
}
