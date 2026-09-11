# Bulkgrid — Better AI Answers From Sources You Trust

Turn websites and GitHub repositories into an index your applications and agents can search. Choose your sources, organize content into collections, and retrieve relevant passages with links to the original pages.

[Website](https://bulkgrid.com) · [Documentation](https://bulkgrid.com/docs) · [Dashboard](https://bulkgrid.com/dashboard) · [TypeScript SDK](https://www.npmjs.com/package/@bulkgrid/sdk) · [CLI](https://www.npmjs.com/package/@bulkgrid/cli)

## Why Bulkgrid?

An assistant answering questions about your product needs access to the documentation, guides, and repository content you trust. Building that access involves fetching content, keeping it current, organizing it, and deciding who can search it.

Bulkgrid brings those steps together:

- **Choose the knowledge.** Add website sections or public GitHub repositories. Analyze website coverage before deciding what to ingest.
- **Keep it current.** Refresh sources and inspect indexing progress and changes between runs.
- **Curate each app's context.** Include or exclude sources, folders, and pages through collection rules.
- **Control access.** Scope API keys and OAuth connections to a workspace and approved collections.
- **Retrieve evidence.** Search indexed content for relevant passages and their source URLs, ready for your application or agent to use.

Use Bulkgrid for documentation search, support assistants, repository knowledge, and retrieval-augmented generation. You can also crawl individual URLs or extract structured fields for workflows that need content outside a persistent index.

## How it works

```text
Websites and GitHub repositories
              ↓
      Indexed source documents
              ↓
    Collections and access rules
              ↓
       Search through MCP or SDK
              ↓
       Passages with source URLs
```

Sources hold the content. Collections define what an application or agent can retrieve. Search works on content already indexed and accessible to the connection.

## Get started

1. Open [Bulkgrid](https://bulkgrid.com/dashboard) and choose your workspace.
2. Add a source or subscribe to an existing public website source, then wait for indexing to finish.
3. Choose the content your app or agent should access, using collections where needed.
4. Connect your agent through MCP or call the API with the SDK.

Public website sources can be shared across workspaces. Private sources and GitHub sources are workspace-owned, even when the GitHub repository itself is public. Source creation, collections, and refresh options are subject to your plan.

### Connect your AI agent

Add this remote MCP server in your client's settings:

```text
https://bulkgrid.com/api/v1/mcp
```

Complete browser sign-in, review the workspace, and select the collections the connection can access.

For Cursor, add the server inside your project's `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "bulkgrid": {
      "url": "https://bulkgrid.com/api/v1/mcp"
    }
  }
}
```

If you already have MCP servers configured, add `bulkgrid` to the existing `mcpServers` object. Enable it in Cursor's MCP settings and complete authentication.

For Codex, Claude Code, OpenCode, and other clients, see [MCP setup](https://bulkgrid.com/docs/mcp-server).

Then try a prompt:

```text
Use Bulkgrid to find how authentication works in our product documentation.
Search the relevant collection and include source URLs in your answer.
```

```text
Search our indexed API documentation for retry and rate-limit guidance.
Summarize the recommendations and cite the pages that support them.
```

OAuth connections have search access. Source management requires an API key with explicit operation scopes.

### Use the TypeScript SDK

Requires Node.js 22 or newer. Create an API key in [Settings → API Keys](https://bulkgrid.com/dashboard/settings/api-keys) with `search:query` and access to the relevant content.

```bash
npm install @bulkgrid/sdk
export BULKGRID_API_KEY='bg_live_your_api_key'
```

```js
import { BulkgridClient } from '@bulkgrid/sdk';

const client = new BulkgridClient({
  apiKey: process.env.BULKGRID_API_KEY ?? '',
});

const response = await client.search({
  query: 'How does authentication work?',
  limit: 5,
});

for (const result of response.results) {
  console.log(result.text_content);
  console.log(result.url);
}
```

The SDK also supports source analysis and management, collections, crawling, extraction, and run results. Keep API keys in your backend environment. See the [SDK guide](https://bulkgrid.com/docs/sdk).

### Use the CLI

The CLI manages sources and configures supported MCP clients. It requires Node.js 22 or newer.

```bash
npx @bulkgrid/cli --help
```

With a suitably scoped API key, inspect existing sources before adding content:

```bash
export BULKGRID_API_KEY='bg_live_your_api_key'
npx @bulkgrid/cli sources find 'example.com'
```

Source commands include `analyze`, `analysis-status`, `add`, `status`, and `recrawl`. Analysis and ingestion can consume resources; choose the source boundary and refresh behavior before starting them.

Browser login creates a separate CLI OAuth connection. It does not authorize source management or sign your other AI clients in. See the [CLI guide](https://bulkgrid.com/docs/cli) for authentication and client configuration.

## Agent skills

This repository includes instructions agents can use alongside a connected Bulkgrid MCP server:

| Skill                                                | Purpose                                                                                                      |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [bulkgrid-search](skills/bulkgrid-search/SKILL.md)   | Choose the relevant indexed content, retrieve evidence, and answer with citations.                           |
| [bulkgrid-sources](skills/bulkgrid-sources/SKILL.md) | Find existing sources, analyze coverage, and manage ingestion and collections within the user's permissions. |

Skills guide how the agent uses its available tools; they do not create a connection or grant additional access. Follow your agent's skill installation instructions to add the relevant skill directory.

## What's in this repository?

| Component                | Location                                                       |
| ------------------------ | -------------------------------------------------------------- |
| TypeScript SDK           | [packages/sdk](packages/sdk)                                   |
| CLI and MCP client setup | [packages/cli](packages/cli)                                   |
| Agent skills             | [skills](skills)                                               |
| Documentation            | [docs](docs)                                                   |
| OpenAPI specification    | [openapi/bulkgrid.openapi.json](openapi/bulkgrid.openapi.json) |
| Runnable examples        | [examples](examples)                                           |

These tools connect to the hosted Bulkgrid service. The MCP server implementation, API backend, crawling and indexing services, database, and billing remain in the private platform repository. This repository does not contain a self-hostable Bulkgrid backend.

## Development and contributions

Requires Node.js 22 or newer.

```bash
npm ci
npm run check
node packages/cli/dist/cli.js --help
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance and [MAINTAINERS.md](MAINTAINERS.md) for refreshing the public export. API contracts are generated from the platform schemas. Source changes may appear here before their corresponding npm release.

## License

Bulkgrid code is currently `UNLICENSED`; no public license grant has been added. The documentation template's existing license is preserved in [docs/LICENSE](docs/LICENSE).

## Links

[Get started](https://bulkgrid.com/docs) · [MCP](https://bulkgrid.com/docs/mcp-server) · [SDK](https://bulkgrid.com/docs/sdk) · [CLI](https://bulkgrid.com/docs/cli) · [X](https://x.com/bulkgrid) · [Support](mailto:support@bulkgrid.com)
