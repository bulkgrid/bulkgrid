import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { apiContract } from '@bulkgrid/contracts';
import { BulkgridApiError, BulkgridClient, type CreateGithubSourceInput, type GetRunResponse } from './index.js';

const sourceId = '11111111-1111-4111-8111-111111111111';
const collectionId = '22222222-2222-4222-8222-222222222222';
const workspaceId = '33333333-3333-4333-8333-333333333333';
const source = {
  id: sourceId,
  workspace_id: null,
  created_by_user_id: null,
  created_by_workspace_id: null,
  identifier: 'https://example.com',
  label: 'Example',
  type: 'domain',
  integration_type: 'web',
  visibility: 'public',
  is_active: true,
  source_mode: 'discover',
  crawl_config: {},
  crawl_interval: 'weekly',
  created_at: '2026-09-10T00:00:00Z',
  updated_at: '2026-09-10T00:00:00Z',
  metadata: {},
  custom_interval_minutes: null,
  icon_url: null,
  last_crawled_at: null,
  max_depth: null,
  max_items: null,
  next_crawl_at: null,
  public_source_id: null,
  total_items_found: null,
};
const collection = {
  id: collectionId,
  workspace_id: workspaceId,
  name: 'Research',
  description: null,
  created_by_user_id: null,
  metadata: {},
  created_at: source.created_at,
  updated_at: source.updated_at,
};
const include = { action: 'include', target: 'source', source_id: sourceId, target_id: sourceId };
const rulesResponse = { rules: [include], counts: null, countsBySource: { [sourceId]: 10 } };
const searchResponse = {
  query: 'authentication',
  queryMode: 'auto',
  executedQueries: ['authentication', 'login setup'],
  scoring: { fullTextWeight: 1, semanticWeight: 1, rrfK: 60 },
  results: [],
  count: 0,
};

function setup() {
  const fetcher = vi.fn<typeof fetch>();
  const client = new BulkgridClient({ apiKey: 'scoped-test-key', baseUrl: 'https://bulkgrid.com', fetch: fetcher });
  return { client, fetcher };
}
function requestAt(fetcher: ReturnType<typeof setup>['fetcher'], index: number) {
  const [url, init] = fetcher.mock.calls[index]!;
  return { url: String(url), method: init?.method, body: init?.body ? JSON.parse(String(init.body)) : undefined, init };
}

describe('source and collection SDK workflows', () => {
  it('finds and subscribes to a shared source, includes it through rules, and searches the collection', async () => {
    const { client, fetcher } = setup();
    fetcher
      .mockResolvedValueOnce(
        Response.json({
          sources: [
            {
              id: sourceId,
              identifier: source.identifier,
              label: source.label,
              type: 'domain',
              integration_type: 'web',
              visibility: 'public',
              icon_url: null,
              updated_at: source.updated_at,
              totalItems: 10,
              isSubscribed: false,
              isOwned: false,
              displayIdentifier: source.identifier,
              displayTotalItems: 10,
            },
          ],
        }),
      )
      .mockResolvedValueOnce(Response.json({ source, created: false }))
      .mockResolvedValueOnce(Response.json({ collection }))
      .mockResolvedValueOnce(Response.json(rulesResponse))
      .mockResolvedValueOnce(Response.json(searchResponse));

    const found = await client.sources.search('example & docs');
    expect(found.sources[0]?.isSubscribed).toBe(false);
    const subscribed = await client.sources.create({ type: 'domain', identifier: source.identifier });
    expect(subscribed).toEqual({ source, created: false });
    await client.collections.create({ name: 'Research' });
    await client.collections.addSource({ collectionId, sourceId });
    const results = await client.search({ query: 'authentication', queryMode: 'auto', collectionId });
    expect(results.executedQueries).toEqual(['authentication', 'login setup']);
    expect(results.queryMode).toBe('auto');
    expect(requestAt(fetcher, 0).url).toBe('https://bulkgrid.com/api/v1/sources/search?query=example+%26+docs');
    expect(requestAt(fetcher, 3)).toMatchObject({
      method: 'PATCH',
      url: `https://bulkgrid.com/api/v1/collections/${collectionId}/rules`,
      body: { add: [include] },
    });
    expect(apiContract.collections.updateRules.requestSchema.safeParse(requestAt(fetcher, 3).body).success).toBe(true);
    expect(requestAt(fetcher, 4).body.collectionId).toBe(collectionId);
  });

  it('removes only the selected source rules, preserving unrelated collection rules', async () => {
    const { client, fetcher } = setup();
    const folder = { action: 'exclude', target: 'folder', source_id: sourceId, target_id: '/archive' };
    const unrelated = { ...include, source_id: workspaceId, target_id: workspaceId };
    fetcher
      .mockResolvedValueOnce(Response.json({ ...rulesResponse, rules: [include, folder, unrelated] }))
      .mockResolvedValueOnce(Response.json({ ...rulesResponse, rules: [unrelated] }));
    await client.collections.removeSource({ collectionId, sourceId });
    expect(requestAt(fetcher, 1).body).toEqual({ remove: [include, folder] });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('does not issue a write if reading the rules is forbidden', async () => {
    const { client, fetcher } = setup();
    fetcher.mockResolvedValueOnce(Response.json({ error: 'Missing collections:read' }, { status: 403 }));
    await expect(client.collections.removeSource({ collectionId, sourceId })).rejects.toMatchObject({ status: 403 });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('preserves permission and plan errors without retrying or escalating credentials', async () => {
    const { client, fetcher } = setup();
    const failure = { error: 'Pro plan required', details: { code: 'LIMIT_COLLECTIONS' } };
    fetcher.mockResolvedValueOnce(Response.json(failure, { status: 403 }));
    await expect(client.collections.create({ name: 'Research' })).rejects.toMatchObject({
      name: 'BulkgridApiError',
      status: 403,
      data: failure,
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(new Headers(requestAt(fetcher, 0).init?.headers).get('x-api-key')).toBe('scoped-test-key');
  });

  it('sends the GitHub URL in wire format and accepts omitted server defaults', async () => {
    const { client, fetcher } = setup();
    fetcher.mockResolvedValueOnce(Response.json({ error: 'Plan required' }, { status: 403 }));
    const input: CreateGithubSourceInput = { repositoryUrl: 'https://github.com/example/docs' };
    await expect(client.sources.createGithub(input)).rejects.toBeInstanceOf(BulkgridApiError);
    expect(requestAt(fetcher, 0).body).toEqual(input);
    expect(apiContract.sources.createGithub.requestSchema.safeParse(requestAt(fetcher, 0).body).success).toBe(true);
  });

  it('forwards pagination, path encoding, headers, and cancellation', async () => {
    const { client, fetcher } = setup();
    const controller = new AbortController();
    fetcher.mockResolvedValueOnce(Response.json({ documents: [], parent: '/guide', nextOffset: null, total: 0, limit: 20 }));
    await client.sources.documents(
      'source/id',
      { parent: '/guide', offset: 40, limit: 20 },
      {
        signal: controller.signal,
        headers: { 'x-request-id': 'test' },
      },
    );
    const sent = requestAt(fetcher, 0);
    expect(sent.url).toBe('https://bulkgrid.com/api/v1/sources/source%2Fid/documents?parent=%2Fguide&offset=40&limit=20');
    expect(sent.init?.signal).toBe(controller.signal);
    expect(new Headers(sent.init?.headers).get('x-request-id')).toBe('test');
  });

  it('validates response envelopes and preserves text failures as API errors', async () => {
    const { client, fetcher } = setup();
    fetcher
      .mockResolvedValueOnce(Response.json({ sources: [{ id: sourceId }] }))
      .mockResolvedValueOnce(new Response('Upstream unavailable', { status: 502 }));
    await expect(client.sources.list()).rejects.toMatchObject({ name: 'ZodError' });
    await expect(client.sources.list()).rejects.toMatchObject({
      name: 'BulkgridApiError',
      status: 502,
      data: 'Upstream unavailable',
    });
  });

  it('exposes source details and indexing progress in run response types', () => {
    expectTypeOf<GetRunResponse['source']>().toEqualTypeOf<{
      id: string;
      icon_url: string | null;
      integration_type: 'web' | 'upload' | 'github';
    } | null>();
    expectTypeOf<GetRunResponse['indexing_queued']>().toEqualTypeOf<number | undefined>();
  });
});
