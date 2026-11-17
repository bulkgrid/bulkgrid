# Bulkgrid CLI

Search, crawl, extract, and retrieve indexed evidence from a terminal or coding agent. Requires Node.js 22+. The commands below are introduced in CLI 0.5.0; the repository may be ahead of the published npm package. Check `bulkgrid --version` and command help before using a released installation.

```sh
npm install -g @bulkgrid/cli
bulkgrid setup skills
bulkgrid search "solar panel recycling" --limit 5
```

Set `BULKGRID_API_KEY` in your backend/terminal environment for API operations. Use `BULKGRID_URL` or each command's `--url` option to select another deployment. Browser OAuth login is a separate connection; it does not supply this API key. Commands never prompt for missing API credentials or retry a mutation automatically.

## Install agent skills

```sh
bulkgrid setup skills                          # Current project's .agents/skills
bulkgrid setup skills --global                 # ~/.agents/skills
bulkgrid setup skills --directory .claude/skills
bulkgrid setup skills --list
bulkgrid setup skills --skill bulkgrid-search bulkgrid-crawl --dry-run
```

All six skills are bundled with the CLI release and installed without network access or authentication. The current skill instructions require CLI 0.6.0 or newer, including browser login and document parsing; sync the CLI implementation before releasing this bundle. They prefer CLI commands when a terminal is available, with MCP/SDK fallbacks. Use `--directory` for a client's explicit skill directory. Installation reports JSON with each skill's status: `installed`, `unchanged`, or `skipped`. A modified existing skill is skipped; `--force` replaces the entire selected skill directory, including local edits. `--dry-run` reports planned changes without writing files. Unrelated skills are preserved, and the installer refuses symbolic links in destination paths or existing skill trees.

## Search and collect content

```sh
bulkgrid search "solar panel recycling" --limit 5
bulkgrid search "solar panel recycling" --type news --country se --language en
bulkgrid search "Stockholm skyline" --type images --limit 5
bulkgrid search "solar panel recycling" --limit 5 --crawl --formats markdown
bulkgrid map https://example.com --limit 100 --no-subdomains --search docs
bulkgrid crawl https://example.com/a https://example.com/b --formats markdown,links
bulkgrid crawl https://example.com --screenshot fullPageScreenshot --options '{"waitForSelector":"main"}'
bulkgrid deep-crawl https://example.com/docs --max-pages 20 --max-depth 2 --include-paths /docs --formats markdown
```

`search` returns ranked results immediately and a saved `run.id`; optional page collection finishes asynchronously. It searches the live web. `index search` searches already indexed content. Image crawling collects source pages, not image files.

Map returns a run whose completed `result_data.links` contains sitemap URLs. Its keyword filter is not a strict path boundary. Crawl collects the explicit URL list. Deep Crawl requires `--max-pages` and `--max-depth`, stays under the starting path by default, and disables external and document links unless explicitly enabled. Use `--exclude-paths` for exclusions; `--no-restrict-to-start-path` permits traversal outside the starting path. Strict redirect or subdomain guarantees require service support; the CLI does not invent them.

Capture formats are `markdown`, `cleanHtml`, `rawHtml`, and `links`. `--options` accepts supported capture options as JSON; unknown fields are rejected. Capture flags on Search require `--crawl`, and custom headers/document-link expansion are rejected for search-result crawling.

## Extract structured fields

Save a JSON Schema object to `product-schema.json`, for example:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "price": { "type": ["number", "null"] }
  },
  "required": ["name", "price"]
}
```

```sh
bulkgrid extract https://example.com/product --query "Product name and listed price; null if price is absent" --schema-file product-schema.json --max-retries 1
```

Use exactly one of `--schema-file` or `--schema` (inline JSON). Extraction returns a run; retrieve `extraction_data` from its page results after completion. Preserve failed pages and source provenance instead of treating a partial run as complete coverage. This command accepts web URLs, not local document uploads or OCR input.

## Search indexed content

```sh
bulkgrid index search "How does authentication work?" --limit 5
bulkgrid index search "authentication" --collection-id COLLECTION_ID --source-ids SOURCE_ID
```

Replace uppercase ID placeholders with returned IDs. Filters intersect with each other and the key's existing collection restrictions. `--query-mode auto` enables query expansion; `--queries` accepts up to three complementary formulations. The CLI returns passages with source URLs. Full indexed document chunk reading remains available through MCP `get_document`; search excerpts are not a complete document.

## Runs, output and exit codes

```sh
bulkgrid runs status RUN_ID
bulkgrid runs wait RUN_ID --timeout 60 --interval 5
bulkgrid runs results RUN_ID --page 1 --limit 20
bulkgrid runs content RUN_ID RESULT_ID --type markdown --output page.md
bulkgrid runs screenshot RUN_ID RESULT_ID
bulkgrid runs list --page 1 --limit 20
bulkgrid runs retry RUN_ID --urls https://example.com/failed
bulkgrid runs cancel RUN_ID
```

API commands print JSON to stdout, except `runs content`, which returns raw text. Use `--output FILE` to save a response or `--output -` for stdout. Existing output files are overwritten. API errors produce JSON on stderr and exit 1; argument errors also exit nonzero. Commands do not perform hidden follow-up crawls or retries.

`runs wait` returns `{ "run": ..., "runId": "...", "timedOut": false }` and exits 0 on completion, 1 on failure/cancellation, or 2 when its deadline expires. A timeout keeps the last observed state; inspect the same run ID later. If the first status request reaches the wait deadline, `run` is null and the response still includes `runId`. Other network/request failures exit 1. The deadline covers waiting, not submission or later result requests. A completed run may still contain failed pages. Pagination returns `page`, `limit`, and `total`; read subsequent pages explicitly. Screenshots must have been captured at creation; the command returns a temporary signed URL, not image bytes.

| Operation | API-key scopes |
| --- | --- |
| Live or indexed search | `search:query` |
| Search with page collection | `search:query`, `runs:write` |
| Map, Crawl, Deep Crawl | `runs:write` |
| Extract | `extract:write` |
| List, inspect, wait for runs | `runs:read` |
| Page results, content, screenshots | `results:read` |
| Cancel | `runs:cancel` |
| Retry | `runs:retry`; Search runs also require `search:query` |

Crawling, extraction, and retries may consume credits. A page limit is not a monetary cap. Only execute work within the user's requested scope.

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
