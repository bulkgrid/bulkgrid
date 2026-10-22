# Examples

Run `npm ci` and `npm run build` from the repository root, then set `BULKGRID_API_KEY` in your shell. `BULKGRID_BASE_URL` is optional and defaults to `https://bulkgrid.com`.

| Example           | Command                                                   | Required scope                                               |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------------ |
| Live web search   | `node examples/web-search.mjs "open source web crawlers"` | `search:query`                                               |
| Indexed retrieval | `node examples/search.mjs "authentication setup"`         | `search:query` and indexed content in accessible collections |
| Website map       | `node examples/map.mjs "https://example.com"`             | `runs:write`                                                 |

These examples call the hosted service and consume the corresponding allowance. Search returns results immediately and saves a Search run. The map example starts an asynchronous run and prints its ID; inspect it with `client.runs.get(id)` and `runs:read`. When complete, mapped URLs are in `result_data.links`.

For crawling, extraction, source and collection management, and Python examples, see the [SDK guide](../docs/sdk.mdx), [Map](../docs/map.mdx), and [Runs and results](../docs/runs-and-results.mdx). For agent connections, follow [MCP setup](../docs/mcp-server.mdx).
