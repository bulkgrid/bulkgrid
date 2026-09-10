import { describe, expect, it } from 'vitest';
import { listenForOAuthCallback } from './oauthCallback.js';

const issuer = 'https://auth.example/auth/v1';
describe('CLI callback listener', () => {
  it('ignores invalid state and unrelated requests, then accepts the correct callback', async () => {
    const listener = await listenForOAuthCallback('expected-state', issuer);
    try {
      expect((await fetch(`${listener.redirectUri}?state=wrong&code=bad`)).status).toBe(400);
      expect((await fetch(new URL('/favicon.ico', listener.redirectUri))).status).toBe(404);
      const response = await fetch(`${listener.redirectUri}?state=expected-state&code=good`);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(await listener.code).toBe('good');
    } finally {
      listener.close();
    }
  });

  it('rejects consent denial and an unexpected issuer', async () => {
    for (const query of ['error=access_denied', 'code=code&iss=https://wrong.example']) {
      const listener = await listenForOAuthCallback('state', issuer);
      try {
        const outcome = expect(listener.code).rejects.toThrow();
        await fetch(`${listener.redirectUri}?state=state&${query}`);
        await outcome;
      } finally {
        listener.close();
      }
    }
  });

  it('times out and closes the listening socket', async () => {
    const listener = await listenForOAuthCallback('state', issuer, 20);
    await expect(listener.code).rejects.toThrow('timed out');
    listener.close();
    await expect(fetch(listener.redirectUri)).rejects.toThrow();
  });
});
