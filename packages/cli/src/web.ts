import { readFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { Command, InvalidArgumentError, Option } from 'commander';
import { BulkgridClient, type GetRunResponse } from '@bulkgrid/sdk';
import { z } from 'zod';
import { createApiClient, writeOutput, type ApiOptions } from './api.js';

type ClientFactory = (options: ApiOptions) => BulkgridClient;
const uuid = z.uuid();
const pageUrl = z.url().refine(value => {
  const url = new URL(value);
  return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password;
}, 'Use an HTTP(S) page URL without credentials');
const format = z.enum(['markdown', 'cleanHtml', 'rawHtml', 'links']);
const crawlOptions = z.strictObject({
  formats: z.array(format).min(1).optional(),
  includeTags: z.array(z.string()).optional(),
  excludeTags: z.array(z.string()).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  waitAfterLoad: z.number().min(0).max(30_000).optional(),
  timeout: z.number().min(1000).max(60_000).optional(),
  blockAds: z.boolean().optional(),
  useInteractions: z.boolean().optional(),
  waitForSelector: z.string().optional(),
  waitForImages: z.boolean().optional(),
  removeConsentPopups: z.boolean().optional(),
  screenshot: z.enum(['screenshot', 'fullPageScreenshot']).optional(),
  useHttp: z.boolean().optional(),
  useLlmsTxt: z.boolean().optional(),
});

function integer(min: number, max = Number.MAX_SAFE_INTEGER) {
  return (value: string): number => {
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < min || Number(value) > max) {
      throw new InvalidArgumentError(`Expected an integer from ${min} to ${max}.`);
    }
    return Number(value);
  };
}

function jsonObject(value: string): Record<string, unknown> {
  try {
    return z.record(z.string(), z.unknown()).parse(JSON.parse(value));
  } catch {
    throw new Error('Expected a valid JSON object.');
  }
}

function command(parent: Command, name: string, description: string): Command {
  return parent
    .command(name)
    .description(description)
    .option('--url <origin>', 'Bulkgrid origin; defaults to BULKGRID_URL or https://bulkgrid.com')
    .option('-o, --output <file>', 'Write output to a file; default is stdout (or use -)');
}

interface CrawlOptions extends ApiOptions {
  formats?: string;
  screenshot?: 'screenshot' | 'fullPageScreenshot';
  options?: string;
}

function captureOptions(options: CrawlOptions) {
  return crawlOptions.parse({
    ...(options.options ? jsonObject(options.options) : {}),
    ...(options.formats ? { formats: options.formats.split(',').map(value => value.trim()) } : {}),
    ...(options.screenshot ? { screenshot: options.screenshot } : {}),
  });
}

function captureFlags(cmd: Command): Command {
  return cmd
    .option('--formats <formats>', 'Comma-separated markdown,cleanHtml,rawHtml,links')
    .addOption(new Option('--screenshot <mode>', 'Capture a screenshot').choices(['screenshot', 'fullPageScreenshot']))
    .option('--options <json>', 'Additional crawl options as a JSON object');
}

interface SearchOptions extends CrawlOptions {
  type: 'web' | 'images' | 'news';
  limit: number;
  country?: string;
  language?: string;
  location?: string;
  crawl?: boolean;
}

interface MapOptions extends ApiOptions {
  limit: number;
  search?: string;
  subdomains: boolean;
}

interface DeepOptions extends CrawlOptions {
  maxPages: number;
  maxDepth: number;
  includePaths?: string[];
  excludePaths?: string[];
  includeExternal?: boolean;
  includeDocumentLinks?: boolean;
  restrictToStartPath: boolean;
}

interface ExtractOptions extends ApiOptions {
  query: string;
  schema?: string;
  schemaFile?: string;
  maxRetries: number;
}

interface IndexOptions extends ApiOptions {
  limit: number;
  collectionId?: string;
  sourceIds?: string[];
  queryMode: 'none' | 'auto';
  queries?: string[];
}

interface PageOptions extends ApiOptions {
  page: number;
  limit: number;
}
interface WaitOptions extends ApiOptions {
  timeout: number;
  interval: number;
}

export async function waitForRun(
  client: BulkgridClient,
  runId: string,
  options: { timeout: number; interval: number },
  clock = { now: Date.now, sleep: (ms: number) => delay(ms) },
): Promise<{ run: GetRunResponse | null; runId: string; timedOut: boolean }> {
  const deadline = clock.now() + options.timeout;
  let run: GetRunResponse | undefined;
  while (true) {
    const remaining = deadline - clock.now();
    if (remaining <= 0) return { run: run ?? null, runId, timedOut: true };
    const signal = AbortSignal.timeout(Math.max(1, remaining));
    try {
      run = await client.runs.get(runId, {}, { signal });
    } catch (error) {
      if (
        signal.aborted &&
        (error === signal.reason || (error instanceof Error && ['AbortError', 'TimeoutError'].includes(error.name)))
      ) {
        return { run: run ?? null, runId, timedOut: true };
      }
      throw error;
    }
    if (['completed', 'failed', 'cancelled'].includes(run.status)) return { run, runId, timedOut: false };
    const pause = Math.min(options.interval, deadline - clock.now());
    if (pause > 0) await clock.sleep(pause);
  }
}

export function registerWebCommands(program: Command, clientFactory: ClientFactory = createApiClient): void {
  captureFlags(command(program, 'search <query>', 'Search the live web, images or news; outputs JSON'))
    .addOption(new Option('--type <type>', 'Search result type').choices(['web', 'images', 'news']).default('web'))
    .option('--limit <count>', 'Maximum results (1–10)', integer(1, 10), 10)
    .option('--country <code>', 'Two-letter country code')
    .option('--language <code>', 'Language code')
    .option('--location <place>', 'Search location')
    .option('--crawl', 'Collect source pages in the same run; may consume credits')
    .action(async (query: string, options: SearchOptions) => {
      const capture = captureOptions(options);
      if (Object.keys(capture).length && !options.crawl) throw new Error('Crawl options require --crawl.');
      if (capture.headers) throw new Error('Custom headers are not supported for search-result crawling.');
      const input = {
        query: z.string().trim().min(1).max(500).parse(query),
        type: options.type,
        limit: options.limit,
        country:
          options.country === undefined
            ? undefined
            : z
                .string()
                .regex(/^[a-z]{2}$/)
                .parse(options.country),
        language:
          options.language === undefined
            ? undefined
            : z
                .string()
                .regex(/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/)
                .parse(options.language),
        location:
          options.location === undefined ? undefined : z.string().trim().min(1).max(200).parse(options.location),
        crawl: options.crawl ?? false,
        ...(Object.keys(capture).length ? { crawlOptions: capture } : {}),
      };
      await writeOutput(await clientFactory(options).search(input), options);
    });

  command(program, 'map <pageUrl>', 'Discover sitemap URLs without collecting page content; outputs a run')
    .option('--limit <count>', 'Maximum discovered URLs (1–100000)', integer(1, 100_000), 100)
    .option('--search <keywords>', 'Filter sitemap URLs by keywords; not a strict path boundary')
    .option('--no-subdomains', 'Exclude subdomains from discovery')
    .action(async (url: string, options: MapOptions) => {
      const input = {
        url: pageUrl.parse(url),
        config: {
          limit: options.limit,
          includeSubdomains: options.subdomains,
          ...(options.search ? { search: z.string().trim().min(1).max(500).parse(options.search) } : {}),
        },
      };
      await writeOutput(await clientFactory(options).map(input), options);
    });

  captureFlags(
    command(program, 'crawl <urls...>', 'Collect exact page URLs; outputs a run and may consume credits'),
  ).action(async (urls: string[], options: CrawlOptions) => {
    const input = { urls: z.array(pageUrl).min(1).parse(urls), options: captureOptions(options) };
    await writeOutput(await clientFactory(options).crawl(input), options);
  });

  captureFlags(
    command(program, 'deep-crawl <pageUrl>', 'Follow links within explicit page and depth limits; outputs a run'),
  )
    .requiredOption('--max-pages <count>', 'Maximum pages to collect', integer(1))
    .requiredOption('--max-depth <count>', 'Maximum link depth', integer(1))
    .option('--include-paths <paths...>', 'Allowed path prefixes')
    .option('--exclude-paths <paths...>', 'Excluded path prefixes')
    .option('--include-external', 'Allow external links')
    .option('--include-document-links', 'Include document links')
    .option('--no-restrict-to-start-path', 'Allow paths outside the starting path')
    .action(async (url: string, options: DeepOptions) => {
      const input = {
        url: pageUrl.parse(url),
        config: {
          maxPages: options.maxPages,
          maxDepth: options.maxDepth,
          includePaths: options.includePaths,
          excludePaths: options.excludePaths,
          includeExternal: options.includeExternal ?? false,
          includeDocumentLinks: options.includeDocumentLinks ?? false,
          restrictToStartPath: options.restrictToStartPath,
        },
        options: captureOptions(options),
      };
      await writeOutput(await clientFactory(options).deepCrawl(input), options);
    });

  command(program, 'extract <urls...>', 'Extract structured fields using a query and JSON Schema; outputs a run')
    .requiredOption('--query <query>', 'Fields and context to extract')
    .option('--schema <json>', 'JSON Schema object; use this or --schema-file')
    .option('--schema-file <file>', 'Read JSON Schema from a file')
    .option('--max-retries <count>', 'Service retry attempts per URL (1–5)', integer(1, 5), 3)
    .action(async (urls: string[], options: ExtractOptions) => {
      if (Boolean(options.schema) === Boolean(options.schemaFile))
        throw new Error('Provide exactly one of --schema or --schema-file.');
      const schema = jsonObject(options.schema ?? (await readFile(options.schemaFile!, 'utf8')));
      const input = {
        urls: z.array(pageUrl).min(1).parse(urls),
        query: z.string().trim().min(1).parse(options.query),
        schema,
        maxRetries: options.maxRetries,
      };
      await writeOutput(await clientFactory(options).extract(input), options);
    });

  const index = program.command('index').description('Search content already indexed in Bulkgrid');
  command(index, 'search <query>', 'Retrieve indexed passages with source URLs; outputs JSON')
    .option('--limit <count>', 'Maximum passages (1–50)', integer(1, 50), 10)
    .option('--collection-id <id>', 'Restrict retrieval to this collection')
    .option('--source-ids <ids...>', 'Restrict retrieval to these sources')
    .addOption(new Option('--query-mode <mode>', 'Query expansion mode').choices(['none', 'auto']).default('none'))
    .option('--queries <queries...>', 'Up to three complementary search formulations')
    .action(async (query: string, options: IndexOptions) => {
      const input = {
        query: z.string().trim().min(1).parse(query),
        limit: options.limit,
        collectionId: options.collectionId ? uuid.parse(options.collectionId) : undefined,
        sourceIds: options.sourceIds ? z.array(uuid).min(1).parse(options.sourceIds) : undefined,
        queries: options.queries ? z.array(z.string().trim().min(1)).max(3).parse(options.queries) : undefined,
        queryMode: options.queryMode,
      };
      await writeOutput(await clientFactory(options).index.search(input), options);
    });

  const runs = program.command('runs').description('Inspect runs and retrieve saved outputs');
  command(runs, 'list', 'List runs; outputs JSON')
    .option('--page <number>', 'Page number', integer(1), 1)
    .option('--limit <count>', 'Page size (1–100)', integer(1, 100), 20)
    .action(async (options: PageOptions) =>
      writeOutput(await clientFactory(options).runs.list({ page: options.page, limit: options.limit }), options),
    );
  command(runs, 'status <runId>', 'Read run status, saved search results, or completed map links')
    .alias('get')
    .action(async (id: string, options: ApiOptions) => {
      uuid.parse(id);
      await writeOutput(await clientFactory(options).runs.get(id), options);
    });
  command(runs, 'wait <runId>', 'Wait for completion with a deadline; outputs {run, runId, timedOut}')
    .option('--timeout <seconds>', 'Maximum wait in seconds (1–3600)', integer(1, 3600), 60)
    .option('--interval <seconds>', 'Polling interval in seconds (1–60)', integer(1, 60), 5)
    .action(async (id: string, options: WaitOptions) => {
      uuid.parse(id);
      const result = await waitForRun(clientFactory(options), id, {
        timeout: options.timeout * 1000,
        interval: options.interval * 1000,
      });
      await writeOutput(result, options);
      if (result.timedOut) process.exitCode = 2;
      else if (result.run?.status !== 'completed') process.exitCode = 1;
    });
  command(runs, 'results <runId>', 'List paginated page results and extraction_data')
    .option('--page <number>', 'Page number', integer(1), 1)
    .option('--limit <count>', 'Page size (1–100)', integer(1, 100), 20)
    .action(async (id: string, options: PageOptions) => {
      uuid.parse(id);
      await writeOutput(
        await clientFactory(options).runs.results(id, { page: options.page, limit: options.limit }),
        options,
      );
    });
  command(runs, 'content <runId> <resultId>', 'Read captured content as raw text; use --output to save it')
    .addOption(new Option('--type <format>', 'Captured content format').choices(format.options).default('markdown'))
    .action(async (id: string, resultId: string, options: ApiOptions & { type: z.infer<typeof format> }) => {
      uuid.parse(id);
      uuid.parse(resultId);
      await writeOutput(
        await clientFactory(options).runs.getResultContent(id, resultId, { type: options.type }),
        options,
        true,
      );
    });
  command(runs, 'screenshot <runId> <resultId>', 'Get a temporary URL for a captured screenshot; outputs JSON').action(
    async (id: string, resultId: string, options: ApiOptions) => {
      uuid.parse(id);
      uuid.parse(resultId);
      await writeOutput(await clientFactory(options).runs.getResultScreenshot(id, resultId), options);
    },
  );
  command(runs, 'cancel <runId>', 'Cancel a run; requires runs:cancel').action(
    async (id: string, options: ApiOptions) => {
      uuid.parse(id);
      await writeOutput(await clientFactory(options).runs.cancel(id), options);
    },
  );
  command(runs, 'retry <runId>', 'Retry requested work; requires runs:retry and may consume credits')
    .option('--urls <urls...>', 'Retry only these page URLs')
    .action(async (id: string, options: ApiOptions & { urls?: string[] }) => {
      uuid.parse(id);
      const input = options.urls ? { urls: z.array(pageUrl).min(1).parse(options.urls) } : {};
      await writeOutput(await clientFactory(options).runs.retry(id, input), options);
    });
}
