import { describe, expect, it, vi } from 'vitest';
import { apiContract as contract } from '@bulkgrid/contracts';
import { BulkgridClient } from './index.js';

describe('documented SDK run requests', () => {
  it('sends the required discriminator for each specialized endpoint', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({}));
    const client = new BulkgridClient({
      apiKey: 'test-key',
      baseUrl: 'https://bulkgrid.com',
      fetch: fetcher,
      validateResponses: false,
    });
    const cases = [
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
