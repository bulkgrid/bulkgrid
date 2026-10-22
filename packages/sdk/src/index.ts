import { apiContract as internalApiContract } from '@bulkgrid/contracts';
import { z } from 'zod';
import { createResourceClients } from './resources.js';
export type * from './resources.js';
export { sourceInputSchemas } from './resources.js';
export type { Source, SourceDocument, SourceSearchResult, SourceStatus, Collection, CollectionRule } from '@bulkgrid/contracts';

export const apiErrorResponseSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export const apiContract = {
  index: {
    sources: {
      subscribe: {
        method: internalApiContract.index.sources.subscribe.method,
        path: internalApiContract.index.sources.subscribe.path,
      },
      githubConnections: {
        method: internalApiContract.index.sources.githubConnections.method,
        path: internalApiContract.index.sources.githubConnections.path,
      },
      analyzeGithub: {
        method: internalApiContract.index.sources.analyzeGithub.method,
        path: internalApiContract.index.sources.analyzeGithub.path,
      },
      analyze: { method: internalApiContract.index.sources.analyze.method, path: internalApiContract.index.sources.analyze.path },
      getAnalysis: {
        method: internalApiContract.index.sources.analysis.method,
        path: internalApiContract.index.sources.analysis.path,
      },
      list: { method: internalApiContract.index.sources.list.method, path: internalApiContract.index.sources.list.path },
      search: { method: internalApiContract.index.sources.search.method, path: internalApiContract.index.sources.search.path },
      create: { method: internalApiContract.index.sources.create.method, path: internalApiContract.index.sources.create.path },
      get: { method: internalApiContract.index.sources.get.method, path: internalApiContract.index.sources.get.path },
      update: { method: internalApiContract.index.sources.update.method, path: internalApiContract.index.sources.update.path },
      delete: { method: internalApiContract.index.sources.delete.method, path: internalApiContract.index.sources.delete.path },
      status: { method: internalApiContract.index.sources.status.method, path: internalApiContract.index.sources.status.path },
      createGithub: {
        method: internalApiContract.index.sources.createGithub.method,
        path: internalApiContract.index.sources.createGithub.path,
      },
      recrawl: { method: internalApiContract.index.sources.recrawl.method, path: internalApiContract.index.sources.recrawl.path },
      documents: {
        method: internalApiContract.index.sources.documents.method,
        path: internalApiContract.index.sources.documents.path,
      },
      changes: { method: internalApiContract.index.sources.changes.method, path: internalApiContract.index.sources.changes.path },
    },
    collections: {
      list: { method: internalApiContract.index.collections.list.method, path: internalApiContract.index.collections.list.path },
      create: {
        method: internalApiContract.index.collections.create.method,
        path: internalApiContract.index.collections.create.path,
      },
      get: { method: internalApiContract.index.collections.get.method, path: internalApiContract.index.collections.get.path },
      update: {
        method: internalApiContract.index.collections.update.method,
        path: internalApiContract.index.collections.update.path,
      },
      delete: {
        method: internalApiContract.index.collections.delete.method,
        path: internalApiContract.index.collections.delete.path,
      },
      rules: {
        method: internalApiContract.index.collections.rules.method,
        path: internalApiContract.index.collections.rules.path,
      },
      updateRules: {
        method: internalApiContract.index.collections.updateRules.method,
        path: internalApiContract.index.collections.updateRules.path,
      },
    },
    search: {
      method: internalApiContract.index.search.method,
      path: internalApiContract.index.search.path,
    },
  },
  extract: {
    method: internalApiContract.extract.method,
    path: internalApiContract.extract.path,
  },
  search: { method: internalApiContract.search.method, path: internalApiContract.search.path },
  crawl: {
    method: internalApiContract.crawl.method,
    path: internalApiContract.crawl.path,
  },
  map: { method: internalApiContract.map.method, path: internalApiContract.map.path },
  deepCrawl: {
    method: internalApiContract.deepCrawl.method,
    path: internalApiContract.deepCrawl.path,
  },
  runs: {
    list: {
      method: internalApiContract.runs.list.method,
      path: internalApiContract.runs.list.path,
    },
    create: {
      method: internalApiContract.runs.create.method,
      path: internalApiContract.runs.create.path,
    },
    get: {
      method: internalApiContract.runs.get.method,
      path: internalApiContract.runs.get.path,
    },
    cancel: {
      method: internalApiContract.runs.cancel.method,
      path: internalApiContract.runs.cancel.path,
    },
    retry: {
      method: internalApiContract.runs.retry.method,
      path: internalApiContract.runs.retry.path,
    },
    delete: {
      method: internalApiContract.runs.delete.method,
      path: internalApiContract.runs.delete.path,
    },
    results: {
      method: internalApiContract.runs.results.method,
      path: internalApiContract.runs.results.path,
    },
    resultContent: {
      method: internalApiContract.runs.resultContent.method,
      path: internalApiContract.runs.resultContent.path,
    },
    resultScreenshot: {
      method: internalApiContract.runs.resultScreenshot.method,
      path: internalApiContract.runs.resultScreenshot.path,
    },
  },
} as const;

export type CrawlRunStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type CrawlRunType = import('@bulkgrid/contracts').CrawlRunType;
export type ResultContentType = 'markdown' | 'cleanHtml' | 'rawHtml' | 'links';

export type CrawlRun = import('@bulkgrid/contracts').CrawlRun;

export type CrawlResult = import('@bulkgrid/contracts').CrawlResult;

export type CrawlRunStatistics = import('@bulkgrid/contracts').CrawlRunStatistics;

export type IndexSearchResult = import('@bulkgrid/contracts').IndexSearchResult;
export type SearchResult = import('@bulkgrid/contracts').SearchResult;
export type WebSearchResult = import('@bulkgrid/contracts').WebSearchResult;
export type ImageSearchResult = import('@bulkgrid/contracts').ImageSearchResult;
export type NewsSearchResult = import('@bulkgrid/contracts').NewsSearchResult;

export type IndexSearchResponse = import('@bulkgrid/contracts').IndexSearchResponse;
export type SearchResponse = import('@bulkgrid/contracts').SearchResponse;
export type WebSearchResponse = import('@bulkgrid/contracts').WebSearchResponse;
export type ImageSearchResponse = import('@bulkgrid/contracts').ImageSearchResponse;
export type NewsSearchResponse = import('@bulkgrid/contracts').NewsSearchResponse;
export type BulkgridSearchInput = import('@bulkgrid/contracts/schemas').WebSearchInput;

export type SdkSuccessResponse = import('@bulkgrid/contracts').SdkSuccessResponse;

export type ScreenshotResponse = import('@bulkgrid/contracts').ScreenshotResponse;

export interface ListRunsQuery {
  page?: number;
  limit?: number;
  orderBy?: string;
  status?: CrawlRunStatus;
  type?: CrawlRunType | 'crawl';
  [key: string]: string | number | boolean | undefined;
}

export type ListRunsResponse = import('@bulkgrid/contracts').ListRunsResponse;

export interface GetRunQuery {
  includeResults?: boolean;
  [key: string]: string | number | boolean | undefined;
}

export type GetRunResponse = import('@bulkgrid/contracts').GetRunResponse;

export interface ListRunResultsQuery {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export type ListRunResultsResponse = import('@bulkgrid/contracts').ListRunResultsResponse;

export interface CrawlRunOptions {
  formats?: ResultContentType[];
  includeTags?: string[];
  excludeTags?: string[];
  headers?: Record<string, string>;
  waitAfterLoad?: number;
  timeout?: number;
  blockAds?: boolean;
  useInteractions?: boolean;
  waitForSelector?: string;
  waitForImages?: boolean;
  removeConsentPopups?: boolean;
  screenshot?: 'screenshot' | 'fullPageScreenshot';
  useHttp?: boolean;
  useLlmsTxt?: boolean;
}

export interface BulkgridCrawlInput {
  urls: string[];
  strategy?: 'lexical' | 'embedding';
  config?: {
    maxDepth?: number;
    maxPages?: number;
    topKLinks?: number;
    minGainThreshold?: number;
    confidenceThreshold?: number;
  };
  options?: CrawlRunOptions;
}

export interface BulkgridExtractInput {
  urls: string[];
  query: string;
  schema: Record<string, unknown>;
  maxRetries?: number;
}

export interface BulkgridDeepCrawlInput {
  url: string;
  config?: {
    maxDepth?: number;
    includeExternal?: boolean;
    includeDocumentLinks?: boolean;
    scoreThreshold?: number;
    normalizeScores?: boolean;
    maxPages?: number;
    includePaths?: string[];
    excludePaths?: string[];
    restrictToStartPath?: boolean;
  };
  options?: CrawlRunOptions;
}

export interface BulkgridRetryRunInput {
  urls?: string[];
}

export interface BulkgridIndexSearchInput {
  query: string;
  queries?: string[];
  queryMode?: 'none' | 'auto';
  limit?: number;
  collectionId?: string;
  sourceIds?: string[];
  fullTextWeight?: number;
  semanticWeight?: number;
  rrfK?: number;
}

export interface BulkgridMapInput {
  url: string;
  config?: import('@bulkgrid/contracts/schemas').MapOptions;
}

export type BulkgridRunCreateInput =
  | ({ type: 'crawl' } & BulkgridCrawlInput)
  | ({ type: 'extract' } & BulkgridExtractInput)
  | ({ type: 'deep_crawl' } & BulkgridDeepCrawlInput)
  | ({ type: 'map' } & BulkgridMapInput);

export interface BulkgridClientOptions {
  apiKey: string;
  baseUrl: string;
  fetch?: typeof fetch;
  headers?: HeadersInit;
  userAgent?: string;
  validateResponses?: boolean;
}

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export interface ResultContentRequest extends RequestOptions {
  type?: ResultContentType;
  download?: boolean;
}

export class BulkgridApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: Response,
    public readonly data?: ApiErrorResponse | string,
  ) {
    super(message);
    this.name = 'BulkgridApiError';
  }
}

export class BulkgridClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fetchImplementation: typeof fetch;
  private readonly defaultHeaders: HeadersInit | undefined;
  private readonly userAgent: string | undefined;
  private readonly validateResponses: boolean;

  readonly index: ReturnType<typeof createResourceClients> & {
    search: (input: BulkgridIndexSearchInput, options?: RequestOptions) => Promise<IndexSearchResponse>;
  };

  readonly runs: {
    list: (query?: ListRunsQuery, options?: RequestOptions) => Promise<ListRunsResponse>;
    create: (input: BulkgridRunCreateInput, options?: RequestOptions) => Promise<CrawlRun>;
    get: (runId: string, query?: GetRunQuery, options?: RequestOptions) => Promise<GetRunResponse>;
    cancel: (runId: string, options?: RequestOptions) => Promise<SdkSuccessResponse>;
    retry: (runId: string, input?: BulkgridRetryRunInput, options?: RequestOptions) => Promise<CrawlRun>;
    delete: (runId: string, options?: RequestOptions) => Promise<SdkSuccessResponse>;
    results: (runId: string, query?: ListRunResultsQuery, options?: RequestOptions) => Promise<ListRunResultsResponse>;
    getResultContent: (runId: string, resultId: string, request?: ResultContentRequest) => Promise<string>;
    getResultScreenshot: (runId: string, resultId: string, options?: RequestOptions) => Promise<ScreenshotResponse>;
    downloadResultScreenshot: (runId: string, resultId: string, options?: RequestOptions) => Promise<Blob>;
  };

  constructor(options: BulkgridClientOptions) {
    const normalizedBaseUrl = options.baseUrl.replace(/\/+$/, '');

    this.apiKey = options.apiKey;
    this.baseUrl = normalizedBaseUrl;
    this.fetchImplementation = options.fetch ?? fetch;
    this.defaultHeaders = options.headers;
    this.userAgent = options.userAgent;
    this.validateResponses = options.validateResponses ?? true;
    const resources = createResourceClients((method, path, requestOptions) => this.requestJson(method, path, requestOptions));
    this.index = {
      ...resources,
      search: (input, requestOptions) =>
        this.requestJson('POST', internalApiContract.index.search.path, {
          body: input,
          responseSchema: internalApiContract.index.search.responseSchema,
          ...requestOptions,
        }),
    };
    this.runs = {
      list: (query, requestOptions) =>
        this.requestJson('GET', internalApiContract.runs.list.path, {
          query,
          responseSchema: internalApiContract.runs.list.responseSchema,
          ...requestOptions,
        }),
      create: (input, requestOptions) =>
        this.requestJson('POST', internalApiContract.runs.create.path, {
          body: input,
          responseSchema: internalApiContract.runs.create.responseSchema,
          ...requestOptions,
        }),
      get: (runId, query, requestOptions) =>
        this.requestJson('GET', this.interpolatePath(internalApiContract.runs.get.path, { runId }), {
          query,
          responseSchema: internalApiContract.runs.get.responseSchema,
          ...requestOptions,
        }),
      cancel: (runId, requestOptions) =>
        this.requestJson('POST', this.interpolatePath(internalApiContract.runs.cancel.path, { runId }), {
          responseSchema: internalApiContract.runs.cancel.responseSchema,
          ...requestOptions,
        }),
      retry: (runId, input, requestOptions) =>
        this.requestJson('POST', this.interpolatePath(internalApiContract.runs.retry.path, { runId }), {
          body: input ?? {},
          responseSchema: internalApiContract.runs.retry.responseSchema,
          ...requestOptions,
        }),
      delete: (runId, requestOptions) =>
        this.requestJson('DELETE', this.interpolatePath(internalApiContract.runs.delete.path, { runId }), {
          responseSchema: internalApiContract.runs.delete.responseSchema,
          ...requestOptions,
        }),
      results: (runId, query, requestOptions) =>
        this.requestJson('GET', this.interpolatePath(internalApiContract.runs.results.path, { runId }), {
          query,
          responseSchema: internalApiContract.runs.results.responseSchema,
          ...requestOptions,
        }),
      getResultContent: (runId, resultId, request) =>
        this.requestText('GET', this.interpolatePath(internalApiContract.runs.resultContent.path, { runId, resultId }), request),
      getResultScreenshot: (runId, resultId, requestOptions) =>
        this.requestJson('GET', this.interpolatePath(internalApiContract.runs.resultScreenshot.path, { runId, resultId }), {
          responseSchema: internalApiContract.runs.resultScreenshot.responseSchema,
          ...requestOptions,
        }),
      downloadResultScreenshot: (runId, resultId, requestOptions) =>
        this.requestBlob('GET', this.interpolatePath(internalApiContract.runs.resultScreenshot.path, { runId, resultId }), {
          query: { download: true },
          ...requestOptions,
        }),
    };
  }

  async extract(input: BulkgridExtractInput, options?: RequestOptions): Promise<CrawlRun> {
    return this.requestJson('POST', internalApiContract.extract.path, {
      body: { ...input, type: 'extract' },
      responseSchema: internalApiContract.extract.responseSchema,
      ...options,
    });
  }

  async crawl(input: BulkgridCrawlInput, options?: RequestOptions): Promise<CrawlRun> {
    return this.requestJson('POST', internalApiContract.crawl.path, {
      body: { ...input, type: 'crawl' },
      responseSchema: internalApiContract.crawl.responseSchema,
      ...options,
    });
  }

  async search(input: BulkgridSearchInput, options?: RequestOptions): Promise<SearchResponse> {
    return this.requestJson('POST', internalApiContract.search.path, {
      body: input,
      responseSchema: internalApiContract.search.responseSchema,
      ...options,
    });
  }

  async map(input: BulkgridMapInput, options?: RequestOptions): Promise<CrawlRun> {
    return this.requestJson('POST', internalApiContract.map.path, {
      body: { ...input, type: 'map' },
      responseSchema: internalApiContract.map.responseSchema,
      ...options,
    });
  }

  async deepCrawl(input: BulkgridDeepCrawlInput, options?: RequestOptions): Promise<CrawlRun> {
    return this.requestJson('POST', internalApiContract.deepCrawl.path, {
      body: { ...input, type: 'deep_crawl' },
      responseSchema: internalApiContract.deepCrawl.responseSchema,
      ...options,
    });
  }

  private async requestJson<TSchema extends z.ZodTypeAny>(
    method: string,
    path: string,
    options: RequestOptions & {
      body?: unknown;
      query?: Record<string, string | number | boolean | undefined>;
      responseSchema: TSchema;
    },
  ): Promise<z.infer<TSchema>> {
    const response = await this.fetchResponse(method, path, options);
    if (!response.ok) {
      throw this.createApiError(response, await this.readErrorBody(response));
    }

    const json = (await response.json()) as unknown;

    if (!this.validateResponses) {
      return json as z.infer<TSchema>;
    }

    return options.responseSchema.parse(json);
  }

  private async requestText(method: string, path: string, options?: ResultContentRequest): Promise<string> {
    const response = await this.fetchResponse(method, path, {
      query: {
        type: options?.type,
        download: options?.download,
      },
      signal: options?.signal,
      headers: options?.headers,
    });

    if (!response.ok) {
      const errorBody = await this.readErrorBody(response);
      throw this.createApiError(response, errorBody);
    }

    return response.text();
  }

  private async requestBlob(
    method: string,
    path: string,
    options?: RequestOptions & {
      query?: Record<string, string | number | boolean | undefined>;
    },
  ): Promise<Blob> {
    const response = await this.fetchResponse(method, path, options);

    if (!response.ok) {
      const errorBody = await this.readErrorBody(response);
      throw this.createApiError(response, errorBody);
    }

    return response.blob();
  }

  private async fetchResponse(
    method: string,
    path: string,
    options?: RequestOptions & {
      body?: unknown;
      query?: Record<string, string | number | boolean | undefined>;
    },
  ): Promise<Response> {
    const url = new URL(`${this.baseUrl}${path}`);

    Object.entries(options?.query ?? {}).forEach(([key, value]) => {
      if (value === undefined) {
        return;
      }

      url.searchParams.set(key, String(value));
    });

    const headers = new Headers(this.defaultHeaders);
    headers.set('x-api-key', this.apiKey);
    headers.set('accept', 'application/json');

    if (this.userAgent) {
      headers.set('x-bulkgrid-user-agent', this.userAgent);
    }

    if (options?.headers) {
      new Headers(options.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    const requestInit: RequestInit = {
      method,
      headers,
      signal: options?.signal,
    };

    if (options?.body !== undefined) {
      headers.set('content-type', 'application/json');
      requestInit.body = JSON.stringify(options.body);
    }

    return this.fetchImplementation(url, requestInit);
  }

  private async readErrorBody(response: Response): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return response.json();
    }

    return response.text();
  }

  private createApiError(response: Response, body: unknown): BulkgridApiError {
    const parsedError = apiErrorResponseSchema.safeParse(body);
    if (parsedError.success) {
      return new BulkgridApiError(parsedError.data.error, response.status, response, parsedError.data);
    }

    if (typeof body === 'string' && body.length > 0) {
      return new BulkgridApiError(body, response.status, response, body);
    }

    return new BulkgridApiError(`Request failed with status ${response.status}`, response.status, response);
  }

  private interpolatePath(path: string, params: Record<string, string>): string {
    return Object.entries(params).reduce((currentPath, [key, value]) => {
      return currentPath.replace(`{${key}}`, encodeURIComponent(value));
    }, path);
  }
}
