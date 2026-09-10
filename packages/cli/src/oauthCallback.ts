import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';

export const CLI_CALLBACK_PATH = '/bulkgrid/cli/callback';

export async function listenForOAuthCallback(state: string, issuer: string, timeoutMs = 300_000) {
  let resolveCode!: (code: string) => void;
  let rejectCode!: (error: Error) => void;
  const code = new Promise<string>((resolve, reject) => {
    resolveCode = resolve;
    rejectCode = reject;
  });
  // Discovery can fail before the caller begins waiting for the callback.
  void code.catch(() => undefined);
  let redirectUri = '';
  const server = createServer((request, response) => {
    response.setHeader('Content-Type', 'text/plain; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Referrer-Policy', 'no-referrer');
    let url: URL;
    try {
      url = new URL(request.url ?? '/', redirectUri);
    } catch {
      response.writeHead(400).end('Invalid callback URL.');
      return;
    }
    if (request.method !== 'GET' || url.pathname !== CLI_CALLBACK_PATH || request.headers.host !== new URL(redirectUri).host) {
      response.writeHead(404).end('Not found');
      return;
    }
    const receivedState = url.searchParams.get('state') ?? '';
    if (
      Buffer.byteLength(receivedState) !== Buffer.byteLength(state) ||
      !timingSafeEqual(Buffer.from(receivedState), Buffer.from(state))
    ) {
      response.writeHead(400).end('Invalid login state. Return to the original login tab.');
      return;
    }
    if (url.searchParams.has('iss') && url.searchParams.get('iss') !== issuer) {
      response.writeHead(400).end('Invalid authorization server.');
      rejectCode(new Error('OAuth callback issuer did not match.'));
      return;
    }
    if (url.searchParams.has('error')) {
      response.writeHead(400).end('Login was declined. Return to your terminal.');
      rejectCode(new Error('Authorization was declined. Run bulkgrid login to try again.'));
      return;
    }
    const authorizationCode = url.searchParams.get('code');
    if (!authorizationCode) {
      response.writeHead(400).end('Missing authorization code.');
      return;
    }
    response.end('Authorization received. Return to your terminal to check login completed.');
    resolveCode(authorizationCode);
  });
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolve();
    });
  });
  const address = server.address();
  if (!address || typeof address === 'string') {
    server.close();
    throw new Error('Unable to start the CLI login callback.');
  }
  redirectUri = `http://127.0.0.1:${address.port}${CLI_CALLBACK_PATH}`;
  const timer = setTimeout(() => rejectCode(new Error('Login timed out. Run bulkgrid login to try again.')), timeoutMs);
  const cancel = () => rejectCode(new Error('Login cancelled.'));
  process.once('SIGINT', cancel);
  process.once('SIGTERM', cancel);
  return {
    redirectUri,
    code,
    close: () => {
      clearTimeout(timer);
      process.removeListener('SIGINT', cancel);
      process.removeListener('SIGTERM', cancel);
      server.closeAllConnections();
      server.close();
    },
  };
}
