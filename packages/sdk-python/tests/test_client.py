import asyncio
import json
from importlib.metadata import version

import httpx
import pytest

from bulkgrid import (
    AsyncBulkgridClient,
    BulkgridClient,
    BulkgridAPIError,
    BulkgridConnectionError,
    BulkgridResponseError,
    BulkgridTimeoutError,
    __version__,
)

# Independent wire-level oracle: each public method must call the intended endpoint.
CASES = [
    ("index.sources.subscribe", ["source"], "POST", "/index/sources/source/subscribe"),
    ("index.sources.github_connections", [], "GET", "/integrations/github/connections"),
    (
        "index.sources.analyze_github",
        [{"repositoryUrl": "https://github.com/org/private", "connection_id": "connection"}],
        "POST",
        "/index/sources/github/analyze",
    ),
    ("index.search", [{"query": "pricing"}], "POST", "/index/search"),
    ("search", [{"query": "pricing", "crawl": True}], "POST", "/search"),
    ("search", [{"query": "skyline", "type": "images", "crawl": True}], "POST", "/search"),
    ("search", [{"query": "transit", "type": "news", "crawl": True}], "POST", "/search"),
    ("crawl", [{"urls": ["https://example.com"]}], "POST", "/crawl"),
    ("extract", [{"urls": ["https://example.com"], "query": "company", "schema": {}}], "POST", "/extract"),
    ("map", [{"url": "https://example.com", "config": {"limit": 100}}], "POST", "/map"),
    ("deep_crawl", [{"url": "https://example.com"}], "POST", "/deep-crawl"),
    ("index.sources.analyze", [{"url": "https://example.com"}], "POST", "/index/sources/discover/analyses"),
    ("index.sources.get_analysis", ["analysis"], "GET", "/index/sources/discover/analyses/analysis"),
    ("index.sources.list", [], "GET", "/index/sources"),
    ("index.sources.search", [{"query": "docs"}], "GET", "/index/sources/search?query=docs"),
    (
        "index.sources.create",
        [{"type": "domain", "identifier": "https://example.com", "visibility": "public"}],
        "POST",
        "/index/sources",
    ),
    (
        "index.sources.create_github",
        [{"repositoryUrl": "https://github.com/example/repo"}],
        "POST",
        "/index/sources/github",
    ),
    ("index.sources.get", ["source"], "GET", "/index/sources/source"),
    ("index.sources.update", ["source", {"label": "Docs"}], "PATCH", "/index/sources/source"),
    ("index.sources.delete", ["source"], "DELETE", "/index/sources/source"),
    ("index.sources.status", ["source"], "GET", "/index/sources/source/status"),
    ("index.sources.recrawl", ["source"], "POST", "/index/sources/source/recrawl"),
    (
        "index.sources.documents",
        ["source", {"parent": "/docs", "offset": 0, "limit": 50}],
        "GET",
        "/index/sources/source/documents?parent=%2Fdocs&offset=0&limit=50",
    ),
    (
        "index.sources.changes",
        ["source", {"runId": "run", "kind": "changed"}],
        "GET",
        "/index/sources/source/changes?runId=run&kind=changed",
    ),
    ("index.collections.list", [], "GET", "/index/collections"),
    ("index.collections.create", [{"name": "Docs"}], "POST", "/index/collections"),
    ("index.collections.get", ["collection"], "GET", "/index/collections/collection"),
    ("index.collections.update", ["collection", {"name": "Docs"}], "PATCH", "/index/collections/collection"),
    ("index.collections.delete", ["collection"], "DELETE", "/index/collections/collection"),
    ("index.collections.rules", ["collection"], "GET", "/index/collections/collection/rules"),
    (
        "index.collections.update_rules",
        ["collection", {"add": []}],
        "PATCH",
        "/index/collections/collection/rules",
    ),
    ("runs.list", [{"page": 2, "limit": 20}], "GET", "/runs?page=2&limit=20"),
    ("runs.create", [{"type": "crawl", "urls": ["https://example.com"]}], "POST", "/runs"),
    ("runs.get", ["run", {"includeResults": False}], "GET", "/runs/run?includeResults=false"),
    ("runs.delete", ["run"], "DELETE", "/runs/run"),
    ("runs.cancel", ["run"], "POST", "/runs/run/cancel"),
    ("runs.retry", ["run"], "POST", "/runs/run/retry"),
    ("runs.results", ["run", {"page": 1, "limit": 20}], "GET", "/runs/run/results?page=1&limit=20"),
    (
        "runs.get_result_content",
        ["run", "result", {"type": "markdown"}],
        "GET",
        "/runs/run/results/result/content?type=markdown",
    ),
    ("runs.get_result_screenshot", ["run", "result"], "GET", "/runs/run/results/result/screenshot"),
    (
        "runs.download_result_screenshot",
        ["run", "result"],
        "GET",
        "/runs/run/results/result/screenshot?download=true",
    ),
]


def method(client, name):
    for part in name.split("."):
        client = getattr(client, part)
    return client


@pytest.mark.parametrize("asynchronous", [False, True])
@pytest.mark.parametrize("name,args,verb,path", CASES)
def test_endpoint_contract(asynchronous, name, args, verb, path):
    before = json.dumps(args)
    requests = []

    def handler(request):
        requests.append(request)
        assert request.method == verb
        assert str(request.url) == "https://bulkgrid.com/api/v1" + path
        assert request.headers["x-api-key"] == "test-key"
        assert request.headers["user-agent"] == f"bulkgrid-python/{__version__}"
        if name == "runs.get_result_content":
            return httpx.Response(200, text="# Hello")
        if name == "runs.download_result_screenshot":
            return httpx.Response(200, content=b"\x89PNG\x00")
        return httpx.Response(200, json={"ok": True})

    transport = httpx.MockTransport(handler)
    if asynchronous:

        async def run():
            async with AsyncBulkgridClient(api_key="test-key", transport=transport) as client:
                return await method(client, name)(*args)

        result = asyncio.run(run())
    else:
        with BulkgridClient(api_key="test-key", transport=transport) as client:
            result = method(client, name)(*args)
    assert len(requests) == 1
    assert result == (
        "# Hello"
        if name == "runs.get_result_content"
        else b"\x89PNG\x00"
        if name == "runs.download_result_screenshot"
        else {"ok": True}
    )
    assert before == json.dumps(args)
    request = requests[0]
    if name in {"crawl", "extract", "deep_crawl", "map"}:
        assert json.loads(request.content) == {**args[0], "type": name}
    elif name == "runs.retry":
        assert json.loads(request.content) == {}
    elif verb in {"POST", "PATCH"} and args and isinstance(args[-1], dict):
        assert json.loads(request.content) == args[-1]


@pytest.mark.parametrize("asynchronous", [False, True])
@pytest.mark.parametrize("status", [400, 401, 403, 429, 500, 302])
def test_errors_do_not_retry_or_follow_redirects(asynchronous, status):
    calls = []

    def handler(request):
        calls.append(request)
        return httpx.Response(
            status,
            json={"error": "Denied", "details": {"code": "LIMIT"}},
            headers={"retry-after": "5", "x-request-id": "request-1", "location": "https://other.example"},
        )

    async def run():
        async with AsyncBulkgridClient(api_key="secret", transport=httpx.MockTransport(handler)) as client:
            await client.index.sources.analyze({"url": "https://example.com"})

    with pytest.raises(BulkgridAPIError) as caught:
        if asynchronous:
            asyncio.run(run())
        else:
            with BulkgridClient(api_key="secret", transport=httpx.MockTransport(handler)) as client:
                client.index.sources.analyze({"url": "https://example.com"})
    assert len(calls) == 1
    assert caught.value.status_code == status
    assert caught.value.data["details"]["code"] == "LIMIT"
    assert caught.value.retry_after == "5"
    assert caught.value.request_id == "request-1"
    assert "secret" not in str(caught.value)


@pytest.mark.parametrize("asynchronous", [False, True])
@pytest.mark.parametrize(
    "failure,expected",
    [
        ("timeout", BulkgridTimeoutError),
        ("connect", BulkgridConnectionError),
        ("json", BulkgridResponseError),
        ("array", BulkgridResponseError),
    ],
)
def test_transport_and_response_errors(asynchronous, failure, expected):
    def handler(request):
        if failure == "timeout":
            raise httpx.ReadTimeout("timeout", request=request)
        if failure == "connect":
            raise httpx.ConnectError("offline", request=request)
        if failure == "array":
            return httpx.Response(200, json=[])
        return httpx.Response(200, text="bad json")

    async def run():
        async with AsyncBulkgridClient(api_key="key", transport=httpx.MockTransport(handler)) as client:
            await client.index.search({"query": "q"})

    with pytest.raises(expected):
        if asynchronous:
            asyncio.run(run())
        else:
            with BulkgridClient(api_key="key", transport=httpx.MockTransport(handler)) as client:
                client.index.search({"query": "q"})


def test_paths_queries_and_text_errors():
    def handler(request):
        assert request.url.raw_path == b"/api/v1/index/sources/id%2F%3F%23/status"
        return httpx.Response(502, text="Gateway unavailable")

    with BulkgridClient(api_key="key", transport=httpx.MockTransport(handler)) as client:
        with pytest.raises(BulkgridAPIError) as caught:
            client.index.sources.status("id/?#")
        assert caught.value.data == "Gateway unavailable"
        for invalid in ["", ".", ".."]:
            with pytest.raises(ValueError):
                client.index.sources.get(invalid)


@pytest.mark.parametrize(
    "url",
    [
        "http://example.com",
        "https://user:pass@example.com",
        "https://example.com/path",
        "https://example.com?key=x",
        "https://example.com#x",
        "file:///tmp",
    ],
)
def test_rejects_invalid_origins(url):
    with pytest.raises(ValueError):
        BulkgridClient(api_key="key", base_url=url)


def test_configuration_and_cleanup():
    with pytest.raises(ValueError):
        BulkgridClient(api_key="")
    with pytest.raises(ValueError):
        BulkgridClient(api_key="key", timeout=0)

    def handler(request):
        assert request.extensions["timeout"]["read"] == 12
        return httpx.Response(200, json={})

    with BulkgridClient(
        api_key="key", base_url="http://localhost:3000/", timeout=12, transport=httpx.MockTransport(handler)
    ) as client:
        client.index.search({"query": "q"})
    assert client._http.is_closed


def test_async_cancellation_and_cleanup():
    async def handler(request):
        raise asyncio.CancelledError()

    async def run():
        async with AsyncBulkgridClient(api_key="key", transport=httpx.MockTransport(handler)) as client:
            with pytest.raises(asyncio.CancelledError):
                await client.index.search({"query": "q"})
        assert client._http.is_closed

    asyncio.run(run())


@pytest.mark.parametrize("asynchronous", [False, True])
def test_collection_helpers_preserve_rule_identity(asynchronous):
    calls = []
    rules = [
        {"action": "include", "target": "source", "source_id": "source", "target_id": "source"},
        {"action": "exclude", "target": "folder", "source_id": "source", "target_id": "/private"},
        {"action": "include", "target": "source", "source_id": "other", "target_id": "other"},
    ]

    def handler(request):
        if request.method == "PATCH":
            calls.append(json.loads(request.content))
        return httpx.Response(200, json={"rules": rules})

    async def run():
        async with AsyncBulkgridClient(api_key="key", transport=httpx.MockTransport(handler)) as client:
            await client.index.collections.add_source("collection", "source")
            await client.index.collections.remove_source("collection", "source")

    if asynchronous:
        asyncio.run(run())
    else:
        with BulkgridClient(api_key="key", transport=httpx.MockTransport(handler)) as client:
            client.index.collections.add_source("collection", "source")
            client.index.collections.remove_source("collection", "source")
    assert calls == [{"add": [rules[0]]}, {"remove": rules[:2]}]


def test_version_matches_package():
    assert version("bulkgrid") == __version__


@pytest.mark.parametrize("client_class", [BulkgridClient, AsyncBulkgridClient])
def test_no_legacy_resource_aliases(client_class):
    client = client_class(api_key="test-key")
    try:
        for name in ["sources", "collections", "web_search"]:
            assert not hasattr(client, name)
        assert callable(client.index.search)
        assert callable(client.index.sources.list)
        assert callable(client.index.collections.list)
    finally:
        if isinstance(client, AsyncBulkgridClient):
            asyncio.run(client.aclose())
        else:
            client.close()
