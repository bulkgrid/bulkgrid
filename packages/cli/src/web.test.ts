import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Command } from 'commander';
import { BulkgridClient } from '@bulkgrid/sdk';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { commandError, createApiClient } from './api.js';
import { registerWebCommands, waitForRun } from './web.js';

const runId = '11111111-1111-4111-8111-111111111111';
const resultId = '22222222-2222-4222-8222-222222222222';
const temporary: string[] = [];

function harness(respond = () => Response.json({ id: runId, status: 'pending' })) {
  const fetcher = vi.fn(async () => respond());
  const client = new BulkgridClient({
    apiKey: 'test-key',
    baseUrl: 'https://bulkgrid.com',
    fetch: fetcher,
    validateResponses: false,
  });
  const factory = vi.fn(() => client);
  const program = new Command().exitOverride().configureOutput({ writeErr: () => {} });
  registerWebCommands(program, factory);
  const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
  return { client, factory, fetcher, stdout, run: (args: string[]) => program.parseAsync(args, { from: 'user' }) };
}

function request(fetcher: ReturnType<typeof harness>['fetcher'], index = 0) {
  const [url, init] = fetcher.mock.calls[index] as unknown as [string, RequestInit];
  return { url: String(url), init, body: init.body ? JSON.parse(String(init.body)) : undefined };
}

afterEach(async () => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  for (const path of temporary.splice(0)) await rm(path, { recursive: true, force: true });
});

describe('web and index CLI requests', () => {
  it('uses the live endpoint and preserves image search, locale, crawling and saved run data', async () => {
    const result = {
      type: 'images',
      results: [{ url: 'https://example.com', imageUrl: 'https://example.com/a.png' }],
      run: { id: runId },
    };
    const h = harness(() => Response.json(result));
    await h.run([
      'search',
      'solar panels',
      '--type',
      'images',
      '--limit',
      '5',
      '--country',
      'se',
      '--language',
      'sv',
      '--crawl',
      '--formats',
      'markdown',
    ]);
    expect(request(h.fetcher)).toMatchObject({
      url: 'https://bulkgrid.com/api/v1/search',
      body: {
        query: 'solar panels',
        type: 'images',
        limit: 5,
        country: 'se',
        language: 'sv',
        crawl: true,
        crawlOptions: { formats: ['markdown'] },
      },
    });
    expect(JSON.parse(String(h.stdout.mock.calls[0]?.[0]))).toEqual(result);
    expect(h.fetcher).toHaveBeenCalledTimes(1);
  });

  it('keeps indexed retrieval and both requested scope filters on the index endpoint', async () => {
    const h = harness();
    await h.run([
      'index',
      'search',
      'authentication',
      '--collection-id',
      runId,
      '--source-ids',
      resultId,
      '--limit',
      '7',
      '--queries',
      'login setup',
    ]);
    expect(request(h.fetcher)).toMatchObject({
      url: 'https://bulkgrid.com/api/v1/index/search',
      body: {
        query: 'authentication',
        collectionId: runId,
        sourceIds: [resultId],
        limit: 7,
        queryMode: 'none',
        queries: ['login setup'],
      },
    });
  });

  it('maps with explicit discovery limits and no subdomains without creating a crawl', async () => {
    const h = harness();
    await h.run(['map', 'https://example.com', '--limit', '10', '--no-subdomains', '--search', 'docs']);
    expect(request(h.fetcher)).toMatchObject({
      url: 'https://bulkgrid.com/api/v1/map',
      body: {
        type: 'map',
        url: 'https://example.com',
        config: { limit: 10, includeSubdomains: false, search: 'docs' },
      },
    });
    expect(h.fetcher).toHaveBeenCalledTimes(1);
  });

  it('crawls only given URLs and forwards capture settings', async () => {
    const h = harness();
    await h.run([
      'crawl',
      'https://example.com/a',
      'https://example.com/b',
      '--formats',
      'markdown,links',
      '--screenshot',
      'fullPageScreenshot',
      '--options',
      '{"waitForSelector":"main"}',
    ]);
    expect(request(h.fetcher).body).toEqual({
      type: 'crawl',
      urls: ['https://example.com/a', 'https://example.com/b'],
      options: { formats: ['markdown', 'links'], screenshot: 'fullPageScreenshot', waitForSelector: 'main' },
    });
  });

  it('keeps deep crawls bounded with conservative traversal defaults', async () => {
    const h = harness();
    await h.run([
      'deep-crawl',
      'https://example.com/docs',
      '--max-pages',
      '10',
      '--max-depth',
      '2',
      '--include-paths',
      '/docs',
    ]);
    expect(request(h.fetcher).body).toEqual({
      type: 'deep_crawl',
      url: 'https://example.com/docs',
      config: {
        maxPages: 10,
        maxDepth: 2,
        includePaths: ['/docs'],
        includeExternal: false,
        includeDocumentLinks: false,
        restrictToStartPath: true,
      },
      options: {},
    });
  });

  it('loads the exact extraction schema from a file and submits only once', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'bulkgrid-schema-'));
    temporary.push(directory);
    const schema = { type: 'object', properties: { price: { type: ['number', 'null'] } }, required: ['price'] };
    await writeFile(join(directory, 'schema.json'), JSON.stringify(schema));
    const h = harness();
    await h.run([
      'extract',
      'https://example.com/product',
      '--query',
      'Listed price only',
      '--schema-file',
      join(directory, 'schema.json'),
      '--max-retries',
      '1',
    ]);
    expect(request(h.fetcher).body).toEqual({
      type: 'extract',
      urls: ['https://example.com/product'],
      query: 'Listed price only',
      schema,
      maxRetries: 1,
    });
    expect(h.fetcher).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['search', 'topic', '--limit', '11'],
    ['search', 'topic', '--limit', '1x'],
    ['search', 'topic', '--formats', 'markdown'],
    ['search', 'topic', '--crawl', '--options', '{"headers":{"Authorization":"secret"}}'],
    ['crawl', 'file:///etc/passwd'],
    ['crawl', 'https://user:secret@example.com'],
    ['crawl', 'https://example.com', '--options', '{"unknown":true}'],
    ['deep-crawl', 'https://example.com', '--max-pages', '10'],
    ['extract', 'https://example.com', '--query', 'price'],
    ['extract', 'https://example.com', '--query', 'price', '--schema', '[]'],
    ['extract', 'https://example.com', '--query', 'price', '--schema', '{}', '--schema-file', 'unused.json'],
    ['index', 'search', 'topic', '--collection-id', 'not-an-id'],
    ['runs', 'results', 'not-an-id'],
  ])('rejects invalid input before any client or API call: %j', async (...args) => {
    const h = harness();
    await expect(h.run(args)).rejects.toThrow();
    expect(h.factory).not.toHaveBeenCalled();
    expect(h.fetcher).not.toHaveBeenCalled();
  });

  it('keeps partial extraction results and pagination metadata intact', async () => {
    const result = {
      results: [
        { url: 'https://example.com/a', extraction_data: { data: { price: 9 } } },
        { url: 'https://example.com/b', error_message: 'Forbidden' },
      ],
      page: 2,
      limit: 20,
      total: 25,
    };
    const h = harness(() => Response.json(result));
    await h.run(['runs', 'results', runId, '--page', '2']);
    expect(request(h.fetcher).url).toBe(`https://bulkgrid.com/api/v1/runs/${runId}/results?page=2&limit=20`);
    expect(JSON.parse(String(h.stdout.mock.calls[0]?.[0]))).toEqual(result);
  });

  it('writes raw content to a file without JSON quoting or stdout noise', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'bulkgrid-content-'));
    temporary.push(directory);
    const output = join(directory, 'page.md');
    const h = harness(() => new Response('# Exact content\n'));
    await h.run(['runs', 'content', runId, resultId, '--type', 'markdown', '--output', output]);
    expect(await readFile(output, 'utf8')).toBe('# Exact content\n');
    expect(h.stdout).not.toHaveBeenCalled();
  });

  it('forwards a targeted retry without retrying unrelated URLs', async () => {
    const h = harness();
    await h.run(['runs', 'retry', runId, '--urls', 'https://example.com/failed']);
    expect(request(h.fetcher).body).toEqual({ urls: ['https://example.com/failed'] });
    expect(h.fetcher).toHaveBeenCalledTimes(1);
  });

  it('retains a submission run ID when saving its response fails', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'bulkgrid-output-error-'));
    temporary.push(directory);
    const h = harness();
    const error = await h.run(['crawl', 'https://example.com', '--output', directory]).catch(error => error);
    expect(commandError(error)).toMatchObject({ runId, error: expect.stringContaining('do not repeat a submission') });
    expect(h.fetcher).toHaveBeenCalledTimes(1);
  });

  it('preserves service error details and never repeats a failed mutation', async () => {
    const h = harness(() =>
      Response.json({ error: 'Quota exhausted', details: { run: { id: runId } } }, { status: 429 }),
    );
    const error = await h.run(['crawl', 'https://example.com']).catch(error => error);
    expect(commandError(error)).toMatchObject({
      status: 429,
      details: { error: 'Quota exhausted', details: { run: { id: runId } } },
    });
    expect(h.fetcher).toHaveBeenCalledTimes(1);
    expect(h.stdout).not.toHaveBeenCalled();
  });
});

describe('bounded run waiting', () => {
  it('preserves the known run ID when the first status request times out', async () => {
    const reason = new DOMException('Deadline expired', 'TimeoutError');
    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(AbortSignal.abort(reason));
    const h = harness();
    h.fetcher.mockRejectedValue(reason);
    expect(await waitForRun(h.client, runId, { timeout: 1000, interval: 100 })).toEqual({
      run: null,
      runId,
      timedOut: true,
    });
    expect(h.fetcher).toHaveBeenCalledTimes(1);
  });

  it('does not turn a permission failure into a timeout response', async () => {
    const h = harness(() => Response.json({ error: 'Permission denied' }, { status: 403 }));
    await expect(waitForRun(h.client, runId, { timeout: 1000, interval: 100 })).rejects.toMatchObject({ status: 403 });
    expect(h.fetcher).toHaveBeenCalledTimes(1);
  });

  it('uses exit 2 for an initial wait timeout and emits a resumable JSON response', async () => {
    const previous = process.exitCode;
    try {
      const reason = new DOMException('Deadline expired', 'TimeoutError');
      vi.spyOn(AbortSignal, 'timeout').mockReturnValue(AbortSignal.abort(reason));
      const h = harness();
      h.fetcher.mockRejectedValue(reason);
      await h.run(['runs', 'wait', runId]);
      expect(process.exitCode).toBe(2);
      expect(JSON.parse(String(h.stdout.mock.calls[0]?.[0]))).toEqual({ run: null, runId, timedOut: true });
    } finally {
      process.exitCode = previous;
    }
  });

  it.each(['completed', 'failed', 'cancelled'])('stops when a run is %s', async status => {
    let time = 0;
    const h = harness(() => Response.json({ id: runId, status: time ? status : 'processing' }));
    const result = await waitForRun(
      h.client,
      runId,
      { timeout: 1000, interval: 100 },
      {
        now: () => time,
        sleep: async ms => {
          time += ms;
        },
      },
    );
    expect(result).toEqual({ run: { id: runId, status }, runId, timedOut: false });
    expect(h.fetcher).toHaveBeenCalledTimes(2);
  });

  it('returns the last run state at the deadline without creating work', async () => {
    let time = 0;
    const h = harness(() => Response.json({ id: runId, status: 'processing' }));
    const result = await waitForRun(
      h.client,
      runId,
      { timeout: 250, interval: 100 },
      {
        now: () => time,
        sleep: async ms => {
          time += ms;
        },
      },
    );
    expect(result).toEqual({ run: { id: runId, status: 'processing' }, runId, timedOut: true });
    expect(time).toBe(250);
    expect(h.fetcher).toHaveBeenCalledTimes(3);
    expect(h.fetcher.mock.calls.every((_, index) => request(h.fetcher, index).init.method === 'GET')).toBe(true);
  });
});

describe('API-key command authentication', () => {
  it('requires an API key without reusing OAuth tokens', () => {
    vi.stubEnv('BULKGRID_API_KEY', '');
    expect(() => createApiClient({})).toThrow('BULKGRID_API_KEY');
  });
  it.each([
    'http://example.com',
    'https://user:secret@example.com',
    'https://example.com/api',
    'https://example.com/?secret=value',
  ])('rejects unsafe origins: %s', url => {
    vi.stubEnv('BULKGRID_API_KEY', 'test-key');
    expect(() => createApiClient({ url })).toThrow();
  });
});
