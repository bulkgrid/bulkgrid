import { createHash } from 'node:crypto';
import { mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CliAuth, resolveOrigin } from './auth.js';
import { AuthStorage, type CliCredentials } from './authStorage.js';

const origin = 'https://bulkgrid.example';
const issuer = 'https://auth.example/auth/v1';
const metadata = {
  issuer,
  authorization_endpoint: `${issuer}/oauth/authorize`,
  token_endpoint: `${issuer}/oauth/token`,
  registration_endpoint: `${issuer}/oauth/register`,
  code_challenge_methods_supported: ['S256'],
};
const session = {
  userId: 'user-1',
  workspaceId: 'workspace-1',
  clientName: 'Bulkgrid CLI',
  scopes: ['mcp:use', 'search:query'],
  collectionScope: 'selected',
};
const tokens = { access_token: 'access-1', refresh_token: 'refresh-1', expires_in: 3600, token_type: 'bearer' };
const saved: CliCredentials = {
  origin,
  issuer,
  tokenEndpoint: metadata.token_endpoint,
  clientId: 'client-1',
  accessToken: 'old-access',
  refreshToken: 'old-refresh',
  expiresAt: 0,
};

let directory: string;
let storage: AuthStorage;
beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'bulkgrid-auth-test-'));
  storage = new AuthStorage(directory);
});
afterEach(async () => {
  vi.restoreAllMocks();
  await rm(directory, { recursive: true, force: true });
});

function createFetcher() {
  return vi.fn<typeof fetch>(async (input, init) => {
    const url = String(input);
    if (url.includes('/.well-known/oauth-protected-resource/')) {
      return Response.json({ resource: `${origin}/api/v1/mcp`, authorization_servers: [issuer] });
    }
    if (url.includes('/.well-known/oauth-authorization-server/')) {
      return Response.json(metadata);
    }
    if (url === metadata.registration_endpoint) {
      return Response.json({ client_id: 'client-1' });
    }
    if (url === metadata.token_endpoint) {
      return Response.json(tokens);
    }
    if (url === `${origin}/api/v1/cli/session`) {
      return init?.method === 'DELETE' ? new Response(null, { status: 204 }) : Response.json(session);
    }
    throw new Error('Unexpected request');
  });
}

describe('CLI OAuth', () => {
  it('registers a public client, receives the browser callback, exchanges PKCE and persists a usable connection', async () => {
    const fetcher = createFetcher();
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    let authorizationUrl: URL | undefined;
    let browserRequest: Promise<Response> | undefined;
    const auth = new CliAuth(storage, fetcher);
    expect(
      await auth.login({ url: origin }, url => {
        authorizationUrl = new URL(url);
        const callback = new URL(authorizationUrl.searchParams.get('redirect_uri')!);
        callback.search = new URLSearchParams({
          state: authorizationUrl.searchParams.get('state')!,
          code: 'code-1',
          iss: issuer,
        }).toString();
        browserRequest = fetch(callback);
      }),
    ).toEqual(session);
    expect((await browserRequest)?.status).toBe(200);
    const registration = fetcher.mock.calls.find(([url]) => url === metadata.registration_endpoint)!;
    expect(JSON.parse(String(registration[1]?.body))).toMatchObject({
      client_name: 'Bulkgrid CLI',
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
    });
    const exchange = fetcher.mock.calls.find(([url]) => url === metadata.token_endpoint)!;
    const body = exchange[1]?.body as URLSearchParams;
    expect(body.get('code')).toBe('code-1');
    expect(body.get('client_id')).toBe('client-1');
    expect(createHash('sha256').update(body.get('code_verifier')!).digest('base64url')).toBe(
      authorizationUrl?.searchParams.get('code_challenge'),
    );
    expect(await storage.read(origin)).toMatchObject({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      clientId: 'client-1',
    });
    const file = (await readdir(directory)).find(name => name.endsWith('.json'))!;
    if (process.platform !== 'win32') {
      expect((await stat(join(directory, file))).mode & 0o777).toBe(0o600);
    }
    expect(JSON.stringify(log.mock.calls)).not.toContain('access-1');
    expect(fetcher.mock.calls.every(([, init]) => init?.redirect === 'error')).toBe(true);
  });

  it('rejects mismatched issuer metadata before opening a browser or registering', async () => {
    const fetcher = createFetcher();
    fetcher.mockResolvedValueOnce(Response.json({ resource: `${origin}/api/v1/mcp`, authorization_servers: [issuer] }));
    fetcher.mockResolvedValueOnce(Response.json({ ...metadata, issuer: 'https://other.example' }));
    const browser = vi.fn();
    await expect(new CliAuth(storage, fetcher).login({ url: origin }, browser)).rejects.toThrow('discovery');
    expect(browser).not.toHaveBeenCalled();
    expect(await storage.read(origin)).toBeUndefined();
  });

  it('rotates and saves refresh tokens before fetching connection status', async () => {
    await storage.save(saved);
    const fetcher = createFetcher();
    expect(await new CliAuth(storage, fetcher).status(origin)).toEqual(session);
    expect((fetcher.mock.calls[0]![1]?.body as URLSearchParams).get('refresh_token')).toBe('old-refresh');
    expect(await storage.read(origin)).toMatchObject({ refreshToken: 'refresh-1', accessToken: 'access-1' });
    expect(fetcher.mock.calls[1]![1]?.headers).toEqual({ Authorization: 'Bearer access-1' });
  });

  it('does not replace credentials when refresh fails', async () => {
    await storage.save(saved);
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 400 }));
    await expect(new CliAuth(storage, fetcher).status(origin)).rejects.toThrow('HTTP 400');
    expect(await storage.read(origin)).toEqual(saved);
  });

  it('checks server revocation even when the saved token has not expired', async () => {
    await storage.save({ ...saved, expiresAt: Date.now() + 3600_000 });
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 403 }));
    await expect(new CliAuth(storage, fetcher).getAccessToken(origin)).rejects.toThrow('HTTP 403');
  });

  it('revokes only the current connection then deletes local credentials', async () => {
    await storage.save({ ...saved, expiresAt: Date.now() + 3600_000 });
    const fetcher = createFetcher();
    await new CliAuth(storage, fetcher).logout({ url: origin });
    expect(fetcher).toHaveBeenCalledWith(
      `${origin}/api/v1/cli/session`,
      expect.objectContaining({ method: 'DELETE', headers: { Authorization: 'Bearer old-access' } }),
    );
    expect(await storage.read(origin)).toBeUndefined();
  });

  it('preserves tokens after failed remote logout, while explicit local logout works offline', async () => {
    await storage.save(saved);
    const fetcher = vi.fn<typeof fetch>().mockRejectedValue(new Error('Offline'));
    const auth = new CliAuth(storage, fetcher);
    await expect(auth.logout({ url: origin })).rejects.toThrow('Could not revoke');
    expect(await storage.read(origin)).toEqual(saved);
    fetcher.mockClear();
    await auth.logout({ url: origin, local: true });
    expect(fetcher).not.toHaveBeenCalled();
    expect(await storage.read(origin)).toBeUndefined();
  });

  it('keeps different servers separate and prevents simultaneous refresh operations', async () => {
    await storage.save(saved);
    expect(await storage.read('https://other.example')).toBeUndefined();
    await storage.exclusive(origin, async () => {
      await expect(new CliAuth(storage, createFetcher()).status(origin)).rejects.toThrow('Another CLI');
    });
    expect(await new CliAuth(storage, createFetcher()).status(origin)).toEqual(session);
  });

  it('rejects insecure remote URLs and permits local development', () => {
    expect(resolveOrigin('http://127.0.0.1:3000')).toBe('http://127.0.0.1:3000');
    expect(() => resolveOrigin('http://example.com')).toThrow('HTTPS');
    expect(() => resolveOrigin('https://example.com/api')).toThrow('base URL');
  });
});
