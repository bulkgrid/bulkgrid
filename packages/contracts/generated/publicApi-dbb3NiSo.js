import { A as githubSourceAnalyzeRequestSchema, Dt as extractRunInputSchema, I as createSourceSchema, J as updateSourceSchema, Mt as retryRunBodySchema, St as deepCrawlRunInputSchema, Y as imageSearchDataSchema, Z as newsSearchDataSchema, _ as collectionRulesPatchSchema, et as searchResultDataSchema, ft as crawlRunInputSchema, h as updateChatConversationInputSchema, i as chatInputSchema, j as githubSourceCreateRequestSchema, k as githubSourceAnalysisResultSchema, kt as mapRunInputSchema, l as createChatConversationInputSchema, nt as webSearchDataSchema, pt as crawlRunInputUnionSchema, q as sourceDiscoveryAnalysisCreateSchema, rt as webSearchInputSchema, st as searchInputSchema, v as createCollectionSchema, w as githubConnectionSchema, yt as crawlRunStatusSchema } from "./schemas-OBRM1M4L.js";
import { z } from "zod";
//#region packages/api-contract/src/resourceSchemas.ts
const sourceSchema = z.looseObject({
	crawl_config: z.unknown().nullable(),
	crawl_interval: z.enum([
		"hourly",
		"daily",
		"weekly",
		"monthly",
		"custom"
	]).nullable(),
	created_at: z.string(),
	created_by_user_id: z.string().nullable(),
	created_by_workspace_id: z.string().nullable(),
	custom_interval_minutes: z.number().nullable(),
	icon_url: z.string().nullable(),
	id: z.string(),
	identifier: z.string(),
	integration_type: z.enum([
		"web",
		"upload",
		"github"
	]),
	is_active: z.boolean().nullable(),
	label: z.string().nullable(),
	last_crawled_at: z.string().nullable(),
	max_depth: z.number().nullable(),
	max_items: z.number().nullable(),
	metadata: z.unknown().nullable(),
	next_crawl_at: z.string().nullable(),
	public_source_id: z.string().nullable(),
	source_mode: z.enum(["discover", "selected_pages"]),
	total_items_found: z.number().nullable(),
	type: z.enum([
		"domain",
		"document",
		"repository"
	]),
	updated_at: z.string(),
	visibility: z.enum(["public", "private"]),
	workspace_id: z.string().nullable()
});
const collectionSchema = z.looseObject({
	created_at: z.string(),
	created_by_user_id: z.string().nullable(),
	description: z.string().nullable(),
	id: z.string(),
	metadata: z.unknown().nullable(),
	name: z.string(),
	updated_at: z.string(),
	workspace_id: z.string()
});
const sourceListItemSchema = sourceSchema.extend({
	totalItems: z.number(),
	latestRunStatus: z.string().nullable(),
	latestRunCreatedAt: z.string().nullable(),
	latestResultIcon: z.string().nullable()
});
const sourceSearchResultSchema = sourceSchema.pick({
	id: true,
	identifier: true,
	type: true,
	integration_type: true,
	label: true,
	icon_url: true,
	visibility: true,
	updated_at: true
}).extend({
	totalItems: z.number(),
	isSubscribed: z.boolean(),
	isOwned: z.boolean(),
	displayIdentifier: z.string(),
	displayTotalItems: z.number()
});
const sourceDetailSchema = sourceSchema.extend({ description: z.string().nullable().optional() });
const sourceStatusSchema = z.object({
	isCrawling: z.boolean(),
	latestStatus: z.string().nullable(),
	latestError: z.string().nullable(),
	totalSize: z.number(),
	totalItems: z.number(),
	indexedItems: z.number()
});
const collectionListItemSchema = collectionSchema.extend({
	sourceCount: z.number(),
	pageCount: z.number()
});
const updateCollectionRequestSchema = z.object({
	name: z.string().trim().min(1).optional(),
	description: z.string().nullable().optional()
}).refine((value) => value.name !== void 0 || value.description !== void 0, "Provide a name or description");
const collectionRuleResponseSchema = z.looseObject({
	action: z.enum(["include", "exclude"]),
	target: z.enum([
		"source",
		"folder",
		"url"
	]),
	source_id: z.string(),
	target_id: z.string(),
	metadata: z.unknown().optional()
});
const collectionRulesResponseSchema = z.object({
	rules: z.array(collectionRuleResponseSchema),
	counts: z.object({
		sources: z.number(),
		folders: z.number(),
		urls_selected: z.number(),
		urls_excluded: z.number(),
		urls_effective: z.number()
	}).nullable(),
	countsBySource: z.record(z.string(), z.number())
});
//#endregion
//#region packages/api-contract/src/publicApi.ts
const jsonValueSchema = z.lazy(() => z.union([
	z.null(),
	z.boolean(),
	z.number(),
	z.string(),
	z.array(jsonValueSchema),
	z.record(z.string(), jsonValueSchema)
]));
const apiErrorResponseSchema = z.object({
	error: z.string(),
	details: z.unknown().optional()
});
const sdkSuccessResponseSchema = z.object({ success: z.literal(true) });
const crawlRunTypeSchema = z.enum([
	"crawl",
	"deep_crawl",
	"extract",
	"source_sync",
	"map",
	"search"
]);
const crawlRunSchema = z.object({
	indexed_pages: z.number().int().optional(),
	indexing_done: z.number().int().optional(),
	indexing_failed: z.number().int().optional(),
	indexing_failed_pages: z.number().int().optional(),
	indexing_in_progress: z.number().int().optional(),
	indexing_queued: z.number().int().optional(),
	deletion_requested_at: z.string().nullable().optional(),
	id: z.uuid(),
	completed_at: z.string().nullable(),
	config: jsonValueSchema,
	result_data: jsonValueSchema.nullable().optional(),
	search: searchResultDataSchema.optional(),
	created_at: z.string(),
	credential_id: z.uuid().nullable(),
	done: z.number().int(),
	error_code: z.string().nullable(),
	error_count: z.number().int().nullable(),
	error_details: jsonValueSchema.nullable(),
	extraction_query: z.string().nullable(),
	extraction_schema: jsonValueSchema.nullable(),
	failed: z.number().int(),
	in_progress: z.number().int(),
	inline_credentials: jsonValueSchema.nullable(),
	indexing_completed_at: z.string().nullable(),
	indexing_started_at: z.string().nullable(),
	indexing_time_ms: z.number().int().nullable(),
	last_error: z.string().nullable(),
	last_error_at: z.string().nullable(),
	last_heartbeat: z.string().nullable(),
	max_retries: z.number().int().nullable(),
	message_ids: z.array(z.string()),
	metadata: jsonValueSchema.nullable(),
	needs_dispatch: z.boolean(),
	priority: z.number().int().nullable(),
	processing_time_ms: z.number().int().nullable(),
	query: z.string().nullable(),
	queued: z.number().int(),
	requested_by_user_id: z.uuid().nullable(),
	retry_count: z.number().int().nullable(),
	started_at: z.string().nullable(),
	status: crawlRunStatusSchema,
	workspace_id: z.uuid(),
	type: crawlRunTypeSchema,
	updated_at: z.string(),
	urls: z.array(z.string().url())
});
const crawlRunStatisticsSchema = z.object({
	total_results: z.number().int().nonnegative(),
	success_count: z.number().int().nonnegative(),
	error_count: z.number().int().nonnegative(),
	total_size: z.number().nonnegative(),
	average_response_time: z.number().nonnegative()
});
const crawlResultSchema = z.object({
	clean_html_size: z.number().int().nullable(),
	clean_html_url: z.string().nullable(),
	content_hash: z.string().nullable(),
	conversion_completed_at: z.string().nullable(),
	conversion_error: z.string().nullable(),
	conversion_started_at: z.string().nullable(),
	conversion_status: z.string().nullable(),
	conversion_time_ms: z.number().int().nullable(),
	crawled_at: z.string().nullable(),
	created_at: z.string(),
	error_message: z.string().nullable(),
	extract_completed_at: z.string().nullable(),
	extract_started_at: z.string().nullable(),
	extract_time_ms: z.number().int().nullable(),
	extraction_data: jsonValueSchema.nullable(),
	extraction_usage: jsonValueSchema.nullable(),
	file_checksum: z.string().nullable(),
	file_mime_type: z.string().nullable(),
	file_path: z.string().nullable(),
	file_size: z.number().int().nullable(),
	final_url: z.string().nullable(),
	formats_requested: z.array(z.string()).nullable(),
	icon: z.string().nullable(),
	icon_size: z.number().int().nullable(),
	id: z.uuid(),
	images: jsonValueSchema.nullable(),
	indexing_completed_at: z.string().nullable(),
	indexing_started_at: z.string().nullable(),
	indexing_time_ms: z.number().int().nullable(),
	run_id: z.uuid(),
	links: jsonValueSchema.nullable(),
	markdown_size: z.number().int().nullable(),
	markdown_url: z.string().nullable(),
	metadata: jsonValueSchema.nullable(),
	raw_html_size: z.number().int().nullable(),
	raw_html_url: z.string().nullable(),
	response_time_ms: z.number().int().nullable(),
	screenshot: z.string().nullable(),
	screenshot_format: z.string().nullable(),
	screenshot_height: z.number().int().nullable(),
	screenshot_width: z.number().int().nullable(),
	status_code: z.number().int().nullable(),
	workspace_id: z.uuid(),
	title: z.string().nullable(),
	url: z.string().url()
});
const indexSearchResultSchema = z.object({
	chunk_id: z.uuid(),
	source_document_id: z.uuid(),
	source_id: z.uuid(),
	url: z.string().url(),
	title: z.string().nullable(),
	chunk_index: z.number().int(),
	text_content: z.string().nullable(),
	metadata: z.unknown(),
	fts_rank: z.number().nullable(),
	semantic_rank: z.number().nullable(),
	score: z.number().nullable()
});
const indexSearchResponseSchema = z.object({
	query: z.string(),
	queryMode: z.enum(["none", "auto"]),
	executedQueries: z.array(z.string()),
	scoring: z.object({
		fullTextWeight: z.number(),
		semanticWeight: z.number(),
		rrfK: z.number().int()
	}),
	results: z.array(indexSearchResultSchema),
	count: z.number().int().nonnegative()
});
const searchRunReferenceSchema = crawlRunSchema.pick({
	id: true,
	status: true
});
const webSearchResponseSchema = webSearchDataSchema.extend({ run: searchRunReferenceSchema }).meta({ title: "WebSearchResponse" });
const imageSearchResponseSchema = imageSearchDataSchema.extend({ run: searchRunReferenceSchema }).meta({ title: "ImageSearchResponse" });
const newsSearchResponseSchema = newsSearchDataSchema.extend({ run: searchRunReferenceSchema }).meta({ title: "NewsSearchResponse" });
const searchResponseSchema = z.discriminatedUnion("type", [
	webSearchResponseSchema,
	imageSearchResponseSchema,
	newsSearchResponseSchema
]);
const chatCitationSchema = z.object({
	chunk_id: z.uuid(),
	source_document_id: z.uuid(),
	source_id: z.uuid(),
	url: z.string().url(),
	title: z.string().nullable(),
	snippet: z.string(),
	score: z.number().nullable()
});
const chatResponseSchema = z.object({
	query: z.string(),
	answer: z.string(),
	insufficientEvidence: z.boolean(),
	citations: z.array(chatCitationSchema)
});
const chatConversationSchema = z.object({
	id: z.uuid(),
	title: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string()
});
const chatConversationMessageSchema = z.object({
	id: z.uuid(),
	conversation_id: z.uuid(),
	role: z.enum([
		"user",
		"assistant",
		"system"
	]),
	content: z.string(),
	model: z.string().nullable(),
	prompt_tokens: z.number().int().nullable(),
	completion_tokens: z.number().int().nullable(),
	total_tokens: z.number().int().nullable(),
	created_at: z.string()
});
const chatConversationCitationSchema = z.object({
	id: z.uuid(),
	message_id: z.uuid(),
	citation_index: z.number().int().positive(),
	chunk_id: z.uuid().nullable(),
	source_document_id: z.uuid().nullable(),
	source_id: z.uuid().nullable(),
	url: z.string().nullable(),
	title: z.string().nullable(),
	quote: z.string().nullable(),
	score: z.number().nullable(),
	created_at: z.string()
});
const chatConversationsListResponseSchema = z.object({
	conversations: z.array(chatConversationSchema),
	limit: z.number().int().positive(),
	total: z.number().int().nonnegative()
});
const chatConversationDetailResponseSchema = z.object({
	conversation: chatConversationSchema,
	messages: z.array(chatConversationMessageSchema),
	citations: z.array(chatConversationCitationSchema),
	limit: z.number().int().positive(),
	hasMore: z.boolean(),
	nextCursor: z.string().nullable()
});
const updateChatConversationResponseSchema = z.object({ conversation: chatConversationSchema });
const listRunsQuerySchema = z.object({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	orderBy: z.string().optional(),
	status: crawlRunStatusSchema.optional(),
	type: z.union([crawlRunTypeSchema, z.literal("crawl")]).optional()
});
const listRunsResponseSchema = z.object({
	runs: z.array(crawlRunSchema),
	page: z.number().int().positive(),
	limit: z.number().int().positive(),
	total: z.number().int().nonnegative()
});
const getRunQuerySchema = z.object({ includeResults: z.boolean().optional() });
const getRunResponseSchema = crawlRunSchema.extend({
	statistics: crawlRunStatisticsSchema,
	crawl_results: z.array(crawlResultSchema).optional(),
	source: z.object({
		id: z.uuid(),
		icon_url: z.string().nullable(),
		integration_type: z.enum([
			"web",
			"upload",
			"github"
		])
	}).nullable()
});
const incrementalPageQuerySchema = z.object({
	incremental: z.literal("true").optional().describe("Return only missing or dirty rows, plus ordered page IDs."),
	known: z.array(z.uuid()).max(100).optional().describe("Row IDs already held by the client."),
	dirty: z.array(z.uuid()).max(100).optional().describe("Row IDs requiring fresh data.")
});
const listRunResultsQuerySchema = incrementalPageQuerySchema.extend({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional()
});
const listRunResultsResponseSchema = z.object({
	results: z.array(crawlResultSchema),
	ids: z.array(z.uuid()).max(100).optional().describe("Ordered IDs of the complete page, present in incremental responses."),
	statistics: crawlRunStatisticsSchema.optional(),
	page: z.number().int().positive(),
	limit: z.number().int().positive(),
	total: z.number().int().nonnegative()
});
const screenshotResponseSchema = z.object({ signedUrl: z.string().url() });
const resultContentTypeSchema = z.enum([
	"markdown",
	"cleanHtml",
	"rawHtml",
	"links"
]);
const sourceDocumentSchema = z.looseObject({
	id: z.string(),
	source_id: z.string(),
	url: z.string(),
	title: z.string().nullable(),
	status_code: z.number().nullable(),
	is_active: z.boolean().nullable(),
	indexing_status: z.string().nullable(),
	indexing_error: z.string().nullable(),
	last_crawled_at: z.string().nullable(),
	latest_content_hash: z.string().nullable(),
	latest_version: z.number().nullable(),
	change_count: z.number().nullable(),
	last_changed_at: z.string().nullable(),
	latest_crawl_result_id: z.string().nullable(),
	last_indexed_crawl_result_id: z.string().nullable(),
	crawl_result: crawlResultSchema.partial().extend({
		run_id: z.string().nullable().optional(),
		workspace_id: z.string().nullable().optional()
	}).loose().nullable(),
	last_indexed_crawl_result: z.object({
		id: z.string(),
		indexing_completed_at: z.string().nullable(),
		indexing_time_ms: z.number().nullable()
	}).nullable()
});
const sourceDocumentsPageSchema = z.object({
	documents: z.array(sourceDocumentSchema),
	total: z.number(),
	nextOffset: z.number().nullable(),
	limit: z.number()
});
const sourceAnalysisResponseSchema = z.object({
	url: z.string(),
	urlCount: z.number(),
	paths: z.array(z.object({
		path: z.string(),
		depth: z.number(),
		count: z.number(),
		parent: z.string().nullable(),
		name: z.string()
	})),
	levelSummaries: z.array(z.object({
		parent: z.string(),
		total: z.number(),
		shown: z.number()
	})),
	warning: z.object({
		type: z.literal("sitemap_incomplete"),
		message: z.string()
	}).nullable()
}).extend({
	id: z.uuid(),
	runId: z.uuid().nullable(),
	sourceId: z.uuid().nullable(),
	status: z.enum([
		"crawling",
		"analyzing",
		"completed",
		"partial",
		"failed"
	]),
	urlCount: z.number().nullable(),
	scopeUrls: z.array(z.string()),
	error: z.string().nullable(),
	analyzedAt: z.string().nullable()
});
const apiContract = {
	index: {
		sources: {
			analyze: {
				method: "POST",
				path: "/api/v1/index/sources/discover/analyses",
				requestSchema: sourceDiscoveryAnalysisCreateSchema,
				responseSchema: sourceAnalysisResponseSchema
			},
			analysis: {
				method: "GET",
				path: "/api/v1/index/sources/discover/analyses/{analysisId}",
				responseSchema: sourceAnalysisResponseSchema
			},
			documents: {
				method: "GET",
				path: "/api/v1/index/sources/{sourceId}/documents",
				querySchema: z.object({
					parent: z.string().optional(),
					offset: z.number().int().nonnegative().optional(),
					limit: z.number().int().min(1).max(100).optional()
				}),
				responseSchema: sourceDocumentsPageSchema.extend({ parent: z.string() })
			},
			changes: {
				method: "GET",
				path: "/api/v1/index/sources/{sourceId}/changes",
				querySchema: z.object({
					runId: z.string(),
					kind: z.enum([
						"added",
						"changed",
						"removed"
					]).optional(),
					offset: z.number().int().nonnegative().optional(),
					limit: z.number().int().min(1).max(500).optional()
				}),
				responseSchema: sourceDocumentsPageSchema
			},
			list: {
				method: "GET",
				path: "/api/v1/index/sources",
				querySchema: z.object({ search: z.string().optional() }),
				responseSchema: z.object({ sources: z.array(sourceListItemSchema) })
			},
			search: {
				method: "GET",
				path: "/api/v1/index/sources/search",
				querySchema: z.object({ query: z.string() }),
				responseSchema: z.object({ sources: z.array(sourceSearchResultSchema) })
			},
			create: {
				method: "POST",
				path: "/api/v1/index/sources",
				requestSchema: createSourceSchema,
				responseSchema: z.object({
					source: sourceSchema,
					created: z.boolean()
				})
			},
			get: {
				method: "GET",
				path: "/api/v1/index/sources/{sourceId}",
				responseSchema: z.object({ source: sourceDetailSchema })
			},
			update: {
				method: "PATCH",
				path: "/api/v1/index/sources/{sourceId}",
				requestSchema: updateSourceSchema,
				responseSchema: z.object({
					source: sourceSchema,
					run: crawlRunSchema.nullable().optional(),
					dispatchDeferred: z.boolean().optional()
				})
			},
			delete: {
				method: "DELETE",
				path: "/api/v1/index/sources/{sourceId}",
				responseSchema: sdkSuccessResponseSchema
			},
			status: {
				method: "GET",
				path: "/api/v1/index/sources/{sourceId}/status",
				responseSchema: sourceStatusSchema
			},
			subscriptionStatus: {
				method: "GET",
				path: "/api/v1/index/sources/{sourceId}/subscribe",
				querySchema: z.object({ workspaceId: z.uuid().optional() }),
				responseSchema: z.object({ subscribed: z.boolean() })
			},
			subscribe: {
				method: "POST",
				path: "/api/v1/index/sources/{sourceId}/subscribe",
				querySchema: z.object({ workspaceId: z.uuid().optional() }),
				responseSchema: z.object({
					source: sourceSchema,
					created: z.boolean()
				})
			},
			githubConnections: {
				method: "GET",
				path: "/api/v1/integrations/github/connections",
				responseSchema: z.object({ connections: z.array(githubConnectionSchema) })
			},
			analyzeGithub: {
				method: "POST",
				path: "/api/v1/index/sources/github/analyze",
				requestSchema: githubSourceAnalyzeRequestSchema,
				responseSchema: githubSourceAnalysisResultSchema
			},
			savedGithubAnalysis: {
				method: "GET",
				path: "/api/v1/index/sources/github/analyze",
				querySchema: githubSourceAnalyzeRequestSchema.omit({ suggestPaths: true }),
				responseSchema: z.object({
					analysis: githubSourceAnalysisResultSchema.nullable(),
					analyzedAt: z.string().nullable()
				})
			},
			createGithub: {
				method: "POST",
				path: "/api/v1/index/sources/github",
				requestSchema: githubSourceCreateRequestSchema,
				responseSchema: z.object({
					source: sourceSchema,
					run: crawlRunSchema.nullable(),
					dispatchDeferred: z.boolean(),
					created: z.boolean().optional()
				})
			},
			recrawl: {
				method: "POST",
				path: "/api/v1/index/sources/{sourceId}/recrawl",
				responseSchema: z.object({
					source: sourceSchema,
					run: crawlRunSchema,
					dispatchDeferred: z.boolean().optional(),
					previewRunId: z.string().nullable().optional()
				})
			}
		},
		collections: {
			list: {
				method: "GET",
				path: "/api/v1/index/collections",
				responseSchema: z.object({ collections: z.array(collectionListItemSchema) })
			},
			create: {
				method: "POST",
				path: "/api/v1/index/collections",
				requestSchema: createCollectionSchema,
				responseSchema: z.object({ collection: collectionSchema })
			},
			get: {
				method: "GET",
				path: "/api/v1/index/collections/{collectionId}",
				responseSchema: z.object({ collection: collectionSchema })
			},
			update: {
				method: "PATCH",
				path: "/api/v1/index/collections/{collectionId}",
				requestSchema: updateCollectionRequestSchema,
				responseSchema: z.object({ collection: collectionSchema })
			},
			delete: {
				method: "DELETE",
				path: "/api/v1/index/collections/{collectionId}",
				responseSchema: sdkSuccessResponseSchema
			},
			rules: {
				method: "GET",
				path: "/api/v1/index/collections/{collectionId}/rules",
				responseSchema: collectionRulesResponseSchema
			},
			updateRules: {
				method: "PATCH",
				path: "/api/v1/index/collections/{collectionId}/rules",
				requestSchema: collectionRulesPatchSchema,
				responseSchema: collectionRulesResponseSchema
			}
		},
		search: {
			method: "POST",
			path: "/api/v1/index/search",
			requestSchema: searchInputSchema,
			responseSchema: indexSearchResponseSchema
		},
		chat: {
			query: {
				method: "POST",
				path: "/api/v1/index/chat",
				requestSchema: chatInputSchema,
				responseSchema: chatResponseSchema
			},
			conversations: {
				create: {
					method: "POST",
					path: "/api/v1/index/chat/conversations",
					requestSchema: createChatConversationInputSchema,
					responseSchema: chatConversationSchema
				},
				list: {
					method: "GET",
					path: "/api/v1/index/chat/conversations",
					responseSchema: chatConversationsListResponseSchema
				},
				get: {
					method: "GET",
					path: "/api/v1/index/chat/conversations/{conversationId}",
					responseSchema: chatConversationDetailResponseSchema
				},
				delete: {
					method: "DELETE",
					path: "/api/v1/index/chat/conversations/{conversationId}",
					responseSchema: sdkSuccessResponseSchema
				},
				update: {
					method: "PATCH",
					path: "/api/v1/index/chat/conversations/{conversationId}",
					requestSchema: updateChatConversationInputSchema,
					responseSchema: updateChatConversationResponseSchema
				}
			}
		}
	},
	extract: {
		method: "POST",
		path: "/api/v1/extract",
		requestSchema: extractRunInputSchema,
		responseSchema: crawlRunSchema
	},
	search: {
		method: "POST",
		path: "/api/v1/search",
		requestSchema: webSearchInputSchema,
		responseSchema: searchResponseSchema
	},
	crawl: {
		method: "POST",
		path: "/api/v1/crawl",
		requestSchema: crawlRunInputSchema,
		responseSchema: crawlRunSchema
	},
	map: {
		method: "POST",
		path: "/api/v1/map",
		requestSchema: mapRunInputSchema,
		responseSchema: crawlRunSchema
	},
	deepCrawl: {
		method: "POST",
		path: "/api/v1/deep-crawl",
		requestSchema: deepCrawlRunInputSchema,
		responseSchema: crawlRunSchema
	},
	runs: {
		list: {
			method: "GET",
			path: "/api/v1/runs",
			querySchema: listRunsQuerySchema,
			responseSchema: listRunsResponseSchema
		},
		create: {
			method: "POST",
			path: "/api/v1/runs",
			requestSchema: crawlRunInputUnionSchema,
			responseSchema: crawlRunSchema
		},
		get: {
			method: "GET",
			path: "/api/v1/runs/{runId}",
			querySchema: getRunQuerySchema,
			responseSchema: getRunResponseSchema
		},
		cancel: {
			method: "POST",
			path: "/api/v1/runs/{runId}/cancel",
			responseSchema: sdkSuccessResponseSchema
		},
		retry: {
			method: "POST",
			path: "/api/v1/runs/{runId}/retry",
			requestSchema: retryRunBodySchema,
			responseSchema: crawlRunSchema
		},
		delete: {
			method: "DELETE",
			path: "/api/v1/runs/{runId}",
			responseSchema: sdkSuccessResponseSchema
		},
		results: {
			method: "GET",
			path: "/api/v1/runs/{runId}/results",
			querySchema: listRunResultsQuerySchema,
			responseSchema: listRunResultsResponseSchema
		},
		resultContent: {
			method: "GET",
			path: "/api/v1/runs/{runId}/results/{resultId}/content",
			querySchema: z.object({
				type: resultContentTypeSchema.optional(),
				download: z.boolean().optional()
			})
		},
		resultScreenshot: {
			method: "GET",
			path: "/api/v1/runs/{runId}/results/{resultId}/screenshot",
			querySchema: z.object({ download: z.boolean().optional() }),
			responseSchema: screenshotResponseSchema
		}
	}
};
//#endregion
export { sourceDocumentSchema as A, sourceSearchResultSchema as B, listRunsResponseSchema as C, sdkSuccessResponseSchema as D, screenshotResponseSchema as E, collectionRulesResponseSchema as F, updateCollectionRequestSchema as H, collectionSchema as I, sourceDetailSchema as L, webSearchResponseSchema as M, collectionListItemSchema as N, searchResponseSchema as O, collectionRuleResponseSchema as P, sourceListItemSchema as R, listRunsQuerySchema as S, resultContentTypeSchema as T, sourceStatusSchema as V, incrementalPageQuerySchema as _, chatConversationDetailResponseSchema as a, listRunResultsQuerySchema as b, chatConversationsListResponseSchema as c, crawlRunSchema as d, crawlRunStatisticsSchema as f, imageSearchResponseSchema as g, getRunResponseSchema as h, chatConversationCitationSchema as i, updateChatConversationResponseSchema as j, sourceAnalysisResponseSchema as k, chatResponseSchema as l, getRunQuerySchema as m, apiErrorResponseSchema as n, chatConversationMessageSchema as o, crawlRunTypeSchema as p, chatCitationSchema as r, chatConversationSchema as s, apiContract as t, crawlResultSchema as u, indexSearchResponseSchema as v, newsSearchResponseSchema as w, listRunResultsResponseSchema as x, indexSearchResultSchema as y, sourceSchema as z };
