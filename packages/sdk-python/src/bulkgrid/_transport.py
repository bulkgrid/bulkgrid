"""Shared transport behavior. Requests are never automatically retried."""

from __future__ import annotations

from collections.abc import Mapping
from types import TracebackType
from typing import Literal
from urllib.parse import quote, urlsplit

import httpx

from ._version import __version__


class BulkgridError(Exception):
    """Base SDK error."""


class BulkgridAPIError(BulkgridError):
    """Non-success HTTP response; structured API details are available in data."""

    def __init__(self, response: httpx.Response) -> None:
        self.status_code = response.status_code
        self.request_id = response.headers.get("x-request-id")
        self.retry_after = response.headers.get("retry-after")
        try:
            self.data: object = response.json()
        except ValueError:
            self.data = response.text
        # Do not include request headers, API keys, or arbitrary response bodies in logs.
        super().__init__(f"Bulkgrid API returned HTTP {self.status_code}")


class BulkgridConnectionError(BulkgridError):
    """The request could not be completed. A write may have reached the server."""


class BulkgridTimeoutError(BulkgridConnectionError):
    """The configured network timeout expired."""


class BulkgridResponseError(BulkgridError):
    """The server returned an invalid JSON response."""


Mode = Literal["json", "text", "bytes"]


def path_id(value: str) -> str:
    if not value or value in {".", ".."}:
        raise ValueError("Resource IDs must be nonempty path segments")
    return quote(value, safe="")


def prepare_query(query: Mapping[str, object] | None) -> dict[str, str]:
    return {
        key: str(value).lower() if isinstance(value, bool) else str(value)
        for key, value in (query or {}).items()
        if value is not None
    }


def decode(response: httpx.Response, mode: Mode) -> object:
    if not response.is_success:
        raise BulkgridAPIError(response)
    if mode == "text":
        return response.text
    if mode == "bytes":
        return response.content
    try:
        data: object = response.json()
    except ValueError as error:
        raise BulkgridResponseError("Expected a JSON response") from error
    if not isinstance(data, dict):
        raise BulkgridResponseError("Expected a JSON object response")
    return data


def configuration(api_key: str, base_url: str) -> tuple[str, dict[str, str]]:
    if not api_key.strip():
        raise ValueError("api_key is required")
    url = urlsplit(base_url)
    if (
        not url.hostname
        or url.username
        or url.password
        or url.query
        or url.fragment
        or url.path not in {"", "/"}
    ):
        raise ValueError("base_url must be an origin without credentials, path, query, or fragment")
    if url.scheme != "https" and not (
        url.scheme == "http" and url.hostname in {"localhost", "127.0.0.1", "::1"}
    ):
        raise ValueError("Remote Bulkgrid deployments require HTTPS")
    return base_url.rstrip("/"), {
        "x-api-key": api_key,
        "user-agent": f"bulkgrid-python/{__version__}",
        "accept": "application/json",
    }


class SyncTransport:
    def __init__(
        self,
        *,
        api_key: str,
        base_url: str = "https://bulkgrid.com",
        timeout: float = 60.0,
        transport: httpx.BaseTransport | None = None,
    ) -> None:
        base_url, headers = configuration(api_key, base_url)
        if timeout <= 0:
            raise ValueError("timeout must be positive")
        self._http = httpx.Client(
            base_url=base_url, headers=headers, timeout=timeout, transport=transport, follow_redirects=False
        )

    def _request(
        self,
        method: str,
        path: str,
        *,
        body: object = None,
        query: Mapping[str, object] | None = None,
        mode: Mode = "json",
    ) -> object:
        try:
            response = self._http.request(method, path, json=body, params=prepare_query(query))
        except httpx.TimeoutException as error:
            raise BulkgridTimeoutError("Bulkgrid request timed out") from error
        except httpx.RequestError as error:
            raise BulkgridConnectionError("Bulkgrid request could not be completed") from error
        return decode(response, mode)

    def close(self) -> None:
        self._http.close()

    def __enter__(self) -> SyncTransport:
        return self

    def __exit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, traceback: TracebackType | None
    ) -> None:
        self.close()


class AsyncTransport:
    def __init__(
        self,
        *,
        api_key: str,
        base_url: str = "https://bulkgrid.com",
        timeout: float = 60.0,
        transport: httpx.AsyncBaseTransport | None = None,
    ) -> None:
        base_url, headers = configuration(api_key, base_url)
        if timeout <= 0:
            raise ValueError("timeout must be positive")
        self._http = httpx.AsyncClient(
            base_url=base_url, headers=headers, timeout=timeout, transport=transport, follow_redirects=False
        )

    async def _request(
        self,
        method: str,
        path: str,
        *,
        body: object = None,
        query: Mapping[str, object] | None = None,
        mode: Mode = "json",
    ) -> object:
        try:
            response = await self._http.request(method, path, json=body, params=prepare_query(query))
        except httpx.TimeoutException as error:
            raise BulkgridTimeoutError("Bulkgrid request timed out") from error
        except httpx.RequestError as error:
            raise BulkgridConnectionError("Bulkgrid request could not be completed") from error
        return decode(response, mode)

    async def aclose(self) -> None:
        await self._http.aclose()

    async def __aenter__(self) -> AsyncTransport:
        return self

    async def __aexit__(
        self, exc_type: type[BaseException] | None, exc: BaseException | None, traceback: TracebackType | None
    ) -> None:
        await self.aclose()
