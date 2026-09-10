import { spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import { AuthStorage, type CliCredentials } from './authStorage.js';
import { listenForOAuthCallback } from './oauthCallback.js';

const DEFAULT_ORIGIN = 'https://bulkgrid.com';
const identityScopes = 'openid email profile';
const metadataSchema = z.object({
  issuer: z.string().url(),
  authorization_endpoint: z.string().url(),
  token_endpoint: z.string().url(),
  registration_endpoint: z.string().url(),
  code_challenge_methods_supported: z.array(z.string()),
});
const tokensSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  token_type: z.string().refine(value => value.toLowerCase() === 'bearer'),
  expires_in: z.number().positive().finite(),
});
const sessionSchema = z.object({
  userId: z.string(),
  workspaceId: z.string(),
  clientName: z.string().nullable(),
  scopes: z.array(z.string()),
  collectionScope: z.enum(['all', 'selected']),
});
export type CliSession = z.infer<typeof sessionSchema>;
export interface LoginOptions {
  readonly url?: string;
  readonly browser?: boolean;
}

class HttpError extends Error {
  constructor(readonly status: number) {
    super(`Authentication request failed (HTTP ${status}). Check the server configuration or run bulkgrid login again.`);
  }
}

function secureUrl(value: string): URL {
  const url = new URL(value);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) || url.username || url.password || url.hash) {
    throw new Error('Authentication URLs must use HTTPS (HTTP is allowed only for local development).');
  }
  return url;
}

export function resolveOrigin(value = process.env.BULKGRID_URL ?? DEFAULT_ORIGIN): string {
  const url = secureUrl(value);
  if (url.pathname !== '/' || url.search) {
    throw new Error('Use the Bulkgrid base URL, such as https://bulkgrid.com, without a path or query.');
  }
  return url.origin;
}

export function openLoginBrowser(url: string): void {
  // The generated URL is passed as an argument, never interpolated into a shell command.
  const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'rundll32' : 'xdg-open';
  const args = process.platform === 'win32' ? ['url.dll,FileProtocolHandler', url] : [url];
  const child = spawn(command, args, { stdio: 'ignore', detached: true });
  child.on('error', () => console.log('Could not open a browser. Open the login URL above manually.'));
  child.unref();
}

export class CliAuth {
  constructor(
    private readonly storage = new AuthStorage(),
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  private async request(url: string, init?: RequestInit): Promise<Response> {
    secureUrl(url);
    const response = await this.fetcher(url, { ...init, redirect: 'error', signal: AbortSignal.timeout(15_000) });
    if (!response.ok) {
      throw new HttpError(response.status);
    }
    return response;
  }

  private async requestJson(url: string, init?: RequestInit): Promise<unknown> {
    const response = await this.request(url, init);
    try {
      return await response.json();
    } catch {
      throw new Error('The authentication server returned invalid JSON.');
    }
  }

  private async discover(origin: string) {
    const resource = `${origin}/api/v1/mcp`;
    const response = await this.requestJson(`${origin}/.well-known/oauth-protected-resource/api/v1/mcp`);
    const protectedResource = z
      .object({ resource: z.literal(resource), authorization_servers: z.array(z.string().url()).length(1) })
      .parse(response);
    const issuer = secureUrl(protectedResource.authorization_servers[0]!);
    if (issuer.search) {
      throw new Error('Invalid authorization server issuer.');
    }
    const discoveryUrl = `${issuer.origin}/.well-known/oauth-authorization-server${issuer.pathname === '/' ? '' : issuer.pathname}`;
    const metadata = metadataSchema.parse(await this.requestJson(discoveryUrl));
    if (
      metadata.issuer !== protectedResource.authorization_servers[0] ||
      !metadata.code_challenge_methods_supported.includes('S256')
    ) {
      throw new Error('Authorization server discovery must match its issuer and support PKCE S256.');
    }
    for (const endpoint of [metadata.authorization_endpoint, metadata.token_endpoint, metadata.registration_endpoint]) {
      if (secureUrl(endpoint).origin !== issuer.origin) {
        throw new Error('OAuth endpoints must belong to the discovered authorization server.');
      }
    }
    return metadata;
  }

  async login(options: LoginOptions = {}, openBrowser: (url: string) => void = openLoginBrowser): Promise<CliSession> {
    const origin = resolveOrigin(options.url);
    return this.storage.exclusive(origin, async () => {
      if (await this.storage.read(origin)) {
        throw new Error('A CLI login is already saved for this server. Use bulkgrid status or bulkgrid logout first.');
      }
      const metadata = await this.discover(origin);
      const verifier = randomBytes(32).toString('base64url');
      const state = randomBytes(32).toString('base64url');
      const callback = await listenForOAuthCallback(state, metadata.issuer);
      try {
        const registration = z.object({ client_id: z.string().min(1) }).parse(
          await this.requestJson(metadata.registration_endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_name: 'Bulkgrid CLI',
              client_uri: origin,
              redirect_uris: [callback.redirectUri],
              grant_types: ['authorization_code', 'refresh_token'],
              response_types: ['code'],
              token_endpoint_auth_method: 'none',
              scope: identityScopes,
            }),
          }),
        );
        const authorizationUrl = new URL(metadata.authorization_endpoint);
        authorizationUrl.search = new URLSearchParams({
          response_type: 'code',
          client_id: registration.client_id,
          redirect_uri: callback.redirectUri,
          scope: identityScopes,
          state,
          code_challenge: createHash('sha256').update(verifier).digest('base64url'),
          code_challenge_method: 'S256',
          prompt: 'consent',
        }).toString();
        console.log(`Sign in and approve access:\n${authorizationUrl.href}`);
        if (options.browser !== false) {
          openBrowser(authorizationUrl.href);
        }
        const code = await callback.code;
        const tokens = await this.exchange(metadata.token_endpoint, {
          grant_type: 'authorization_code',
          client_id: registration.client_id,
          code,
          redirect_uri: callback.redirectUri,
          code_verifier: verifier,
        });
        const credentials: CliCredentials = {
          origin,
          issuer: metadata.issuer,
          tokenEndpoint: metadata.token_endpoint,
          clientId: registration.client_id,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: Date.now() + tokens.expires_in * 1000,
        };
        // Persist before checking the resource so a transient API failure can be retried or logged out.
        await this.storage.save(credentials);
        return await this.session(credentials);
      } finally {
        callback.close();
      }
    });
  }

  private async exchange(endpoint: string, body: Record<string, string>) {
    return tokensSchema.parse(
      await this.requestJson(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(body),
      }),
    );
  }

  private async credentials(origin: string): Promise<CliCredentials> {
    const saved = await this.storage.read(origin);
    if (!saved) {
      throw new Error('Not logged in. Run bulkgrid login.');
    }
    if (secureUrl(saved.tokenEndpoint).origin !== secureUrl(saved.issuer).origin) {
      throw new Error('Saved token endpoint does not match the authorization server. Log out locally and sign in again.');
    }
    if (saved.expiresAt > Date.now() + 60_000) {
      return saved;
    }
    const tokens = await this.exchange(saved.tokenEndpoint, {
      grant_type: 'refresh_token',
      client_id: saved.clientId,
      refresh_token: saved.refreshToken,
    });
    const refreshed = {
      ...saved,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
    };
    await this.storage.save(refreshed);
    return refreshed;
  }

  private async session(credentials: CliCredentials): Promise<CliSession> {
    return sessionSchema.parse(
      await this.requestJson(`${credentials.origin}/api/v1/cli/session`, {
        headers: { Authorization: `Bearer ${credentials.accessToken}` },
      }),
    );
  }

  async status(url?: string): Promise<CliSession> {
    const origin = resolveOrigin(url);
    return this.storage.exclusive(origin, async () => this.session(await this.credentials(origin)));
  }

  /** For CLI API consumers; tokens are never copied into agent/project configuration. */
  async getAccessToken(url?: string): Promise<string> {
    const origin = resolveOrigin(url);
    return this.storage.exclusive(origin, async () => {
      const credentials = await this.credentials(origin);
      await this.session(credentials);
      return credentials.accessToken;
    });
  }

  async logout(options: { url?: string; local?: boolean } = {}): Promise<void> {
    const origin = resolveOrigin(options.url);
    await this.storage.exclusive(origin, async () => {
      if (options.local) {
        await this.storage.clear(origin);
        return;
      }
      if (!(await this.storage.read(origin))) {
        return;
      }
      try {
        const credentials = await this.credentials(origin);
        await this.request(`${origin}/api/v1/cli/session`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${credentials.accessToken}` },
        });
      } catch {
        throw new Error(
          'Could not revoke the CLI connection. Retry, or revoke it in Connected Apps and use bulkgrid logout --local.',
        );
      }
      await this.storage.clear(origin);
    });
  }
}
