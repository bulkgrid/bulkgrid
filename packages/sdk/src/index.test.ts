import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { apiContract as contract } from '@bulkgrid/contracts';
import { BulkgridClient, type ImageSearchResult, type NewsSearchResult, type WebSearchResult } from './index.js';

describe('documented SDK run requests', () => {
  it('exposes indexed resources only through the index namespace', () => {
    const client = new BulkgridClient({ apiKey: 'test-key', baseUrl: 'https://bulkgrid.com' });
    expect(client).not.toHaveProperty('sources');
    expect(client).not.toHaveProperty('collections');
    expect(client).not.toHaveProperty('webSearch');
    expect(client.index.search).toBeTypeOf('function');
    expect(client.index.sources.list).toBeTypeOf('function');
    expect(client.index.collections.list).toBeTypeOf('function');
  });

  it('searches the web with optional crawling and validates the response', async () => {
    const response = {
      query: 'crawlers',
      type: 'web',
      results: [{ title: 'Crawler', url: 'https://example.com/', snippet: 'A crawler', position: 1 }],
      count: 1,
      run: { id: '11111111-1111-4111-8111-111111111111', status: 'pending' },
    };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json(response));
    const client = new BulkgridClient({ apiKey: 'test-key', baseUrl: 'https://bulkgrid.com', fetch: fetcher });
    expect(await client.search({ query: 'crawlers', crawl: true })).toEqual(response);
    const [url, init] = fetcher.mock.calls[0]!;
    expect(String(url)).toBe('https://bulkgrid.com/api/v1/search');
    expect(JSON.parse(String(init?.body))).toEqual({ query: 'crawlers', crawl: true });
  });

  it('requires the Search run reference and rejects the removed crawlRun shape', async () => {
    const legacy = { query: 'example', type: 'web', results: [], count: 0, crawlRun: null };
    expect(contract.search.responseSchema.safeParse(legacy).success).toBe(false);
    expect(
      contract.search.responseSchema.safeParse({
        ...legacy,
        run: { id: '11111111-1111-4111-8111-111111111111', status: 'completed' },
      }).success,
    ).toBe(true);
  });

  it('returns typed image results and rejects results for the wrong mode', async () => {
    const response = {
      query: 'skyline',
      type: 'images',
      count: 1,
      run: { id: '11111111-1111-4111-8111-111111111111', status: 'completed' },
      results: [
        {
          title: 'Skyline',
          url: 'https://example.com/gallery',
          imageUrl: 'https://example.com/photo.jpg',
          imageWidth: 1920,
          imageHeight: 1080,
          thumbnailUrl: null,
          position: 1,
        },
      ],
    };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json(response));
    const client = new BulkgridClient({ apiKey: 'test-key', baseUrl: 'https://bulkgrid.com', fetch: fetcher });
    const result = await client.search({ query: 'skyline', type: 'images' });
    expect(result).toEqual(response);
    expect(JSON.parse(String(fetcher.mock.calls[0]![1]?.body))).toEqual({ query: 'skyline', type: 'images' });
    if (result.type === 'images') {
      expectTypeOf(result.results).toEqualTypeOf<ImageSearchResult[]>();
    } else if (result.type === 'web') {
      expectTypeOf(result.results).toEqualTypeOf<WebSearchResult[]>();
    }
    fetcher.mockResolvedValue(Response.json({ ...response, type: 'web' }));
    await expect(client.search({ query: 'skyline', type: 'images' })).rejects.toThrow();
  });

  it('returns typed news results with nullable article metadata', async () => {
    const response = {
      query: 'transit',
      type: 'news',
      count: 1,
      run: { id: '11111111-1111-4111-8111-111111111111', status: 'completed' },
      results: [
        {
          title: 'Transit update',
          url: 'https://example.com/news',
          snippet: 'New city routes.',
          source: 'City News',
          date: '2 hours ago',
          imageUrl: null,
          position: 1,
        },
      ],
    };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json(response));
    const client = new BulkgridClient({ apiKey: 'test-key', baseUrl: 'https://bulkgrid.com', fetch: fetcher });
    const result = await client.search({ query: 'transit', type: 'news', crawl: true });
    expect(result).toEqual(response);
    expect(JSON.parse(String(fetcher.mock.calls[0]![1]?.body))).toEqual({ query: 'transit', type: 'news', crawl: true });
    if (result.type === 'news') {
      expectTypeOf(result.results).toEqualTypeOf<NewsSearchResult[]>();
      expectTypeOf(result.results[0]!.date).toEqualTypeOf<string | null>();
    }
    fetcher.mockResolvedValue(Response.json({ ...response, type: 'images' }));
    await expect(client.search({ query: 'transit', type: 'news' })).rejects.toThrow();
  });

  it('accepts map runs through the existing runs API', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({}));
    const client = new BulkgridClient({
      apiKey: 'test-key',
      baseUrl: 'https://bulkgrid.com',
      fetch: fetcher,
      validateResponses: false,
    });
    await client.runs.create({ type: 'map', url: 'https://example.com', config: { limit: 25 } });
    const [url, init] = fetcher.mock.calls[0]!;
    expect(String(url)).toBe('https://bulkgrid.com/api/v1/runs');
    expect(contract.runs.create.requestSchema.parse(JSON.parse(String(init?.body)))).toMatchObject({
      type: 'map',
      config: { limit: 25 },
    });
  });

  it('sends the required discriminator for each specialized endpoint', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({}));
    const client = new BulkgridClient({
      apiKey: 'test-key',
      baseUrl: 'https://bulkgrid.com',
      fetch: fetcher,
      validateResponses: false,
    });
    const cases = [
      { endpoint: contract.map, call: () => client.map({ url: 'https://example.com', config: {} }) },
      { endpoint: contract.crawl, call: () => client.crawl({ urls: ['https://example.com'] }) },
      {
        endpoint: contract.extract,
        call: () => client.extract({ urls: ['https://example.com'], query: 'Company name', schema: { type: 'object' } }),
      },
      { endpoint: contract.deepCrawl, call: () => client.deepCrawl({ url: 'https://example.com' }) },
    ];
    for (const { endpoint, call } of cases) {
      fetcher.mockResolvedValueOnce(Response.json({}));
      await call();
      const [, init] = fetcher.mock.calls.at(-1)!;
      expect(endpoint.requestSchema.safeParse(JSON.parse(String(init?.body))).success).toBe(true);
    }
  });
});
