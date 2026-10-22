import { Command } from 'commander';
import { BulkgridClient, sourceInputSchemas } from '@bulkgrid/sdk';
import { z } from 'zod';

interface SourceCommandOptions {
  url?: string;
  input?: string;
}
type ClientFactory = (options: SourceCommandOptions) => BulkgridClient;
const uuid = z.uuid();

export function createSourceClient(options: SourceCommandOptions): BulkgridClient {
  const apiKey = process.env.BULKGRID_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Source commands require BULKGRID_API_KEY with explicit source/collection scopes. CLI OAuth login remains search-only.',
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

export function registerSourceCommands(program: Command, clientFactory: ClientFactory = createSourceClient): void {
  const sources = program.command('sources').description('Inspect and manage sources with a scoped API key; outputs JSON');
  const command = (name: string, description: string) =>
    sources
      .command(name)
      .description(description)
      .option('--url <url>', 'Bulkgrid origin; defaults to BULKGRID_URL or https://bulkgrid.com');
  const print = (result: unknown) => console.log(JSON.stringify(result, null, 2));
  command('find <query>', 'Find existing sources before adding one').action(
    async (query: string, options: SourceCommandOptions) => print(await clientFactory(options).index.sources.search(query)),
  );
  command('analyze <sourceUrl>', 'Start deeper analysis; may create a crawl run and consume resources').action(
    async (url: string, options: SourceCommandOptions) => print(await clientFactory(options).index.sources.analyze({ url })),
  );
  command('analysis-status <analysisId>', 'Read analysis progress and warnings').action(
    async (analysisId: string, options: SourceCommandOptions) =>
      print(await clientFactory(options).index.sources.getAnalysis(uuid.parse(analysisId))),
  );
  command('add', 'Create or subscribe to a source; may initiate ongoing ingestion')
    .requiredOption('--input <json>', 'Source configuration JSON including explicit visibility, boundaries and refresh interval')
    .action(async (options: SourceCommandOptions) => {
      const input = sourceInputSchemas.create
        .safeExtend({ visibility: z.enum(['public', 'private']) })
        .parse(JSON.parse(options.input ?? '{}'));
      print(await clientFactory(options).index.sources.create(input));
    });
  command('github-connections', 'List workspace GitHub connections and permitted repositories').action(
    async (options: SourceCommandOptions) => print(await clientFactory(options).index.sources.githubConnections()),
  );
  command('subscribe <sourceId>', 'Subscribe to an existing public source without starting ingestion').action(
    async (sourceId: string, options: SourceCommandOptions) =>
      print(await clientFactory(options).index.sources.subscribe(uuid.parse(sourceId))),
  );
  command('add-github', 'Create a GitHub source; private repositories require a workspace connection')
    .requiredOption(
      '--input <json>',
      'Repository URL, explicit visibility, connection_id for private repositories and indexing settings',
    )
    .action(async (options: SourceCommandOptions) => {
      const input = sourceInputSchemas.createGithub
        .extend({ repositoryUrl: z.url(), visibility: z.enum(['public', 'private']) })
        .parse(JSON.parse(options.input ?? '{}'));
      sourceInputSchemas.createGithub.parse(input);
      print(await clientFactory(options).index.sources.createGithub(input));
    });
  command('analyze-github', 'Analyze documentation paths in a permitted GitHub repository')
    .requiredOption('--input <json>', 'Repository URL and optional connection_id and ref')
    .action(async (options: SourceCommandOptions) => {
      const input = sourceInputSchemas.analyzeGithub.extend({ repositoryUrl: z.url() }).parse(JSON.parse(options.input ?? '{}'));
      sourceInputSchemas.analyzeGithub.parse(input);
      print(await clientFactory(options).index.sources.analyzeGithub(input));
    });
  command('status <sourceId>', 'Read crawl status, errors, size and indexed item counts').action(
    async (sourceId: string, options: SourceCommandOptions) =>
      print(await clientFactory(options).index.sources.status(uuid.parse(sourceId))),
  );
  command('recrawl <sourceId>', 'Start a manual refresh using saved configuration; may consume credits').action(
    async (sourceId: string, options: SourceCommandOptions) =>
      print(await clientFactory(options).index.sources.recrawl(uuid.parse(sourceId))),
  );
  command('collections', 'List collections available for source management').action(async (options: SourceCommandOptions) =>
    print(await clientFactory(options).index.collections.list()),
  );
  command('rules <collectionId>', 'Inspect collection rules before changing membership').action(
    async (collectionId: string, options: SourceCommandOptions) =>
      print(await clientFactory(options).index.collections.rules(uuid.parse(collectionId))),
  );
  command(
    'include <sourceId> <collectionId>',
    'Include the entire source in a collection, broadening its retrieval coverage',
  ).action(async (sourceId: string, collectionId: string, options: SourceCommandOptions) =>
    print(
      await clientFactory(options).index.collections.addSource({
        sourceId: uuid.parse(sourceId),
        collectionId: uuid.parse(collectionId),
      }),
    ),
  );
}
