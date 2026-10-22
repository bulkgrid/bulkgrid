<p align="center">
  <a href="https://bulkgrid.com">
    <img src="docs/logo/bgicon.png" alt="Bulkgrid logo" width="112" height="112" />
  </a>
</p>

<h1 align="center">Bulkgrid</h1>

<p align="center"><strong>Search the web. Map websites. Crawl content. Build your index.</strong></p>

<p align="center">
  Web data and trusted knowledge for your applications and AI agents.
</p>

<p align="center">
  <a href="https://bulkgrid.com">Website</a> ·
  <a href="https://bulkgrid.com/docs">Documentation</a> ·
  <a href="https://bulkgrid.com/dashboard">Dashboard</a> ·
  <a href="https://www.npmjs.com/package/@bulkgrid/sdk">TypeScript</a> ·
  <a href="packages/sdk-python">Python</a>
</p>

## One platform, from discovery to retrieval

Bulkgrid turns web pages and repository content into useful data. Discover information with live search, map a website's URLs, collect page content, extract structured fields, and maintain a searchable index for your apps and agents.

| Capability                            | What you can do                                                                       | TypeScript SDK          |
| ------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------- |
| **[Search](docs/search.mdx)**         | Find web pages, images, or news. Optionally crawl their source pages in the same run. | `client.search()`       |
| **[Map](docs/map.mdx)**               | Discover URLs from a website's sitemaps, with keyword filtering and a result limit.   | `client.map()`          |
| **[Crawl](docs/crawl.mdx)**           | Fetch specific URLs as Markdown, HTML, text, or screenshots.                          | `client.crawl()`        |
| **[Deep Crawl](docs/deep-crawl.mdx)** | Follow links within page, depth, and path boundaries.                                 | `client.deepCrawl()`    |
| **[Extract](docs/extraction.mdx)**    | Turn page content into structured data using a query and JSON schema.                 | `client.extract()`      |
| **[Index](docs/index.mdx)**           | Search indexed website and GitHub content, curate collections, and refresh sources.   | `client.index.search()` |

Use these capabilities independently or combine them: **Search or Map → Crawl or Extract**, or **Sources → Index → Collections → Retrieval**. Map returns sitemap URLs; it does not fetch page content. Live search returns ranked results immediately. Map, Crawl, Deep Crawl, and Extract return runs that you can inspect for progress and results.

## Get started

Create a workspace in the [dashboard](https://bulkgrid.com/dashboard), then create an API key in [Settings → API Keys](https://bulkgrid.com/dashboard/settings/api-keys). Keep the key in your backend environment.

### TypeScript / JavaScript

Requires Node.js 22 or newer.

```bash
npm install @bulkgrid/sdk
export BULKGRID_API_KEY='bg_live_your_api_key'
```

Search the live web:

```js
import { BulkgridClient } from "@bulkgrid/sdk";

const client = new BulkgridClient({
  apiKey: process.env.BULKGRID_API_KEY ?? "",
});

const search = await client.search({
  query: "open source web crawlers",
  limit: 5,
});

console.log(search.results);
console.log(search.run.id); // Reopen saved results with client.runs.get(id)
```

Set `type: 'images'` or `type: 'news'` for other search modes. Add `crawl: true` to collect the results' source pages in the same run.

Map a website or crawl a known page:

```js
const map = await client.map({
  url: "https://example.com",
  config: { search: "docs", limit: 100 },
});

const crawl = await client.crawl({
  urls: ["https://example.com"],
  options: { formats: ["markdown"] },
});

console.log(map.id, crawl.id);
```

Use `client.runs.get(id)` to check progress. A completed map exposes its URLs in `result_data.links`; crawled pages are available through `client.runs.results(id)` and `client.runs.getResultContent(...)`. See [Runs and results](docs/runs-and-results.mdx) for polling, pagination, retry, and cancellation.

Search your index:

```js
const evidence = await client.index.search({
  query: "How does authentication work?",
  limit: 5,
});

for (const result of evidence.results) {
  console.log(result.text_content, result.url);
}
```

Index retrieval requires indexed content in collections accessible to your key. Manage that content with `client.index.sources` and `client.index.collections`. Public website and GitHub sources can be reused across workspaces; private sources stay within their workspace. See [Sources](docs/sources.mdx) and [Collections](docs/collections.mdx).

Search requires `search:query`. Map and Crawl require `runs:write`; inspecting runs requires `runs:read`, and fetching page results requires `results:read`. See [API-key scopes](docs/api-key-scopes.mdx) for extraction and source-management permissions, and the [SDK guide](docs/sdk.mdx) for full examples.

### Python

The Python SDK includes synchronous and asynchronous clients for Python 3.10+.

```bash
pip install bulkgrid
```

```python
import os
from bulkgrid import BulkgridClient

with BulkgridClient(api_key=os.environ['BULKGRID_API_KEY']) as client:
    search = client.search({'query': 'open source web crawlers', 'limit': 5})
    print(search['results'])

    evidence = client.index.search({'query': 'authentication setup', 'limit': 5})
    print(evidence['results'])
```

Python uses methods such as `deep_crawl()` and `get_result_content()` while preserving API field names in dictionaries. See the [Python SDK README](packages/sdk-python/README.md) for async usage, configuration, and local installation. Repository changes may appear before their corresponding npm or PyPI release.

### Upgrading from an earlier SDK

The 0.4 API separates live discovery from indexed retrieval:

| Earlier interface                             | Current interface                                         |
| --------------------------------------------- | --------------------------------------------------------- |
| `client.search()` for indexed content         | `client.index.search()`                                   |
| `client.sources` / `client.collections`       | `client.index.sources` / `client.index.collections`       |
| `/api/v1/sources/*` / `/api/v1/collections/*` | `/api/v1/index/sources/*` / `/api/v1/index/collections/*` |
| `/api/v1/search` for indexed content          | `/api/v1/index/search`                                    |

**`client.search()` and `/api/v1/search` now perform live web search.** Earlier source and collection routes have no compatibility aliases. See the [SDK changelog](packages/sdk/CHANGELOG.md) before upgrading.

## Connect your AI agent

Add the remote MCP server in your client's settings:

```text
https://bulkgrid.com/api/v1/mcp
```

Complete browser sign-in, choose your workspace, and select the collections the connection can access. MCP retrieval searches indexed content and returns passages with source URLs.

For clients using `mcpServers` configuration:

```json
{
  "mcpServers": {
    "bulkgrid": {
      "url": "https://bulkgrid.com/api/v1/mcp"
    }
  }
}
```

Try: “Use Bulkgrid to find how authentication works in our documentation. Search the relevant collection and cite the source URLs.”

See [MCP setup](docs/mcp-server.mdx) for client instructions and [agent plugins](AGENT_PLUGINS.md) for installation and acceptance status. OAuth connections have retrieval access; source management requires an API key with explicit operation scopes.

## CLI and agent skills

The CLI configures MCP clients and manages Index sources with an API key:

```bash
npx @bulkgrid/cli --help
npx @bulkgrid/cli sources find 'example.com'
```

Source commands include `analyze`, `analyze-github`, `add`, `add-github`, `status`, and `recrawl`. Browser login creates a separate CLI OAuth connection. See the [CLI guide](docs/cli.mdx).

| Skill                                                | Purpose                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| [bulkgrid-search](skills/bulkgrid-search/SKILL.md)   | Retrieve indexed evidence and answer with citations.               |
| [bulkgrid-sources](skills/bulkgrid-sources/SKILL.md) | Inspect sources, manage ingestion, and organize collection access. |

Skills guide tool use; they do not create a connection or grant permissions.

## In this repository

| Component                | Location                                                       |
| ------------------------ | -------------------------------------------------------------- |
| TypeScript SDK           | [packages/sdk](packages/sdk)                                   |
| Python SDK               | [packages/sdk-python](packages/sdk-python)                     |
| CLI and MCP client setup | [packages/cli](packages/cli)                                   |
| Agent plugins            | [AGENT_PLUGINS.md](AGENT_PLUGINS.md)                           |
| Shared agent skills      | [skills](skills)                                               |
| Documentation            | [docs](docs)                                                   |
| OpenAPI specification    | [openapi/bulkgrid.openapi.json](openapi/bulkgrid.openapi.json) |
| Runnable examples        | [examples](examples)                                           |

These tools connect to the hosted Bulkgrid service. The API backend, MCP service, crawling and indexing engines, database, and billing are maintained in the private platform repository. This repository contains the public developer tools, not a self-hostable backend.

## Development and contributions

```bash
npm ci
npm run check
node packages/cli/dist/cli.js --help
```

Use Node.js 22+ and Python 3.10+ to validate all packages. See [CONTRIBUTING.md](CONTRIBUTING.md) for checks and [MAINTAINERS.md](MAINTAINERS.md) for the platform export workflow. API contracts and SDK types follow the platform schemas; plugins, shared skills, and public tooling are maintained here.

## License

Agent plugin resources and shared skills use [Apache-2.0](packages/agent-core/LICENSE). Bulkgrid branding retains its trademark rights. SDK and CLI code remains `UNLICENSED`; the Python SDK declares a proprietary license. The documentation template's existing license is preserved in [docs/LICENSE](docs/LICENSE).

[Documentation](https://bulkgrid.com/docs) · [Dashboard](https://bulkgrid.com/dashboard) · [X](https://x.com/bulkgrid) · [Support](mailto:support@bulkgrid.com)
