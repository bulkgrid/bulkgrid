# Bulkgrid Python SDK

Search trusted sources, manage indexing, and run crawl and extraction workflows from Python 3.10+.

## Install

```bash
pip install bulkgrid
```

For development before the first PyPI release, run `pip install -e packages/sdk-python` from the repository root.

## Search

Version 0.4.0 uses `client.search()` for live web search and `client.index.search()` for indexed retrieval.

Pass `type: "images"` to `client.search()` for image search. Check `result["type"]` to narrow the response to web, image, or news results. Image results include a source page `url`, `imageUrl`, nullable `imageWidth`, `imageHeight`, and `thumbnailUrl`. Every live search creates a Search run in `result["run"]`. With `crawl: True`, that same run crawls unique source pages. Use `client.runs.get(result["run"]["id"])["search"]` to reopen saved results, and `client.runs.results(result["run"]["id"])` for page content.

Pass `type: "news"` for news articles. News results include `title`, `url`, `snippet`, `position`, and nullable `source` (publisher), `date` (publication date text), and `imageUrl`. Check `result["type"] == "news"` before accessing news-specific fields. With `crawl: True`, one run crawls the unique article pages.
Source and collection methods live under `client.index.sources` and `client.index.collections`.
The former methods and API routes have been removed without compatibility aliases.

```python
import os
from bulkgrid import BulkgridClient

with BulkgridClient(api_key=os.environ["BULKGRID_API_KEY"]) as client:
    web = client.search({"query": "open source web crawlers", "crawl": True})
    print(web["results"], web["run"])
```

To search previously indexed content:

```python
import os
from bulkgrid import BulkgridClient

with BulkgridClient(api_key=os.environ["BULKGRID_API_KEY"]) as client:
    data = client.index.search({"query": "How does authentication work?", "limit": 5})
    for result in data["results"]:
        print(result["title"], result["url"])
```

Methods use Python `snake_case`. Request and response dictionary keys retain the API's spelling (for example `collectionId`, `maxPages`, and `source_id`). Types are available from `bulkgrid.types`; responses are ordinary dictionaries, not model objects. TypedDict annotations provide editor/type-checker support; the server validates request fields and the SDK checks HTTP status and JSON response shape, not every response field.

## Async

```python
import asyncio
import os
from bulkgrid import AsyncBulkgridClient


async def main():
    async with AsyncBulkgridClient(api_key=os.environ["BULKGRID_API_KEY"]) as client:
        data = await client.index.search({"query": "release notes", "limit": 3})
        print(data["results"])


asyncio.run(main())
```

Use a context manager, or call `close()` / `await aclose()` to release connections. Async cancellation propagates normally.

## Sources and collections

```python
import os
from bulkgrid import BulkgridClient

with BulkgridClient(api_key=os.environ["BULKGRID_API_KEY"]) as client:
    analysis = client.index.sources.analyze({"url": "https://example.com"})
    # Persist this ID. Poll with a bounded wait; do not resubmit after a timeout.
    print(client.index.sources.get_analysis(analysis["id"]))

    created = client.index.sources.create(
        {
            "type": "domain",
            "identifier": "https://example.com",
            "visibility": "private",
            "source_mode": "discover",
            "crawl_config": {"includePaths": ["/docs"]},
        }
    )
    source_id = created["source"]["id"]
    print(client.index.sources.status(source_id))
    client.index.collections.add_source(os.environ["COLLECTION_ID"], source_id)
```

Analysis and creation may start processing. Use explicitly scoped API keys and review scope before running writes. Source creation and refresh are subject to plan limits. Public sources can be included in collections without a subscription. An analysis is not a subscription and a created source is not necessarily indexed yet.

## Crawl and results

```python
import os
import time
from bulkgrid import BulkgridClient

with BulkgridClient(api_key=os.environ["BULKGRID_API_KEY"]) as client:
    run = client.crawl({"urls": ["https://example.com"], "options": {"formats": ["markdown"]}})
    deadline = time.monotonic() + 120
    while time.monotonic() < deadline:
        status = client.runs.get(run["id"])
        if status["status"] in {"completed", "failed", "cancelled"}:
            break
        time.sleep(3)
    else:
        raise TimeoutError(f"Keep run ID {run['id']} and check it later")
    if status["status"] != "completed":
        raise RuntimeError(f"Run ended with status {status['status']}")
    page = client.runs.results(run["id"], {"page": 1, "limit": 20})
    for result in page["results"]:
        if not result["error_message"]:
            print(client.runs.get_result_content(run["id"], result["id"], {"type": "markdown"}))
```

`runs.results` returns one page. Use `page`, `limit`, and `total` for pagination. Source document and change endpoints use `nextOffset`. Screenshots have separate methods: `get_result_screenshot` returns a temporary signed URL; `download_result_screenshot` returns `bytes`.

## Supported operations

Both clients support the same methods:

- `search`, `map`, `crawl`, `deep_crawl`, `extract`
- `index.search`
- `index.sources`: `analyze`, `get_analysis`, `list`, `search`, `create`, `get`, `update`, `delete`, `status`, `recrawl`, `documents`, `changes`, `subscription_status`, `subscribe`, `github_connections`, `analyze_github`, `saved_github_analysis`, `create_github`
- `index.collections`: `list`, `create`, `get`, `update`, `delete`, `rules`, `update_rules`, `add_source`, `remove_source`
- `runs`: `list`, `create`, `get`, `delete`, `cancel`, `retry`, `results`, `get_result_content`, `get_result_screenshot`, `download_result_screenshot`

`map`, `crawl`, `deep_crawl`, and `extract` fill in the run `type`. Generic `runs.create` requires it. `remove_source` removes all include/exclude rules for that source, matching the TypeScript helper.

## Errors and configuration

```python
import os
from bulkgrid import BulkgridAPIError, BulkgridClient, BulkgridTimeoutError

with BulkgridClient(api_key=os.environ["BULKGRID_API_KEY"], timeout=30.0) as client:
    try:
        client.index.search({"query": "pricing"})
    except BulkgridAPIError as error:
        print(error.status_code, error.request_id, error.retry_after)
        # error.data contains the API's structured error or text response.
    except BulkgridTimeoutError:
        print("Request timed out")
```

The default network timeout is 60 seconds; it is not a run-completion deadline. `BulkgridConnectionError` represents other network failures; `BulkgridResponseError` represents invalid JSON responses. Requests do not retry automatically. A timed-out write may already have started work: preserve known IDs and inspect status before retrying. HTTP redirects are not followed, preventing API-key forwarding to redirected hosts.

`base_url` defaults to `https://bulkgrid.com`. HTTPS origins are required, except HTTP loopback origins for local development. A custom `httpx.BaseTransport` / `httpx.AsyncBaseTransport` can be supplied with `transport` for testing. Keep keys in server-side environment variables.

## Development and releases

```bash
python -m pip install -e 'packages/sdk-python[dev]'
python packages/sdk-python/scripts/generate.py --check
python -m pytest packages/sdk-python/tests
python -m mypy --config-file packages/sdk-python/pyproject.toml packages/sdk-python/src/bulkgrid
python -m ruff check packages/sdk-python
python -m build packages/sdk-python
```

The generator reads the committed public OpenAPI specification. Regenerate after contract changes; CI rejects stale output. The package contains no private platform dependencies.

This public repository validates the Python SDK through `.github/workflows/check-python-sdk.yml`. Package publication is a separate release decision; no Python publishing workflow is installed here. Update `src/bulkgrid/_version.py` and the changelog as part of a release. Nothing is published by installing or testing locally.

The SDK is currently proprietary, consistent with the repository's UNLICENSED packages.

## Website maps

```python
run = client.map({"url": "https://example.com", "config": {"limit": 100}})
status = client.runs.get(run["id"])
# Poll until status is completed, failed, or cancelled.
# Completed maps contain discovered URLs in status["result_data"]["links"].
```

`AsyncBulkgridClient` also exposes `await client.map(...)`. Map runs use the same
cancellation, retry, and deletion methods as crawl runs. They discover URLs without
fetching page content or using cached crawl data.
