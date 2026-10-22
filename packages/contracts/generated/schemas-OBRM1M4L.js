import { z } from "zod";
//#region packages/types/dist/index.js
let CrawlRunType = /* @__PURE__ */ function(CrawlRunType) {
	CrawlRunType["CRAWL"] = "crawl";
	CrawlRunType["DEEP_CRAWL"] = "deep_crawl";
	CrawlRunType["EXTRACT"] = "extract";
	CrawlRunType["SOURCE_SYNC"] = "source_sync";
	CrawlRunType["MAP"] = "map";
	CrawlRunType["SEARCH"] = "search";
	return CrawlRunType;
}({});
//#endregion
//#region packages/schemas/src/map.ts
const mapUrlSchema = z.url().refine((value) => {
	const url = new URL(value);
	return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
}, "Expected an HTTP(S) URL without credentials");
const mapOptionsSchema = z.strictObject({
	search: z.string().trim().min(1).max(500).optional(),
	includeSubdomains: z.boolean().default(true),
	ignoreQueryParameters: z.boolean().default(true),
	limit: z.number().int().min(1).max(1e5).default(5e3),
	timeout: z.number().int().min(1e3).max(15e4).default(6e4)
});
const mapLinkSchema = z.object({
	url: mapUrlSchema,
	title: z.string().optional(),
	description: z.string().optional()
});
const mapResultSchema = z.object({
	success: z.literal(true),
	links: z.array(mapLinkSchema),
	warnings: z.array(z.string()).optional()
});
//#endregion
//#region packages/schemas/src/crawlRuns.ts
const crawlRunFormatSchema = z.enum([
	"markdown",
	"cleanHtml",
	"rawHtml",
	"links"
]);
const crawlRunStatusSchema = z.enum([
	"pending",
	"processing",
	"completed",
	"failed",
	"cancelled"
]);
const crawlRunStrategySchema = z.enum(["lexical", "embedding"]);
const crawlRunScreenshotSchema = z.enum(["screenshot", "fullPageScreenshot"]);
const crawlRunOptionsSchema = z.object({
	formats: z.array(crawlRunFormatSchema).optional().default(["markdown", "cleanHtml"]),
	includeTags: z.array(z.string()).optional(),
	excludeTags: z.array(z.string()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	waitAfterLoad: z.number().min(0).max(3e4).optional().default(0),
	timeout: z.number().min(1e3).max(6e4).optional().default(3e4),
	blockAds: z.boolean().default(true),
	useInteractions: z.boolean().optional().default(false),
	waitForSelector: z.string().optional(),
	waitForImages: z.boolean().optional().default(false),
	removeConsentPopups: z.boolean().optional(),
	screenshot: crawlRunScreenshotSchema.optional(),
	useHttp: z.boolean().optional(),
	useLlmsTxt: z.boolean().optional(),
	includeDocumentLinks: z.boolean().optional().default(false)
});
const smartCrawlConfigSchema = z.object({
	maxDepth: z.number().min(1).default(3),
	maxPages: z.number().min(1).default(50),
	topKLinks: z.number().min(1).default(10),
	minGainThreshold: z.number().min(0).max(1).default(.1),
	confidenceThreshold: z.number().min(0).max(1).default(.8)
});
const deepCrawlConfigSchema = z.object({
	maxDepth: z.number().min(1).optional(),
	includeExternal: z.boolean().optional().default(false),
	includeDocumentLinks: z.boolean().optional().default(false),
	scoreThreshold: z.number().optional().default(0),
	normalizeScores: z.boolean().optional().default(true),
	maxPages: z.number().min(1).optional(),
	seedUrls: z.array(z.url()).optional(),
	includePaths: z.array(z.string()).optional(),
	excludePaths: z.array(z.string()).optional(),
	restrictToStartPath: z.boolean().optional().default(false)
});
const crawlRunRequestSchema = z.object({
	type: z.literal(CrawlRunType.CRAWL),
	runId: z.string(),
	urls: z.array(z.url()),
	strategy: crawlRunStrategySchema.optional(),
	config: smartCrawlConfigSchema.optional(),
	options: crawlRunOptionsSchema.optional()
});
const extractRunRequestSchema = z.object({
	type: z.literal(CrawlRunType.EXTRACT),
	runId: z.string(),
	urls: z.array(z.url()).min(1, "Provide at least one URL").describe("List of URLs to extract data from"),
	query: z.string().min(1, "Query is required").describe("Extraction query used to guide the extraction"),
	schema: z.record(z.string(), z.any()).describe("JSON schema defining the structure of data to extract"),
	maxRetries: z.number().min(1).max(5).default(3).optional().describe("Maximum retry attempts for each URL")
});
const deepCrawlRunRequestSchema = z.object({
	type: z.literal(CrawlRunType.DEEP_CRAWL),
	runId: z.string(),
	url: z.url(),
	config: deepCrawlConfigSchema.optional(),
	options: crawlRunOptionsSchema.optional()
});
const deepCrawlTaskTypeSchema = z.enum(["seed", "crawl"]);
const deepCrawlTaskRequestSchema = z.object({
	taskType: deepCrawlTaskTypeSchema,
	payload: deepCrawlRunRequestSchema
});
const cancelRunRequestSchema = z.object({
	type: z.literal("cancel"),
	runId: z.string()
});
const retryRunBodySchema = z.object({ urls: z.array(z.url()).optional() });
const mapRunRequestSchema = z.object({
	type: z.literal(CrawlRunType.MAP),
	runId: z.string(),
	url: mapUrlSchema,
	config: mapOptionsSchema.default(() => mapOptionsSchema.parse({}))
});
const crawlRunRequestUnionSchema = z.discriminatedUnion("type", [
	crawlRunRequestSchema,
	extractRunRequestSchema,
	deepCrawlRunRequestSchema,
	cancelRunRequestSchema,
	mapRunRequestSchema
]);
const extractResultSchema = z.object({
	data: z.record(z.string(), z.any()).describe("The extracted data matching the provided schema"),
	sources_used: z.array(z.string()).describe("URLs that were successfully scraped for information"),
	actions_taken: z.array(z.array(z.record(z.string(), z.any()))).describe("Browser actions performed during extraction"),
	confidence: z.number().min(0).max(1).describe("Overall confidence in the extraction results"),
	extraction_steps: z.array(z.string()).describe("Step-by-step reasoning and actions taken")
});
const runResultSchema = z.object({
	runId: z.string(),
	status: z.enum(["completed", "failed"]),
	result: z.unknown().optional(),
	error: z.object({
		message: z.string(),
		code: z.string(),
		stack: z.string().optional()
	}).optional(),
	completedAt: z.string(),
	processingTime: z.number()
});
const crawlRunStatusQuerySchema = z.object({ runId: z.string() });
const crawlRunInputSchema = crawlRunRequestSchema.omit({ runId: true });
const extractRunInputSchema = z.object({
	type: z.literal(CrawlRunType.EXTRACT),
	urls: z.array(z.url()).min(1, "Provide at least one URL").describe("List of URLs to extract data from"),
	query: z.string().min(1, "Query is required").describe("Extraction query used to guide the extraction"),
	schema: z.record(z.string(), z.any()).describe("JSON schema defining the structure of data to extract"),
	maxRetries: z.number().min(1).max(5).default(3).optional().describe("Maximum retry attempts for each URL")
});
const deepCrawlRunInputSchema = deepCrawlRunRequestSchema.omit({ runId: true });
const mapRunInputSchema = mapRunRequestSchema.omit({ runId: true });
const crawlRunInputUnionSchema = z.discriminatedUnion("type", [
	crawlRunInputSchema,
	extractRunInputSchema,
	deepCrawlRunInputSchema,
	mapRunInputSchema
]);
/** Read both legacy nested and current flat persisted deep-crawl configuration. */
function readDeepCrawlConfig(value) {
	const { options, config, ...flat } = value && typeof value === "object" && !Array.isArray(value) ? value : {};
	return {
		config: config && typeof config === "object" && !Array.isArray(config) ? config : flat,
		options
	};
}
//#endregion
//#region packages/schemas/src/search.ts
const hybridSearchDefaultConfig = {
	results: {
		default: 10,
		min: 1,
		max: 50
	},
	rrfK: {
		default: 60,
		min: 1,
		max: 1e3
	},
	semanticWeight: {
		default: .7,
		min: 0,
		max: 1
	},
	fullTextWeight: {
		default: .3,
		min: 0,
		max: 1
	},
	queryVariants: { max: 3 }
};
const searchQueryModeSchema = z.enum(["none", "auto"]);
const hasValidSearchWeights = (data) => data.fullTextWeight > 0 || data.semanticWeight > 0;
const searchInputSchemaBase = z.object({
	query: z.string().trim().min(1, "Search query is required"),
	queries: z.array(z.string().trim().min(1, "Search query variant cannot be empty")).max(hybridSearchDefaultConfig.queryVariants.max).optional(),
	queryMode: searchQueryModeSchema.optional().default("none").describe("Run one hybrid search by default. Opt into auto for one additional compact query variant."),
	limit: z.number().int().min(hybridSearchDefaultConfig.results.min).max(hybridSearchDefaultConfig.results.max).optional().default(hybridSearchDefaultConfig.results.default),
	collectionId: z.uuid().optional(),
	sourceIds: z.array(z.uuid()).min(1).max(50).optional().describe("Restrict results to these source IDs within the existing workspace and collection permissions."),
	fullTextWeight: z.number().min(hybridSearchDefaultConfig.fullTextWeight.min).max(hybridSearchDefaultConfig.fullTextWeight.max).optional().default(hybridSearchDefaultConfig.fullTextWeight.default),
	semanticWeight: z.number().min(hybridSearchDefaultConfig.semanticWeight.min).max(hybridSearchDefaultConfig.semanticWeight.max).optional().default(hybridSearchDefaultConfig.semanticWeight.default),
	rrfK: z.number().int().min(hybridSearchDefaultConfig.rrfK.min).max(hybridSearchDefaultConfig.rrfK.max).optional().default(hybridSearchDefaultConfig.rrfK.default)
}).strict();
const searchInputSchema = searchInputSchemaBase.refine(hasValidSearchWeights, { message: "fullTextWeight and semanticWeight cannot both be zero" });
const { rrfK, ...searchMcpToolDefaultConfig } = hybridSearchDefaultConfig;
const mcpSearchInputSchema = searchInputSchemaBase.omit({ rrfK: true }).refine(hasValidSearchWeights, { message: "fullTextWeight and semanticWeight cannot both be zero" });
//#endregion
//#region packages/schemas/src/webSearch.ts
const webSearchCrawlOptionsSchema = crawlRunOptionsSchema.omit({
	headers: true,
	includeDocumentLinks: true
}).strict();
const webSearchInputSchema = z.strictObject({
	query: z.string().trim().min(1).max(500),
	type: z.enum([
		"web",
		"images",
		"news"
	]).default("web"),
	limit: z.number().int().min(1).max(10).default(10),
	country: z.string().regex(/^[a-z]{2}$/).default("us"),
	language: z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/).default("en"),
	location: z.string().trim().min(1).max(200).optional(),
	crawl: z.boolean().default(false),
	crawlOptions: webSearchCrawlOptionsSchema.optional()
}).refine((input) => input.crawl || input.crawlOptions === void 0, {
	message: "Set crawl to true when providing crawlOptions",
	path: ["crawlOptions"]
});
const webSearchResultSchema = z.object({
	url: z.url().refine((value) => {
		try {
			const url = new URL(value);
			return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
		} catch {
			return false;
		}
	}, "Expected an HTTP(S) URL without credentials"),
	title: z.string(),
	snippet: z.string(),
	position: z.number().int().positive()
});
const imageSearchResultSchema = z.object({
	title: z.string(),
	url: webSearchResultSchema.shape.url,
	imageUrl: webSearchResultSchema.shape.url,
	imageWidth: z.number().int().positive().nullable(),
	imageHeight: z.number().int().positive().nullable(),
	thumbnailUrl: webSearchResultSchema.shape.url.nullable(),
	position: z.number().int().positive()
});
const newsSearchResultSchema = webSearchResultSchema.extend({
	source: z.string().nullable(),
	date: z.string().nullable(),
	imageUrl: webSearchResultSchema.shape.url.nullable()
});
const searchResultDataBaseSchema = z.object({
	query: z.string(),
	count: z.number().int().nonnegative(),
	warnings: z.array(z.string()).optional()
});
const webSearchDataSchema = searchResultDataBaseSchema.extend({
	type: z.literal("web"),
	results: z.array(webSearchResultSchema)
}).meta({ title: "WebSearchData" });
const imageSearchDataSchema = searchResultDataBaseSchema.extend({
	type: z.literal("images"),
	results: z.array(imageSearchResultSchema)
}).meta({ title: "ImageSearchData" });
const newsSearchDataSchema = searchResultDataBaseSchema.extend({
	type: z.literal("news"),
	results: z.array(newsSearchResultSchema)
}).meta({ title: "NewsSearchData" });
const searchResultDataSchema = z.discriminatedUnion("type", [
	webSearchDataSchema,
	imageSearchDataSchema,
	newsSearchDataSchema
]);
function searchCrawlOptions(request) {
	return crawlRunOptionsSchema.parse({
		formats: ["markdown", "cleanHtml"],
		waitAfterLoad: 100,
		removeConsentPopups: false,
		...request.crawlOptions,
		useLlmsTxt: request.crawlOptions?.useLlmsTxt ?? false,
		includeDocumentLinks: false
	});
}
//#endregion
//#region packages/schemas/src/sources.ts
const sourceCanonicalUrlSchema = z.string().trim().pipe(z.url()).refine((value) => {
	try {
		const url = new URL(value);
		return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password && !url.search && !url.hash;
	} catch {
		return false;
	}
}, "Enter an HTTP or HTTPS website URL without credentials, query parameters, or fragments.").transform((value) => {
	const url = new URL(value);
	return `${url.origin}${url.pathname.replace(/\/+$/, "")}`;
});
const sourceMetadataSchema = z.record(z.string(), z.json());
const sourceCrawlOptionsSchema = z.object({
	waitAfterLoad: z.number().min(0).max(3e4).optional(),
	timeout: z.number().min(1e3).max(6e4).optional(),
	includeTags: z.array(z.string()).optional(),
	excludeTags: z.array(z.string()).optional(),
	useHttp: z.boolean().optional(),
	useLlmsTxt: z.boolean().optional(),
	removeConsentPopups: z.boolean().optional(),
	includeDocumentLinks: z.boolean().optional()
});
const sourceDeepCrawlConfigSchema = z.object({
	maxDepth: z.number().min(1).optional(),
	maxPages: z.number().min(1).optional(),
	includePaths: z.array(z.string()).optional(),
	excludePaths: z.array(z.string()).optional(),
	selectedUrls: z.array(z.url()).optional(),
	crawlOptions: sourceCrawlOptionsSchema.optional()
});
const sourceDiscoverRequestSchema = z.object({
	url: z.string().min(1),
	requestId: z.string().optional(),
	includePaths: z.array(z.string()).optional(),
	excludePaths: z.array(z.string()).optional()
});
const sourceDiscoveryAnalysisCreateSchema = z.object({
	url: z.string().min(1),
	sourceId: z.uuid().optional()
});
const sourceDiscoverRecommendationSchema = z.object({
	path: z.string().min(1),
	recommendedAction: z.enum([
		"include",
		"exclude",
		"neutral"
	]),
	confidence: z.number().min(0).max(1),
	reason: z.string().min(1)
});
const sourceDiscoverRecommendRequestSchema = sourceDiscoverRequestSchema.extend({
	prompt: z.string().min(1),
	analysisId: z.uuid().optional()
});
const sourceDiscoverRecommendResponseSchema = z.object({
	recommendations: z.array(sourceDiscoverRecommendationSchema),
	notes: z.string().nullable().optional()
});
const createSourceSchema = z.object({
	workspace_id: z.uuid().optional(),
	type: z.literal("domain"),
	identifier: z.string(),
	label: z.string().optional(),
	visibility: z.enum(["public", "private"]).optional(),
	source_mode: z.enum(["discover", "selected_pages"]).optional(),
	crawl_config: sourceDeepCrawlConfigSchema.optional(),
	metadata: sourceMetadataSchema.optional(),
	crawl_interval: z.enum([
		"hourly",
		"daily",
		"weekly",
		"monthly",
		"custom"
	]).optional(),
	custom_interval_minutes: z.number().optional(),
	analysis_id: z.uuid().optional()
}).superRefine((value, context) => {
	if (value.crawl_interval === "custom" && !value.custom_interval_minutes) context.addIssue({
		code: "custom",
		message: "custom_interval_minutes is required when crawl_interval is custom",
		path: ["custom_interval_minutes"]
	});
});
const updateSourceSchema = z.object({
	label: z.string().trim().min(1).max(200).nullable().optional(),
	canonical_url: sourceCanonicalUrlSchema.nullable().optional(),
	metadata: sourceMetadataSchema.optional(),
	source_mode: z.enum(["discover", "selected_pages"]).optional(),
	crawl_interval: z.enum([
		"hourly",
		"daily",
		"weekly",
		"monthly",
		"custom"
	]).nullable().optional(),
	custom_interval_minutes: z.number().int().min(5).nullable().optional(),
	crawl_config: z.object({
		includePaths: z.array(z.string()).optional(),
		excludePaths: z.array(z.string()).optional(),
		selectedRef: z.string().trim().min(1).max(255).nullable().optional(),
		selectedUrls: z.array(z.string().url()).optional(),
		crawlOptions: sourceCrawlOptionsSchema.optional()
	}).optional()
}).superRefine((value, context) => {
	if (value.crawl_interval === "custom" && !value.custom_interval_minutes) context.addIssue({
		code: "custom",
		message: "custom_interval_minutes is required when crawl_interval is custom",
		path: ["custom_interval_minutes"]
	});
});
const sourceDeepCrawlRequestSchema = deepCrawlRunInputSchema.extend({ config: sourceDeepCrawlConfigSchema.optional() }).extend({
	runType: z.literal(CrawlRunType.DEEP_CRAWL),
	sourceId: z.uuid(),
	crawlType: z.enum([
		"initial",
		"manual",
		"scheduled"
	]).optional()
});
const sourceCrawlRequestSchema = crawlRunInputSchema.extend({
	runType: z.literal(CrawlRunType.CRAWL),
	sourceId: z.uuid(),
	crawlType: z.enum([
		"initial",
		"manual",
		"scheduled"
	]).optional()
});
const sourceCrawlRequestUnionSchema = z.discriminatedUnion("runType", [sourceDeepCrawlRequestSchema, sourceCrawlRequestSchema]);
//#endregion
//#region packages/schemas/src/github.ts
const githubOwnerOrRepo = z.string().trim().min(1).max(100).regex(/^[A-Za-z0-9_.-]+$/);
const githubRepositorySchema = z.object({
	owner: githubOwnerOrRepo,
	repo: githubOwnerOrRepo
});
const githubRepositoryMetadataSchema = z.object({
	id: z.number().int().positive(),
	owner: githubOwnerOrRepo,
	name: githubOwnerOrRepo,
	fullName: z.string().trim().min(3).max(201),
	defaultBranch: z.string().trim().min(1).max(255),
	visibility: z.string().trim().min(1),
	description: z.string().nullable(),
	url: z.url()
});
const githubRepositoryUrlSchema = z.url().transform((value) => new URL(value)).refine((url) => url.protocol === "https:" && url.hostname === "github.com", "Only github.com HTTPS repository URLs are supported").refine((url) => {
	const segments = url.pathname.split("/").filter(Boolean);
	if (segments.length !== 2) return false;
	const [owner, rawRepo] = segments;
	return githubRepositorySchema.safeParse({
		owner,
		repo: rawRepo?.replace(/\.git$/i, "")
	}).success;
}, "GitHub repository URL must be https://github.com/{owner}/{repo}").transform((url) => {
	const segments = url.pathname.split("/").filter(Boolean);
	return {
		owner: segments[0],
		repo: segments[1].replace(/\.git$/i, "")
	};
});
const githubSourceInitializeCommandSchema = z.object({
	type: z.literal("initialize"),
	runId: z.uuid(),
	sourceId: z.uuid()
});
const githubSyncCommandSchema = z.object({
	type: z.literal("sync"),
	jobId: z.uuid()
});
const githubTypedCommandSchema = z.discriminatedUnion("type", [githubSourceInitializeCommandSchema, githubSyncCommandSchema]);
const githubCommandSchema = z.union([githubTypedCommandSchema, z.object({ jobId: z.uuid() }).transform(({ jobId }) => ({
	type: "sync",
	jobId
}))]);
const githubSourceInitializationRunConfigSchema = z.object({
	provider: z.literal("github"),
	phase: z.literal("initialize"),
	repository: githubRepositorySchema,
	selectedRef: z.string().trim().min(1).max(255).nullable(),
	includePaths: z.array(z.string().trim().min(1).max(1024)).max(100),
	excludePaths: z.array(z.string().trim().min(1).max(1024)).max(100)
});
const githubSourceAnalyzeRequestSchema = z.object({
	connection_id: z.uuid().optional(),
	workspace_id: z.uuid().optional(),
	repositoryUrl: githubRepositoryUrlSchema,
	ref: z.string().trim().min(1).max(255).optional(),
	suggestPaths: z.boolean().optional()
});
const githubLatestReleaseSchema = z.discriminatedUnion("status", [
	z.object({
		status: z.literal("available"),
		tag: z.string().trim().min(1).max(255)
	}),
	z.object({ status: z.literal("none") }),
	z.object({ status: z.literal("unavailable") })
]);
const githubSourceAnalysisResultSchema = z.object({
	label: z.string().trim().min(1).max(200),
	ref: z.string().trim().min(1).max(255),
	includePaths: z.array(z.string().trim().min(1).max(1024)).max(100),
	excludePaths: z.array(z.string().trim().min(1).max(1024)).max(100),
	confidence: z.number().min(0).max(1),
	notes: z.string().trim().min(1).max(1e3).nullable(),
	fileCount: z.number().int().nonnegative(),
	defaultBranch: z.string().min(1),
	latestRelease: githubLatestReleaseSchema,
	files: z.array(z.string().min(1))
});
const githubSyncBatchJobSchema = z.object({
	jobId: z.uuid(),
	batchId: z.uuid()
});
const githubSourceCreateRequestSchema = z.object({
	visibility: z.enum(["public", "private"]).default("private"),
	public_source_id: z.uuid().optional(),
	connection_id: z.uuid().optional(),
	workspace_id: z.uuid().optional(),
	repositoryUrl: githubRepositoryUrlSchema,
	ref: z.string().trim().min(1).max(255).optional(),
	includePaths: z.array(z.string().trim().min(1).max(1024)).max(100).default([]),
	excludePaths: z.array(z.string().trim().min(1).max(1024)).max(100).default([]),
	label: z.string().trim().min(1).max(200).optional(),
	canonical_url: sourceCanonicalUrlSchema.nullable().optional(),
	crawl_interval: z.enum([
		"daily",
		"weekly",
		"monthly"
	]).default("weekly")
});
const githubConnectionRepositorySchema = z.object({
	id: z.number().int().positive(),
	fullName: z.string(),
	private: z.boolean()
});
const githubConnectionSchema = z.object({
	id: z.uuid(),
	workspace_id: z.uuid(),
	installation_id: z.number().int().positive(),
	repositories: z.array(githubConnectionRepositorySchema),
	revoked_at: z.string().nullable()
});
//#endregion
//#region packages/schemas/src/collections.ts
const createCollectionSchema = z.object({
	workspace_id: z.uuid().optional(),
	name: z.string().min(1),
	description: z.string().optional(),
	metadata: z.any().optional()
});
const linkCollectionSourceSchema = z.object({
	workspace_id: z.uuid().optional(),
	collection_id: z.uuid(),
	source_id: z.uuid(),
	crawl_config_override: z.any().optional(),
	tags: z.array(z.string()).optional()
});
const linkCollectionDocumentsSchema = z.object({
	workspace_id: z.uuid().optional(),
	collection_id: z.uuid(),
	source_document_ids: z.array(z.uuid()).min(1),
	rule: z.enum(["include", "exclude"]).optional(),
	metadata: z.any().optional()
});
const linkCollectionFolderSchema = z.object({
	workspace_id: z.uuid().optional(),
	collection_id: z.uuid(),
	source_id: z.uuid(),
	folder_path: z.string().min(1),
	rule: z.enum(["include", "exclude"]).optional(),
	metadata: z.any().optional()
});
const collectionRuleSchema = z.object({
	action: z.enum(["include", "exclude"]),
	target: z.enum([
		"source",
		"folder",
		"url"
	]),
	source_id: z.uuid(),
	target_id: z.string().min(1),
	metadata: z.any().optional()
});
const collectionRulesPatchSchema = z.object({
	add: z.array(collectionRuleSchema).optional().default([]),
	remove: z.array(collectionRuleSchema).optional().default([])
});
//#endregion
//#region packages/schemas/src/chat.ts
const chatMessageRoleSchema = z.enum([
	"user",
	"assistant",
	"system"
]);
const googleLanguageModels = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
const googleEmbeddingModels = ["gemini-embedding-001"];
const openAiLanguageModels = ["gpt-5.4-nano", "gpt-5.5"];
const allowedChatModels = [
	googleLanguageModels[0],
	openAiLanguageModels[0],
	openAiLanguageModels[1]
];
const defaultChatModel = openAiLanguageModels[1];
const chatModelSchema = z.enum(allowedChatModels);
const chatModelContextWindowTokens = {
	"gemini-2.5-flash": 1e6,
	"gpt-5.4-nano": 128e3,
	"gpt-5.5": 128e3
};
const chatMessageSchema = z.object({
	role: chatMessageRoleSchema,
	content: z.string().trim().min(1)
}).strict();
const chatInputSchema = z.object({
	conversationId: z.uuid().optional(),
	collectionId: z.uuid().optional(),
	topK: z.number().int().min(1).max(20).optional().default(10),
	model: chatModelSchema.optional().default(defaultChatModel),
	stream: z.boolean().optional().default(false),
	messages: z.array(chatMessageSchema).min(1)
}).strict();
const createChatConversationInputSchema = z.object({ title: z.string().trim().min(1).max(160).optional() }).strict();
const updateChatConversationInputSchema = z.object({ title: z.string().trim().min(1).max(200) }).strict();
function resolveChatModelContextWindowTokens(model) {
	return chatModelContextWindowTokens[model];
}
//#endregion
//#region packages/schemas/src/extractSchemaGeneration.ts
const extractSchemaGenerationRequestSchema = z.object({
	query: z.string().min(1, "Please provide a description of what to extract"),
	context: z.string().optional(),
	allowNulls: z.boolean().default(true)
});
const jsonSchemaObjectShape = z.object({
	type: z.literal("object"),
	properties: z.looseObject({}),
	required: z.array(z.string()),
	additionalProperties: z.boolean()
});
function hasValidObjectShape(obj) {
	const keys = Object.keys(obj.properties);
	return keys.length >= 1 && obj.required.every((r) => keys.includes(r));
}
const generatedSchemaShape = z.union([jsonSchemaObjectShape, z.object({
	type: z.literal("array"),
	items: jsonSchemaObjectShape
})]);
const extractSchemaGenerationResponseSchema = z.object({
	schema: generatedSchemaShape,
	notes: z.string().nullable()
}).refine((data) => {
	if (data.schema.type === "object") return hasValidObjectShape(data.schema);
	return hasValidObjectShape(data.schema.items);
}, { message: "Schema must have at least one property; required must only list existing property names" });
//#endregion
export { searchCrawlOptions as $, githubSourceAnalyzeRequestSchema as A, mapRunRequestSchema as At, sourceCrawlRequestUnionSchema as B, githubConnectionRepositorySchema as C, deepCrawlRunRequestSchema as Ct, githubRepositorySchema as D, extractRunInputSchema as Dt, githubRepositoryMetadataSchema as E, extractResultSchema as Et, githubSyncCommandSchema as F, mapLinkSchema as Ft, sourceDiscoverRecommendationSchema as G, sourceDeepCrawlRequestSchema as H, createSourceSchema as I, mapOptionsSchema as It, updateSourceSchema as J, sourceDiscoverRequestSchema as K, sourceCanonicalUrlSchema as L, mapResultSchema as Lt, githubSourceInitializationRunConfigSchema as M, retryRunBodySchema as Mt, githubSourceInitializeCommandSchema as N, runResultSchema as Nt, githubRepositoryUrlSchema as O, extractRunRequestSchema as Ot, githubSyncBatchJobSchema as P, smartCrawlConfigSchema as Pt, newsSearchResultSchema as Q, sourceCrawlOptionsSchema as R, mapUrlSchema as Rt, githubCommandSchema as S, deepCrawlRunInputSchema as St, githubLatestReleaseSchema as T, deepCrawlTaskTypeSchema as Tt, sourceDiscoverRecommendRequestSchema as U, sourceDeepCrawlConfigSchema as V, sourceDiscoverRecommendResponseSchema as W, imageSearchResultSchema as X, imageSearchDataSchema as Y, newsSearchDataSchema as Z, collectionRulesPatchSchema as _, crawlRunScreenshotSchema as _t, chatMessageRoleSchema as a, hybridSearchDefaultConfig as at, linkCollectionFolderSchema as b, crawlRunStrategySchema as bt, chatModelSchema as c, searchMcpToolDefaultConfig as ct, googleEmbeddingModels as d, crawlRunFormatSchema as dt, searchResultDataSchema as et, googleLanguageModels as f, crawlRunInputSchema as ft, collectionRuleSchema as g, crawlRunRequestUnionSchema as gt, updateChatConversationInputSchema as h, crawlRunRequestSchema as ht, chatInputSchema as i, webSearchResultSchema as it, githubSourceCreateRequestSchema as j, readDeepCrawlConfig as jt, githubSourceAnalysisResultSchema as k, mapRunInputSchema as kt, createChatConversationInputSchema as l, searchQueryModeSchema as lt, resolveChatModelContextWindowTokens as m, crawlRunOptionsSchema as mt, extractSchemaGenerationResponseSchema as n, webSearchDataSchema as nt, chatMessageSchema as o, mcpSearchInputSchema as ot, openAiLanguageModels as p, crawlRunInputUnionSchema as pt, sourceDiscoveryAnalysisCreateSchema as q, allowedChatModels as r, webSearchInputSchema as rt, chatModelContextWindowTokens as s, searchInputSchema as st, extractSchemaGenerationRequestSchema as t, webSearchCrawlOptionsSchema as tt, defaultChatModel as u, cancelRunRequestSchema as ut, createCollectionSchema as v, crawlRunStatusQuerySchema as vt, githubConnectionSchema as w, deepCrawlTaskRequestSchema as wt, linkCollectionSourceSchema as x, deepCrawlConfigSchema as xt, linkCollectionDocumentsSchema as y, crawlRunStatusSchema as yt, sourceCrawlRequestSchema as z };
