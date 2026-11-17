import { writeFile } from 'node:fs/promises';
import { BulkgridApiError, BulkgridClient } from '@bulkgrid/sdk';

export interface ApiOptions {
  url?: string;
  output?: string;
}

class OutputWriteError extends Error {
  constructor(
    message: string,
    readonly runId?: string,
  ) {
    super(message);
  }
}

export function createApiClient(options: ApiOptions): BulkgridClient {
  const apiKey = process.env.BULKGRID_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Set BULKGRID_API_KEY with the scopes needed for this command. CLI OAuth login does not supply an API key.',
    );
  }
  const baseUrl = new URL(options.url ?? process.env.BULKGRID_URL ?? 'https://bulkgrid.com');
  if (baseUrl.username || baseUrl.password || baseUrl.search || baseUrl.hash || baseUrl.pathname !== '/') {
    throw new Error('Use a Bulkgrid origin URL without credentials, a path, query, or fragment.');
  }
  if (
    baseUrl.protocol !== 'https:' &&
    !(baseUrl.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(baseUrl.hostname))
  ) {
    throw new Error('Remote Bulkgrid deployments require HTTPS.');
  }
  return new BulkgridClient({ apiKey, baseUrl: baseUrl.origin });
}

export async function writeOutput(value: unknown, options: ApiOptions, raw = false): Promise<void> {
  const content = raw ? String(value) : `${JSON.stringify(value, null, 2)}\n`;
  if (options.output && options.output !== '-') {
    try {
      await writeFile(options.output, content, 'utf8');
    } catch {
      const response = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
      const run =
        response.run && typeof response.run === 'object' ? (response.run as Record<string, unknown>) : response;
      const runId = typeof run.id === 'string' ? run.id : undefined;
      throw new OutputWriteError(
        `Could not write output to ${options.output}. The API operation already returned; do not repeat a submission.`,
        runId,
      );
    }
  } else {
    process.stdout.write(content);
  }
}

export function commandError(error: unknown): Record<string, unknown> {
  return {
    error: error instanceof Error ? error.message : 'Command failed',
    ...(error instanceof BulkgridApiError ? { status: error.status, details: error.data } : {}),
    ...(error instanceof OutputWriteError && error.runId ? { runId: error.runId } : {}),
  };
}
