# Examples

After `npm ci` and `npm run build`, set `BULKGRID_API_KEY` in your shell and run:

```sh
node examples/search.mjs "authentication setup"
```

This calls the hosted service and requires indexed content accessible to the key. SDK source and collection workflows are documented in [the SDK guide](../docs/getting-started/sdk.mdx). For agent connections, follow [MCP setup](../docs/integrations/mcp-server.mdx).
