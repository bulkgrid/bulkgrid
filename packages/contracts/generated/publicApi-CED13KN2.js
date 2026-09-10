import { $ as crawlRunInputSchema, G as updateSourceSchema, J as searchInputSchema, N as createSourceSchema, O as githubSourceCreateRequestSchema, _ as collectionRulesPatchSchema, et as crawlRunInputUnionSchema, gt as retryRunBodySchema, h as updateChatConversationInputSchema, i as chatInputSchema, l as createChatConversationInputSchema, lt as deepCrawlRunInputSchema, mt as extractRunInputSchema, ot as crawlRunStatusSchema, v as createCollectionSchema } from "./schemas-UkbzA2g_.js";
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
	"source_sync"
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
const searchResultSchema = z.object({
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
const searchResponseSchema = z.object({
	query: z.string(),
	queryMode: z.enum(["none", "auto"]),
	executedQueries: z.array(z.string()),
	scoring: z.object({
		fullTextWeight: z.number(),
		semanticWeight: z.number(),
		rrfK: z.number().int()
	}),
	results: z.array(searchResultSchema),
	count: z.number().int().nonnegative()
});
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
const listRunResultsQuerySchema = z.object({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional()
});
const listRunResultsResponseSchema = z.object({
	results: z.array(crawlResultSchema),
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
const apiContract = {
	sources: {
		documents: {
			method: "GET",
			path: "/api/v1/sources/{sourceId}/documents",
			querySchema: z.object({
				parent: z.string().optional(),
				offset: z.number().int().nonnegative().optional(),
				limit: z.number().int().min(1).max(100).optional()
			}),
			responseSchema: sourceDocumentsPageSchema.extend({ parent: z.string() })
		},
		changes: {
			method: "GET",
			path: "/api/v1/sources/{sourceId}/changes",
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
			path: "/api/v1/sources",
			querySchema: z.object({ search: z.string().optional() }),
			responseSchema: z.object({ sources: z.array(sourceListItemSchema) })
		},
		search: {
			method: "GET",
			path: "/api/v1/sources/search",
			querySchema: z.object({ query: z.string() }),
			responseSchema: z.object({ sources: z.array(sourceSearchResultSchema) })
		},
		create: {
			method: "POST",
			path: "/api/v1/sources",
			requestSchema: createSourceSchema,
			responseSchema: z.object({
				source: sourceSchema,
				created: z.boolean()
			})
		},
		get: {
			method: "GET",
			path: "/api/v1/sources/{sourceId}",
			responseSchema: z.object({ source: sourceDetailSchema })
		},
		update: {
			method: "PATCH",
			path: "/api/v1/sources/{sourceId}",
			requestSchema: updateSourceSchema,
			responseSchema: z.object({
				source: sourceSchema,
				run: crawlRunSchema.nullable().optional(),
				dispatchDeferred: z.boolean().optional()
			})
		},
		delete: {
			method: "DELETE",
			path: "/api/v1/sources/{sourceId}",
			responseSchema: sdkSuccessResponseSchema
		},
		status: {
			method: "GET",
			path: "/api/v1/sources/{sourceId}/status",
			responseSchema: sourceStatusSchema
		},
		createGithub: {
			method: "POST",
			path: "/api/v1/sources/github",
			requestSchema: githubSourceCreateRequestSchema,
			responseSchema: z.object({
				source: sourceSchema,
				run: crawlRunSchema,
				dispatchDeferred: z.boolean()
			})
		},
		recrawl: {
			method: "POST",
			path: "/api/v1/sources/{sourceId}/recrawl",
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
			path: "/api/v1/collections",
			responseSchema: z.object({ collections: z.array(collectionListItemSchema) })
		},
		create: {
			method: "POST",
			path: "/api/v1/collections",
			requestSchema: createCollectionSchema,
			responseSchema: z.object({ collection: collectionSchema })
		},
		get: {
			method: "GET",
			path: "/api/v1/collections/{collectionId}",
			responseSchema: z.object({ collection: collectionSchema })
		},
		update: {
			method: "PATCH",
			path: "/api/v1/collections/{collectionId}",
			requestSchema: updateCollectionRequestSchema,
			responseSchema: z.object({ collection: collectionSchema })
		},
		delete: {
			method: "DELETE",
			path: "/api/v1/collections/{collectionId}",
			responseSchema: sdkSuccessResponseSchema
		},
		rules: {
			method: "GET",
			path: "/api/v1/collections/{collectionId}/rules",
			responseSchema: collectionRulesResponseSchema
		},
		updateRules: {
			method: "PATCH",
			path: "/api/v1/collections/{collectionId}/rules",
			requestSchema: collectionRulesPatchSchema,
			responseSchema: collectionRulesResponseSchema
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
		requestSchema: searchInputSchema,
		responseSchema: searchResponseSchema
	},
	chat: {
		query: {
			method: "POST",
			path: "/api/v1/chat",
			requestSchema: chatInputSchema,
			responseSchema: chatResponseSchema
		},
		conversations: {
			create: {
				method: "POST",
				path: "/api/v1/chat/conversations",
				requestSchema: createChatConversationInputSchema,
				responseSchema: chatConversationSchema
			},
			list: {
				method: "GET",
				path: "/api/v1/chat/conversations",
				responseSchema: chatConversationsListResponseSchema
			},
			get: {
				method: "GET",
				path: "/api/v1/chat/conversations/{conversationId}",
				responseSchema: chatConversationDetailResponseSchema
			},
			delete: {
				method: "DELETE",
				path: "/api/v1/chat/conversations/{conversationId}",
				responseSchema: sdkSuccessResponseSchema
			},
			update: {
				method: "PATCH",
				path: "/api/v1/chat/conversations/{conversationId}",
				requestSchema: updateChatConversationInputSchema,
				responseSchema: updateChatConversationResponseSchema
			}
		}
	},
	crawl: {
		method: "POST",
		path: "/api/v1/crawl",
		requestSchema: crawlRunInputSchema,
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
export { collectionSchema as A, searchResponseSchema as C, collectionListItemSchema as D, updateChatConversationResponseSchema as E, sourceStatusSchema as F, updateCollectionRequestSchema as I, sourceListItemSchema as M, sourceSchema as N, collectionRuleResponseSchema as O, sourceSearchResultSchema as P, sdkSuccessResponseSchema as S, sourceDocumentSchema as T, listRunResultsResponseSchema as _, chatConversationDetailResponseSchema as a, resultContentTypeSchema as b, chatConversationsListResponseSchema as c, crawlRunSchema as d, crawlRunStatisticsSchema as f, listRunResultsQuerySchema as g, getRunResponseSchema as h, chatConversationCitationSchema as i, sourceDetailSchema as j, collectionRulesResponseSchema as k, chatResponseSchema as l, getRunQuerySchema as m, apiErrorResponseSchema as n, chatConversationMessageSchema as o, crawlRunTypeSchema as p, chatCitationSchema as r, chatConversationSchema as s, apiContract as t, crawlResultSchema as u, listRunsQuerySchema as v, searchResultSchema as w, screenshotResponseSchema as x, listRunsResponseSchema as y };
