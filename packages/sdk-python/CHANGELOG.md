# Changelog

## 0.4.0 — 2026-10-16

### Breaking changes

- `client.search()` now searches the live web, with optional background crawling.
- Add `type: 'images'` for image search with source pages, image URLs, nullable dimensions and thumbnails. Search responses include a `type` discriminator; image crawling processes unique source pages.
- Add `type: 'news'` for news articles with titles, URLs, snippets, publisher names, publication date text, and optional images. Crawling processes article pages.
- Every live search creates a Search run. Replace nullable `crawlRun` with required `run`; retrieve saved results with `runs.get(...).search` and crawl content through the same run.
- Indexed search moves to `client.index.search()`; source and collection methods move to `client.index.sources` and `client.index.collections`.
- Indexed API routes now live under `/api/v1/index`, including chat and conversations. `/api/v1/search` is live web search.
- The previous top-level source/collection methods and `/api/v1/web-search` route are removed. There are no legacy aliases, redirects, or request-shape fallbacks.
- Search types now describe live web results. Use the `IndexSearch` types for indexed retrieval.

## 0.2.0 — 2026-09-15

- Added optional `sourceIds` to search requests to restrict results to specific sources within existing workspace and collection permissions.

## 0.1.0

- Initial synchronous and asynchronous Python clients.
- Typed search, source, collection, run, crawl, deep-crawl, and extraction operations generated from the public API contract.
- API/network errors, connection cleanup, bounded network timeouts, and text/binary result downloads.
