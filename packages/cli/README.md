# Bulkgrid CLI

## Sign in

```sh
bulkgrid login
bulkgrid status
bulkgrid logout
```

`login` opens your browser. Sign in to Bulkgrid, approve the workspace and collection access, then return to the terminal.
Your current workspace is preselected when available. The connection appears as **Bulkgrid CLI** in
**Settings → Connected Apps**, where you can review or revoke access.

The CLI registers a public OAuth client with Supabase and uses authorization code flow with PKCE and a temporary
`127.0.0.1` callback. Supabase OAuth Server and dynamic registration must be enabled, and the app must include the CLI
session endpoint. No client secret or new database tables are required. The grant has the same `mcp:use` and
`search:query` permissions and collection restrictions as an MCP connection; login does not grant general dashboard administration.

Access and refresh tokens are stored per Bulkgrid origin in `~/.config/bulkgrid`, with owner-only file permissions.
The CLI refreshes tokens when needed and checks access against the server. It never copies these tokens into agent or
project configurations. Each new login after logout creates a separate client connection.

`logout` revokes the current Bulkgrid grant and removes its local tokens. This blocks API access, including with refreshed
OAuth tokens. It does not sign you out of the browser or other CLI installations. If the connection was already revoked
or the server is unavailable, revoke it through Connected Apps if needed, then use `bulkgrid logout --local` to clear local
credentials. A failed remote logout retains credentials so it can be retried.

For local development or another deployment, use the same base URL on every command:

```sh
bulkgrid login --url http://localhost:3000
bulkgrid status --url http://localhost:3000
bulkgrid logout --url http://localhost:3000
```

Alternatively set `BULKGRID_URL`. Remote deployments require HTTPS.
`--no-browser` prints the authorization URL; open it in a browser on the same computer as the CLI so the loopback callback
can complete. Login times out after five minutes and can be cancelled with Ctrl+C.

## Configure AI clients

`bulkgrid init` configures MCP connections for supported AI clients. Its API-key setup is separate from CLI login:

```sh
bulkgrid init --all
```

AI clients using OAuth should connect to the shared `/api/v1/mcp` URL and manage their own tokens and consent.
The `init --auth browser` option opens the dashboard to create an API key; it does not perform CLI OAuth login.

## Use a saved connection from CLI code

```ts
import { CliAuth } from '@bulkgrid/cli';

const accessToken = await new CliAuth().getAccessToken();
// Send as Authorization: Bearer <accessToken> to the matching Bulkgrid deployment.
```

`getAccessToken()` refreshes the credentials if necessary and checks the connection is still active before returning a token.

## Manage sources with an API key

Source commands require `BULKGRID_API_KEY`, independent of CLI OAuth login. Set `BULKGRID_URL` or use `--url` for another deployment.

```sh
bulkgrid sources --help
bulkgrid sources find https://example.com
bulkgrid sources status <sourceId>
```

`analyze` starts deeper analysis and may create a crawl run. `add --input '<json>'` creates/subscribes using explicit source configuration. `recrawl` starts a manual refresh. `collections`, `rules`, and `include` inspect and update collection access. All output JSON; none poll or retry mutations automatically. Use the least API-key scopes needed for the chosen operation. See the source-management skill and CLI documentation for the full workflow and permission mapping.
