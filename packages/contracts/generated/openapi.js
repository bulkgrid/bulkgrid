import { n as apiErrorResponseSchema, t as apiContract } from "./publicApi-CED13KN2.js";
import { z } from "zod";
//#region packages/api-contract/src/openapi.ts
const DEFAULT_JSON_CONTENT_TYPE = "application/json";
const errorSchema = z.toJSONSchema(apiErrorResponseSchema, {
	target: "openapi-3.0",
	io: "output"
});
const endpointMetadata = /* @__PURE__ */ new Map([
	[apiContract.search, {
		operationId: "search",
		summary: "Search indexed content",
		tag: "Search"
	}],
	[apiContract.extract, {
		operationId: "createExtractRun",
		summary: "Create an extract run",
		tag: "Runs"
	}],
	[apiContract.crawl, {
		operationId: "createCrawlRun",
		summary: "Create a crawl run",
		tag: "Runs"
	}],
	[apiContract.deepCrawl, {
		operationId: "createDeepCrawlRun",
		summary: "Create a deep crawl run",
		tag: "Runs"
	}],
	[apiContract.runs.list, {
		operationId: "listRuns",
		summary: "List runs",
		tag: "Runs"
	}],
	[apiContract.runs.create, {
		operationId: "createRun",
		summary: "Create a run",
		tag: "Runs"
	}],
	[apiContract.runs.get, {
		operationId: "getRun",
		summary: "Get a run",
		tag: "Runs"
	}],
	[apiContract.runs.cancel, {
		operationId: "cancelRun",
		summary: "Cancel a run",
		tag: "Runs"
	}],
	[apiContract.runs.retry, {
		operationId: "retryRun",
		summary: "Retry a run",
		tag: "Runs",
		successStatus: "201"
	}],
	[apiContract.runs.delete, {
		operationId: "deleteRun",
		summary: "Delete a run",
		tag: "Runs",
		successStatus: "202"
	}],
	[apiContract.runs.results, {
		operationId: "listRunResults",
		summary: "List run results",
		tag: "Results"
	}],
	[apiContract.runs.resultContent, {
		operationId: "getRunResultContent",
		summary: "Get run result content",
		tag: "Results",
		responseContent: {
			"text/markdown": { schema: { type: "string" } },
			"text/html": { schema: { type: "string" } },
			"text/plain": { schema: { type: "string" } }
		}
	}],
	[apiContract.runs.resultScreenshot, {
		operationId: "getRunResultScreenshot",
		summary: "Get run result screenshot",
		tag: "Results",
		responseContent: {
			[DEFAULT_JSON_CONTENT_TYPE]: { schema: z.toJSONSchema(apiContract.runs.resultScreenshot.responseSchema, {
				target: "openapi-3.0",
				io: "output"
			}) },
			"image/png": { schema: {
				type: "string",
				format: "binary"
			} },
			"image/jpeg": { schema: {
				type: "string",
				format: "binary"
			} }
		}
	}]
]);
const endpointScopes = /* @__PURE__ */ new Map([
	[apiContract.search, "search:query"],
	[apiContract.extract, "extract:write"],
	[apiContract.crawl, "runs:write"],
	[apiContract.deepCrawl, "runs:write"],
	[apiContract.runs.list, "runs:read"],
	[apiContract.runs.create, "runs:write"],
	[apiContract.runs.get, "runs:read"],
	[apiContract.runs.cancel, "runs:cancel"],
	[apiContract.runs.retry, "runs:retry"],
	[apiContract.runs.delete, "runs:delete"],
	[apiContract.runs.results, "results:read"],
	[apiContract.runs.resultContent, "results:read"],
	[apiContract.runs.resultScreenshot, "results:read"]
]);
const resourceEndpoints = [
	{
		endpoint: apiContract.sources.list,
		metadata: {
			operationId: "sourcesList",
			summary: "List subscribed and owned sources",
			tag: "Sources"
		},
		scope: "sources:read"
	},
	{
		endpoint: apiContract.sources.search,
		metadata: {
			operationId: "sourcesSearch",
			summary: "Find public and owned sources",
			tag: "Sources"
		},
		scope: "sources:read"
	},
	{
		endpoint: apiContract.sources.create,
		metadata: {
			operationId: "sourcesCreate",
			summary: "Create or subscribe to a source",
			tag: "Sources"
		},
		scope: "sources:write"
	},
	{
		endpoint: apiContract.sources.get,
		metadata: {
			operationId: "sourcesGet",
			summary: "Get a source",
			tag: "Sources"
		},
		scope: "sources:read"
	},
	{
		endpoint: apiContract.sources.update,
		metadata: {
			operationId: "sourcesUpdate",
			summary: "Update a source",
			tag: "Sources"
		},
		scope: "sources:write"
	},
	{
		endpoint: apiContract.sources.delete,
		metadata: {
			operationId: "sourcesDelete",
			summary: "Delete a source or remove its subscription",
			tag: "Sources"
		},
		scope: "sources:write"
	},
	{
		endpoint: apiContract.sources.status,
		metadata: {
			operationId: "sourcesStatus",
			summary: "Get source indexing status",
			tag: "Sources"
		},
		scope: "sources:read"
	},
	{
		endpoint: apiContract.sources.documents,
		metadata: {
			operationId: "sourcesDocuments",
			summary: "List source documents",
			tag: "Sources"
		},
		scope: "sources:read"
	},
	{
		endpoint: apiContract.sources.changes,
		metadata: {
			operationId: "sourcesChanges",
			summary: "List source changes for a run",
			tag: "Sources"
		},
		scope: "sources:read"
	},
	{
		endpoint: apiContract.sources.createGithub,
		metadata: {
			operationId: "sourcesCreateGithub",
			summary: "Create a GitHub source",
			tag: "Sources",
			successStatus: "202"
		},
		scope: "sources:write"
	},
	{
		endpoint: apiContract.sources.recrawl,
		metadata: {
			operationId: "sourcesRecrawl",
			additionalSuccessStatuses: ["202"],
			summary: "Refresh a source",
			tag: "Sources"
		},
		scope: "sources:write and runs:write"
	},
	{
		endpoint: apiContract.collections.list,
		metadata: {
			operationId: "collectionsList",
			summary: "List accessible collections",
			tag: "Collections"
		},
		scope: "collections:read"
	},
	{
		endpoint: apiContract.collections.create,
		metadata: {
			operationId: "collectionsCreate",
			summary: "Create a collection",
			tag: "Collections"
		},
		scope: "collections:write"
	},
	{
		endpoint: apiContract.collections.get,
		metadata: {
			operationId: "collectionsGet",
			summary: "Get a collection",
			tag: "Collections"
		},
		scope: "collections:read"
	},
	{
		endpoint: apiContract.collections.update,
		metadata: {
			operationId: "collectionsUpdate",
			summary: "Update a collection",
			tag: "Collections"
		},
		scope: "collections:write"
	},
	{
		endpoint: apiContract.collections.delete,
		metadata: {
			operationId: "collectionsDelete",
			summary: "Delete a collection",
			tag: "Collections"
		},
		scope: "collections:write"
	},
	{
		endpoint: apiContract.collections.rules,
		metadata: {
			operationId: "collectionsRules",
			summary: "Get collection rules",
			tag: "Collections"
		},
		scope: "collections:read"
	},
	{
		endpoint: apiContract.collections.updateRules,
		metadata: {
			operationId: "collectionsUpdateRules",
			summary: "Update collection rules",
			tag: "Collections"
		},
		scope: "collections:write"
	}
];
for (const { endpoint, metadata, scope } of resourceEndpoints) {
	endpointMetadata.set(endpoint, metadata);
	endpointScopes.set(endpoint, scope);
}
const publicEndpoints = [
	...resourceEndpoints.map(({ endpoint }) => endpoint),
	apiContract.search,
	apiContract.extract,
	apiContract.crawl,
	apiContract.deepCrawl,
	apiContract.runs.list,
	apiContract.runs.create,
	apiContract.runs.get,
	apiContract.runs.cancel,
	apiContract.runs.retry,
	apiContract.runs.delete,
	apiContract.runs.results,
	apiContract.runs.resultContent,
	apiContract.runs.resultScreenshot
];
function getPathParameterNames(path) {
	return [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1] ?? "");
}
function createSchemaConverter(components) {
	let schemaIndex = 0;
	return (schema, io) => {
		const { definitions = {}, ...root } = z.toJSONSchema(schema, {
			target: "openapi-3.0",
			io,
			unrepresentable: "any"
		});
		const prefix = `Schema${schemaIndex++}`;
		const rewriteReferences = (value) => JSON.parse(JSON.stringify(value, (key, child) => {
			if (key === "$ref" && typeof child === "string" && child.startsWith("#/definitions/")) return child.replace("#/definitions/", `#/components/schemas/${prefix}_`);
			return child;
		}));
		for (const [name, definition] of Object.entries(definitions)) components[`${prefix}_${name}`] = rewriteReferences(definition);
		return rewriteReferences(root);
	};
}
function buildParameters(endpoint, toOpenApiSchema) {
	const pathParameters = getPathParameterNames(endpoint.path).map((parameterName) => ({
		name: parameterName,
		in: "path",
		required: true,
		schema: { type: "string" }
	}));
	if (!endpoint.querySchema) return pathParameters;
	const querySchema = toOpenApiSchema(endpoint.querySchema, "input");
	const properties = "properties" in querySchema && querySchema.properties && typeof querySchema.properties === "object" ? querySchema.properties : {};
	const required = "required" in querySchema && Array.isArray(querySchema.required) ? new Set(querySchema.required) : /* @__PURE__ */ new Set();
	const queryParameters = Object.entries(properties).map(([name, propertySchema]) => ({
		name,
		in: "query",
		required: required.has(name),
		schema: propertySchema
	}));
	return [...pathParameters, ...queryParameters];
}
function buildRequestBody(endpoint, metadata, toOpenApiSchema) {
	if (!endpoint.requestSchema) return;
	return {
		required: true,
		content: { [metadata.requestContentType ?? DEFAULT_JSON_CONTENT_TYPE]: { schema: toOpenApiSchema(endpoint.requestSchema, "input") } }
	};
}
function buildSuccessResponse(endpoint, metadata, toOpenApiSchema) {
	const content = metadata.responseContent ? Object.fromEntries(Object.entries(metadata.responseContent).map(([contentType, value]) => [contentType, value.schema ? { schema: value.schema } : {}])) : endpoint.responseSchema ? { [DEFAULT_JSON_CONTENT_TYPE]: { schema: toOpenApiSchema(endpoint.responseSchema, "output") } } : void 0;
	return {
		description: "Successful response",
		...content ? { content } : {}
	};
}
function buildErrorResponses() {
	return {
		"400": {
			description: "Bad request",
			content: { [DEFAULT_JSON_CONTENT_TYPE]: { schema: errorSchema } }
		},
		"401": {
			description: "Unauthorized",
			content: { [DEFAULT_JSON_CONTENT_TYPE]: { schema: errorSchema } }
		},
		"403": {
			description: "Forbidden",
			content: { [DEFAULT_JSON_CONTENT_TYPE]: { schema: errorSchema } }
		},
		"404": {
			description: "Not found",
			content: { [DEFAULT_JSON_CONTENT_TYPE]: { schema: errorSchema } }
		},
		"429": {
			description: "Rate limited",
			content: { [DEFAULT_JSON_CONTENT_TYPE]: { schema: errorSchema } }
		},
		"500": {
			description: "Internal server error",
			content: { [DEFAULT_JSON_CONTENT_TYPE]: { schema: errorSchema } }
		}
	};
}
function buildPathItem(endpoint, toOpenApiSchema) {
	const metadata = endpointMetadata.get(endpoint);
	if (!metadata) throw new Error(`Missing OpenAPI metadata for ${endpoint.method} ${endpoint.path}`);
	const method = endpoint.method.toLowerCase();
	const successStatus = metadata.successStatus ?? "200";
	return { [method]: {
		operationId: metadata.operationId,
		summary: metadata.summary,
		description: `Required permission: ${endpointScopes.get(endpoint) ?? "See Authentication"}.`,
		tags: [metadata.tag],
		parameters: buildParameters(endpoint, toOpenApiSchema),
		requestBody: buildRequestBody(endpoint, metadata, toOpenApiSchema),
		responses: {
			...Object.fromEntries([successStatus, ...metadata.additionalSuccessStatuses ?? []].map((status) => [status, buildSuccessResponse(endpoint, metadata, toOpenApiSchema)])),
			...buildErrorResponses()
		},
		security: [{ apiKeyAuth: [] }, { bearerAuth: [] }]
	} };
}
function createOpenApiDocument() {
	const schemas = {};
	const toOpenApiSchema = createSchemaConverter(schemas);
	return {
		openapi: "3.0.3",
		info: {
			title: "Bulkgrid API",
			version: "0.1.0",
			description: "Search indexed content, create crawl and extraction runs, and retrieve results. API keys require the scopes listed for each operation. OAuth connections grant MCP and search access only."
		},
		servers: [{
			url: "https://bulkgrid.com",
			description: "Bulkgrid"
		}],
		security: [{ apiKeyAuth: [] }, { bearerAuth: [] }],
		tags: [
			{
				name: "Sources",
				description: "Source discovery, subscriptions, and indexing"
			},
			{
				name: "Collections",
				description: "Collections and content selection rules"
			},
			{
				name: "Search",
				description: "Search endpoints"
			},
			{
				name: "Runs",
				description: "Run creation and lifecycle endpoints"
			},
			{
				name: "Results",
				description: "Run result retrieval endpoints"
			}
		],
		paths: publicEndpoints.reduce((result, endpoint) => {
			const existingPath = result[endpoint.path] ?? {};
			const nextPath = buildPathItem(endpoint, toOpenApiSchema);
			result[endpoint.path] = {
				...existingPath,
				...nextPath
			};
			return result;
		}, {}),
		components: {
			schemas,
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					description: "Bulkgrid API key or OAuth access token. OAuth grants currently allow search:query and mcp:use only."
				},
				apiKeyAuth: {
					type: "apiKey",
					in: "header",
					name: "x-api-key",
					description: "Bulkgrid API key"
				}
			}
		}
	};
}
//#endregion
export { createOpenApiDocument };
