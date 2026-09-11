import { z } from 'zod';
import { apiContract } from '@bulkgrid/contracts';
import type { RequestOptions } from './index.js';

export const sourceInputSchemas = {
  analyze: apiContract.sources.analyze.requestSchema,
  create: apiContract.sources.create.requestSchema,
};

export type AnalyzeSourceInput = z.input<typeof apiContract.sources.analyze.requestSchema>;
export type SourceAnalysisResponse = z.output<typeof apiContract.sources.analysis.responseSchema>;
export type SourceDocumentsQuery = z.input<typeof apiContract.sources.documents.querySchema>;
export type SourceChangesQuery = z.input<typeof apiContract.sources.changes.querySchema>;
export type SourceDocumentsResponse = z.output<typeof apiContract.sources.documents.responseSchema>;
export type SourceChangesResponse = z.output<typeof apiContract.sources.changes.responseSchema>;
export type CreateSourceInput = z.input<typeof apiContract.sources.create.requestSchema>;
export type UpdateSourceInput = z.input<typeof apiContract.sources.update.requestSchema>;
export type CreateGithubSourceInput = z.input<typeof apiContract.sources.createGithub.requestSchema>;
export type ListSourcesQuery = z.input<typeof apiContract.sources.list.querySchema>;
export type CreateCollectionInput = z.input<typeof apiContract.collections.create.requestSchema>;
export type UpdateCollectionInput = z.input<typeof apiContract.collections.update.requestSchema>;
export interface CollectionSourceInput {
  collectionId: string;
  sourceId: string;
}
export type UpdateCollectionRulesInput = z.input<typeof apiContract.collections.updateRules.requestSchema>;
export type ListSourcesResponse = z.output<typeof apiContract.sources.list.responseSchema>;
export type SearchSourcesResponse = z.output<typeof apiContract.sources.search.responseSchema>;
export type CreateSourceResponse = z.output<typeof apiContract.sources.create.responseSchema>;
export type GetSourceResponse = z.output<typeof apiContract.sources.get.responseSchema>;
export type UpdateSourceResponse = z.output<typeof apiContract.sources.update.responseSchema>;
export type CreateGithubSourceResponse = z.output<typeof apiContract.sources.createGithub.responseSchema>;
export type RecrawlSourceResponse = z.output<typeof apiContract.sources.recrawl.responseSchema>;
export type ListCollectionsResponse = z.output<typeof apiContract.collections.list.responseSchema>;
export type CollectionResponse = z.output<typeof apiContract.collections.get.responseSchema>;
export type CollectionRulesResponse = z.output<typeof apiContract.collections.rules.responseSchema>;

export type ResourceRequest = <Schema extends z.ZodType>(
  method: string,
  path: string,
  options: RequestOptions & {
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
    responseSchema: Schema;
  },
) => Promise<z.output<Schema>>;

type Endpoint = { method: string; path: string; responseSchema: z.ZodType };

export function createResourceClients(request: ResourceRequest) {
  function call<Schema extends z.ZodType>(
    endpoint: Endpoint & { responseSchema: Schema },
    params: RequestOptions & {
      pathParams?: Record<string, string>;
      body?: unknown;
      query?: Record<string, string | number | boolean | undefined>;
    } = {},
  ): Promise<z.output<Schema>> {
    const { pathParams = {}, ...options } = params;
    const path = endpoint.path.replace(/\{([^}]+)\}/g, (_, key: string) => {
      const value = pathParams[key];
      if (!value) {
        throw new Error(`Missing path parameter: ${key}`);
      }
      return encodeURIComponent(value);
    });
    return request(endpoint.method, path, { ...options, responseSchema: endpoint.responseSchema });
  }
  const sources = apiContract.sources;
  const collections = apiContract.collections;
  return {
    sources: {
      analyze: (input: AnalyzeSourceInput, options?: RequestOptions) =>
        call(sources.analyze, { ...options, body: sources.analyze.requestSchema.parse(input) }),
      getAnalysis: (analysisId: string, options?: RequestOptions) =>
        call(sources.analysis, { ...options, pathParams: { analysisId } }),
      documents: (sourceId: string, query?: SourceDocumentsQuery, options?: RequestOptions) =>
        call(sources.documents, { ...options, pathParams: { sourceId }, query }),
      changes: (sourceId: string, query: SourceChangesQuery, options?: RequestOptions) =>
        call(sources.changes, { ...options, pathParams: { sourceId }, query }),
      list: (query?: ListSourcesQuery, options?: RequestOptions) => call(sources.list, { ...options, query }),
      search: (query: string, options?: RequestOptions) => call(sources.search, { ...options, query: { query } }),
      create: (input: CreateSourceInput, options?: RequestOptions) => call(sources.create, { ...options, body: input }),
      get: (sourceId: string, options?: RequestOptions) => call(sources.get, { ...options, pathParams: { sourceId } }),
      update: (sourceId: string, input: UpdateSourceInput, options?: RequestOptions) =>
        call(sources.update, { ...options, pathParams: { sourceId }, body: input }),
      delete: (sourceId: string, options?: RequestOptions) => call(sources.delete, { ...options, pathParams: { sourceId } }),
      status: (sourceId: string, options?: RequestOptions) => call(sources.status, { ...options, pathParams: { sourceId } }),
      createGithub: (input: CreateGithubSourceInput, options?: RequestOptions) =>
        call(sources.createGithub, { ...options, body: input }),
      recrawl: (sourceId: string, options?: RequestOptions) => call(sources.recrawl, { ...options, pathParams: { sourceId } }),
    },
    collections: {
      list: (options?: RequestOptions) => call(collections.list, options),
      create: (input: CreateCollectionInput, options?: RequestOptions) => call(collections.create, { ...options, body: input }),
      get: (collectionId: string, options?: RequestOptions) =>
        call(collections.get, { ...options, pathParams: { collectionId } }),
      update: (collectionId: string, input: UpdateCollectionInput, options?: RequestOptions) =>
        call(collections.update, { ...options, pathParams: { collectionId }, body: input }),
      delete: (collectionId: string, options?: RequestOptions) =>
        call(collections.delete, { ...options, pathParams: { collectionId } }),
      addSource: ({ collectionId, sourceId }: CollectionSourceInput, options?: RequestOptions) =>
        call(collections.updateRules, {
          ...options,
          pathParams: { collectionId },
          body: {
            add: [{ action: 'include', target: 'source', source_id: sourceId, target_id: sourceId }],
          },
        }),
      removeSource: async ({ collectionId, sourceId }: CollectionSourceInput, options?: RequestOptions) => {
        const current = await call(collections.rules, { ...options, pathParams: { collectionId } });
        return call(collections.updateRules, {
          ...options,
          pathParams: { collectionId },
          body: {
            remove: current.rules
              .filter(rule => rule.source_id === sourceId)
              .map(rule => ({
                action: rule.action,
                target: rule.target,
                source_id: rule.source_id,
                target_id: rule.target_id,
              })),
          },
        });
      },
      rules: (collectionId: string, options?: RequestOptions) =>
        call(collections.rules, { ...options, pathParams: { collectionId } }),
      updateRules: (collectionId: string, input: UpdateCollectionRulesInput, options?: RequestOptions) =>
        call(collections.updateRules, { ...options, pathParams: { collectionId }, body: input }),
    },
  };
}
