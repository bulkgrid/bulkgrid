# Bulkgrid

Developer tools for crawling, extracting, and searching web content with [Bulkgrid](https://bulkgrid.com).

| Component | Location |
| --- | --- |
| TypeScript SDK | [packages/sdk](packages/sdk) |
| CLI and agent setup | [packages/cli](packages/cli) |
| Hosted MCP connection guide | [docs/integrations/mcp-server.mdx](docs/integrations/mcp-server.mdx) |
| API specification | [openapi/bulkgrid.openapi.json](openapi/bulkgrid.openapi.json) |
| Documentation | [docs](docs) |
| Runnable examples | [examples](examples) |
| Search skill | [skills/bulkgrid-search](skills/bulkgrid-search/SKILL.md) |
| Source management skill | [skills/bulkgrid-sources](skills/bulkgrid-sources/SKILL.md) |

## SDK

```js
import { BulkgridClient } from '@bulkgrid/sdk';
const client = new BulkgridClient({ apiKey: process.env.BULKGRID_API_KEY });
const response = await client.search({ query: 'authentication setup', limit: 5 });
console.log(response.results);
```

Requires indexed content and a key with `search:query` access to the relevant collections.

## MCP

Connect a remote MCP client to `https://bulkgrid.com/api/v1/mcp` and complete OAuth sign-in. API-key connections require `mcp:use` and `search:query`. The hosted MCP implementation stays in the platform; this repository includes its connection instructions and CLI setup tooling.

## Local development

Requires Node.js 22 or newer.

```sh
npm ci
npm run check
node packages/cli/dist/cli.js --help
```

The SDK and CLI build from source. Their versions describe these source snapshots; this repository does not establish that those versions have been released on npm.

## Maintenance and licensing

This is a curated export. See [CONTRIBUTING.md](CONTRIBUTING.md) for source ownership and [MAINTAINERS.md](MAINTAINERS.md) for refresh instructions. Contracts are generated from the platform's authoritative API schemas.

Bulkgrid code has no public license grant yet (`UNLICENSED`). Select a license before public release. The existing Mintlify license is preserved in [docs/LICENSE](docs/LICENSE) for the documentation template.
# bulkgrid
