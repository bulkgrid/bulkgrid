import { describe, expect, it, vi } from 'vitest';
import { BulkgridApiError, BulkgridClient } from './index.js';
const id = '11111111-1111-4111-8111-111111111111';
const discovery = {
  url: 'https://example.com',
  urlCount: 12,
  paths: [{ path: '/docs', depth: 1, count: 12, parent: null, name: 'docs' }],
  levelSummaries: [],
  warning: { type: 'sitemap_incomplete', message: 'Partial coverage' },
};
describe('source analysis SDK', () => {
  it('preserves incomplete estimates and tracks asynchronous analysis without retrying mutations', async () => {
    const analysis = {
      ...discovery,
      id,
      runId: id,
      sourceId: null,
      status: 'crawling',
      urlCount: null,
      scopeUrls: [],
      error: null,
      analyzedAt: null,
    };
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json(analysis, { status: 202 }))
      .mockResolvedValueOnce(Response.json({ ...analysis, status: 'partial', urlCount: 12 }));
    const client = new BulkgridClient({ apiKey: 'test-key', baseUrl: 'https://bulkgrid.com', fetch: fetcher });
    expect(await client.sources.analyze({ url: discovery.url })).toEqual(analysis);
    expect((await client.sources.getAnalysis(id)).status).toBe('partial');
    expect(String(fetcher.mock.calls[1]![0])).toBe(`https://bulkgrid.com/api/v1/sources/discover/analyses/${id}`);
    expect(JSON.parse(String(fetcher.mock.calls[0]![1]?.body))).toEqual({ url: discovery.url });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('surfaces permission errors without retrying analysis', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ error: 'Missing runs:write' }, { status: 403 }));
    const client = new BulkgridClient({ apiKey: 'test-key', baseUrl: 'https://bulkgrid.com', fetch: fetcher });
    await expect(client.sources.analyze({ url: discovery.url })).rejects.toBeInstanceOf(BulkgridApiError);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
