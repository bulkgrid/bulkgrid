---
name: bulkgrid-search
description: Search a user's indexed Bulkgrid sources through a connected Bulkgrid MCP server and answer with source references. Use when the user asks to query their Bulkgrid content.
---

Use the connected Bulkgrid MCP tools to search indexed content. If the connection is missing, point to the hosted endpoint `https://bulkgrid.com/api/v1/mcp` and the [connection guide](../../docs/integrations/mcp-server.mdx). Do not request tokens in chat.

Discover the tools available on the connection. Use `list_collections` when collection scope is unclear. If a capabilities tool is available, inspect it for supported search options. Start focused searches with 5–10 results; use complementary queries when the question spans multiple concepts. Preserve exact identifiers when searching for specific names or codes.

Base answers on returned passages and cite their source URLs. Distinguish missing evidence from negative findings. Empty results can mean content is not indexed or accessible; a collection filter cannot broaden the connection's permissions. Report access failures without attempting to bypass collection or workspace restrictions. Connecting MCP does not ingest content automatically.
