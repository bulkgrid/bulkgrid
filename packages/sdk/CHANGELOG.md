# Changelog

## 0.2.0 — 2026-09-10

### Added

- `sources`: search the public/owned catalog, list workspace sources, create or subscribe, get, update, delete/unsubscribe, create GitHub sources, refresh, check indexing status, and paginate documents and changes.
- `collections`: list, create, get, update, delete, inspect/update inclusion and exclusion rules, and add/remove sources using those rules.
- Typed source and collection requests and responses backed by the shared API contract.
- Source and collection operations in the generated OpenAPI reference.

### Fixed

- Crawl, deep-crawl, and extraction helpers send their required run type automatically.
- Search responses expose `queryMode` and `executedQueries` in TypeScript.
- Run and result response types come from the shared contract, including source details and indexing progress.
- Non-JSON API failures raise `BulkgridApiError` with the HTTP status and response text.

### Compatibility

- Existing SDK method signatures remain available. More precise run/result response types can reveal application type errors previously hidden by `unknown`.
- New management methods require API keys with the appropriate sources/collections scopes. Workspace permissions, collection restrictions, and plan limits remain enforced by the server. MCP OAuth grants do not gain write access.
- `collections.addSource` adds a whole-source include rule and preserves exclusions. `collections.removeSource` reads the current rules and removes the matching source rules; it needs both collection read/write scopes. Rules added concurrently after that read are not removed.
- `sources.create` may subscribe to an existing shared source and return `created: false`. `sources.delete` removes the workspace subscription for shared sources; it does not globally delete them.

## 0.1.0

- Initial SDK for search, crawl, extraction, run management, and result retrieval.
