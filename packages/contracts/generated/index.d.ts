import { t as CrawlRunType$1 } from "./index-BFguMy8c.js";
import { z } from "zod";
//#region packages/api-contract/src/publicApi.d.ts
declare const apiErrorResponseSchema: z.ZodObject<{
  error: z.ZodString;
  details: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;
declare const sdkSuccessResponseSchema: z.ZodObject<{
  success: z.ZodLiteral<true>;
}, z.core.$strip>;
declare const crawlRunTypeSchema: z.ZodEnum<{
  crawl: "crawl";
  deep_crawl: "deep_crawl";
  extract: "extract";
  source_sync: "source_sync";
}>;
declare const crawlRunSchema: z.ZodObject<{
  indexed_pages: z.ZodOptional<z.ZodNumber>;
  indexing_done: z.ZodOptional<z.ZodNumber>;
  indexing_failed: z.ZodOptional<z.ZodNumber>;
  indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
  indexing_in_progress: z.ZodOptional<z.ZodNumber>;
  indexing_queued: z.ZodOptional<z.ZodNumber>;
  deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  id: z.ZodUUID;
  completed_at: z.ZodNullable<z.ZodString>;
  config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
  created_at: z.ZodString;
  credential_id: z.ZodNullable<z.ZodUUID>;
  done: z.ZodNumber;
  error_code: z.ZodNullable<z.ZodString>;
  error_count: z.ZodNullable<z.ZodNumber>;
  error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  extraction_query: z.ZodNullable<z.ZodString>;
  extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  failed: z.ZodNumber;
  in_progress: z.ZodNumber;
  inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  indexing_completed_at: z.ZodNullable<z.ZodString>;
  indexing_started_at: z.ZodNullable<z.ZodString>;
  indexing_time_ms: z.ZodNullable<z.ZodNumber>;
  last_error: z.ZodNullable<z.ZodString>;
  last_error_at: z.ZodNullable<z.ZodString>;
  last_heartbeat: z.ZodNullable<z.ZodString>;
  max_retries: z.ZodNullable<z.ZodNumber>;
  message_ids: z.ZodArray<z.ZodString>;
  metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  needs_dispatch: z.ZodBoolean;
  priority: z.ZodNullable<z.ZodNumber>;
  processing_time_ms: z.ZodNullable<z.ZodNumber>;
  query: z.ZodNullable<z.ZodString>;
  queued: z.ZodNumber;
  requested_by_user_id: z.ZodNullable<z.ZodUUID>;
  retry_count: z.ZodNullable<z.ZodNumber>;
  started_at: z.ZodNullable<z.ZodString>;
  status: z.ZodEnum<{
    failed: "failed";
    pending: "pending";
    processing: "processing";
    completed: "completed";
    cancelled: "cancelled";
  }>;
  workspace_id: z.ZodUUID;
  type: z.ZodEnum<{
    crawl: "crawl";
    deep_crawl: "deep_crawl";
    extract: "extract";
    source_sync: "source_sync";
  }>;
  updated_at: z.ZodString;
  urls: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
declare const crawlRunStatisticsSchema: z.ZodObject<{
  total_results: z.ZodNumber;
  success_count: z.ZodNumber;
  error_count: z.ZodNumber;
  total_size: z.ZodNumber;
  average_response_time: z.ZodNumber;
}, z.core.$strip>;
declare const crawlResultSchema: z.ZodObject<{
  clean_html_size: z.ZodNullable<z.ZodNumber>;
  clean_html_url: z.ZodNullable<z.ZodString>;
  content_hash: z.ZodNullable<z.ZodString>;
  conversion_completed_at: z.ZodNullable<z.ZodString>;
  conversion_error: z.ZodNullable<z.ZodString>;
  conversion_started_at: z.ZodNullable<z.ZodString>;
  conversion_status: z.ZodNullable<z.ZodString>;
  conversion_time_ms: z.ZodNullable<z.ZodNumber>;
  crawled_at: z.ZodNullable<z.ZodString>;
  created_at: z.ZodString;
  error_message: z.ZodNullable<z.ZodString>;
  extract_completed_at: z.ZodNullable<z.ZodString>;
  extract_started_at: z.ZodNullable<z.ZodString>;
  extract_time_ms: z.ZodNullable<z.ZodNumber>;
  extraction_data: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  extraction_usage: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  file_checksum: z.ZodNullable<z.ZodString>;
  file_mime_type: z.ZodNullable<z.ZodString>;
  file_path: z.ZodNullable<z.ZodString>;
  file_size: z.ZodNullable<z.ZodNumber>;
  final_url: z.ZodNullable<z.ZodString>;
  formats_requested: z.ZodNullable<z.ZodArray<z.ZodString>>;
  icon: z.ZodNullable<z.ZodString>;
  icon_size: z.ZodNullable<z.ZodNumber>;
  id: z.ZodUUID;
  images: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  indexing_completed_at: z.ZodNullable<z.ZodString>;
  indexing_started_at: z.ZodNullable<z.ZodString>;
  indexing_time_ms: z.ZodNullable<z.ZodNumber>;
  run_id: z.ZodUUID;
  links: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  markdown_size: z.ZodNullable<z.ZodNumber>;
  markdown_url: z.ZodNullable<z.ZodString>;
  metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  raw_html_size: z.ZodNullable<z.ZodNumber>;
  raw_html_url: z.ZodNullable<z.ZodString>;
  response_time_ms: z.ZodNullable<z.ZodNumber>;
  screenshot: z.ZodNullable<z.ZodString>;
  screenshot_format: z.ZodNullable<z.ZodString>;
  screenshot_height: z.ZodNullable<z.ZodNumber>;
  screenshot_width: z.ZodNullable<z.ZodNumber>;
  status_code: z.ZodNullable<z.ZodNumber>;
  workspace_id: z.ZodUUID;
  title: z.ZodNullable<z.ZodString>;
  url: z.ZodString;
}, z.core.$strip>;
declare const searchResultSchema: z.ZodObject<{
  chunk_id: z.ZodUUID;
  source_document_id: z.ZodUUID;
  source_id: z.ZodUUID;
  url: z.ZodString;
  title: z.ZodNullable<z.ZodString>;
  chunk_index: z.ZodNumber;
  text_content: z.ZodNullable<z.ZodString>;
  metadata: z.ZodUnknown;
  fts_rank: z.ZodNullable<z.ZodNumber>;
  semantic_rank: z.ZodNullable<z.ZodNumber>;
  score: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
declare const searchResponseSchema: z.ZodObject<{
  query: z.ZodString;
  queryMode: z.ZodEnum<{
    none: "none";
    auto: "auto";
  }>;
  executedQueries: z.ZodArray<z.ZodString>;
  scoring: z.ZodObject<{
    fullTextWeight: z.ZodNumber;
    semanticWeight: z.ZodNumber;
    rrfK: z.ZodNumber;
  }, z.core.$strip>;
  results: z.ZodArray<z.ZodObject<{
    chunk_id: z.ZodUUID;
    source_document_id: z.ZodUUID;
    source_id: z.ZodUUID;
    url: z.ZodString;
    title: z.ZodNullable<z.ZodString>;
    chunk_index: z.ZodNumber;
    text_content: z.ZodNullable<z.ZodString>;
    metadata: z.ZodUnknown;
    fts_rank: z.ZodNullable<z.ZodNumber>;
    semantic_rank: z.ZodNullable<z.ZodNumber>;
    score: z.ZodNullable<z.ZodNumber>;
  }, z.core.$strip>>;
  count: z.ZodNumber;
}, z.core.$strip>;
declare const chatCitationSchema: z.ZodObject<{
  chunk_id: z.ZodUUID;
  source_document_id: z.ZodUUID;
  source_id: z.ZodUUID;
  url: z.ZodString;
  title: z.ZodNullable<z.ZodString>;
  snippet: z.ZodString;
  score: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
declare const chatResponseSchema: z.ZodObject<{
  query: z.ZodString;
  answer: z.ZodString;
  insufficientEvidence: z.ZodBoolean;
  citations: z.ZodArray<z.ZodObject<{
    chunk_id: z.ZodUUID;
    source_document_id: z.ZodUUID;
    source_id: z.ZodUUID;
    url: z.ZodString;
    title: z.ZodNullable<z.ZodString>;
    snippet: z.ZodString;
    score: z.ZodNullable<z.ZodNumber>;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const chatConversationSchema: z.ZodObject<{
  id: z.ZodUUID;
  title: z.ZodNullable<z.ZodString>;
  created_at: z.ZodString;
  updated_at: z.ZodString;
}, z.core.$strip>;
declare const chatConversationMessageSchema: z.ZodObject<{
  id: z.ZodUUID;
  conversation_id: z.ZodUUID;
  role: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
    system: "system";
  }>;
  content: z.ZodString;
  model: z.ZodNullable<z.ZodString>;
  prompt_tokens: z.ZodNullable<z.ZodNumber>;
  completion_tokens: z.ZodNullable<z.ZodNumber>;
  total_tokens: z.ZodNullable<z.ZodNumber>;
  created_at: z.ZodString;
}, z.core.$strip>;
declare const chatConversationCitationSchema: z.ZodObject<{
  id: z.ZodUUID;
  message_id: z.ZodUUID;
  citation_index: z.ZodNumber;
  chunk_id: z.ZodNullable<z.ZodUUID>;
  source_document_id: z.ZodNullable<z.ZodUUID>;
  source_id: z.ZodNullable<z.ZodUUID>;
  url: z.ZodNullable<z.ZodString>;
  title: z.ZodNullable<z.ZodString>;
  quote: z.ZodNullable<z.ZodString>;
  score: z.ZodNullable<z.ZodNumber>;
  created_at: z.ZodString;
}, z.core.$strip>;
declare const chatConversationsListResponseSchema: z.ZodObject<{
  conversations: z.ZodArray<z.ZodObject<{
    id: z.ZodUUID;
    title: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
  }, z.core.$strip>>;
  limit: z.ZodNumber;
  total: z.ZodNumber;
}, z.core.$strip>;
declare const chatConversationDetailResponseSchema: z.ZodObject<{
  conversation: z.ZodObject<{
    id: z.ZodUUID;
    title: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
  }, z.core.$strip>;
  messages: z.ZodArray<z.ZodObject<{
    id: z.ZodUUID;
    conversation_id: z.ZodUUID;
    role: z.ZodEnum<{
      user: "user";
      assistant: "assistant";
      system: "system";
    }>;
    content: z.ZodString;
    model: z.ZodNullable<z.ZodString>;
    prompt_tokens: z.ZodNullable<z.ZodNumber>;
    completion_tokens: z.ZodNullable<z.ZodNumber>;
    total_tokens: z.ZodNullable<z.ZodNumber>;
    created_at: z.ZodString;
  }, z.core.$strip>>;
  citations: z.ZodArray<z.ZodObject<{
    id: z.ZodUUID;
    message_id: z.ZodUUID;
    citation_index: z.ZodNumber;
    chunk_id: z.ZodNullable<z.ZodUUID>;
    source_document_id: z.ZodNullable<z.ZodUUID>;
    source_id: z.ZodNullable<z.ZodUUID>;
    url: z.ZodNullable<z.ZodString>;
    title: z.ZodNullable<z.ZodString>;
    quote: z.ZodNullable<z.ZodString>;
    score: z.ZodNullable<z.ZodNumber>;
    created_at: z.ZodString;
  }, z.core.$strip>>;
  limit: z.ZodNumber;
  hasMore: z.ZodBoolean;
  nextCursor: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const updateChatConversationResponseSchema: z.ZodObject<{
  conversation: z.ZodObject<{
    id: z.ZodUUID;
    title: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
declare const listRunsQuerySchema: z.ZodObject<{
  page: z.ZodOptional<z.ZodNumber>;
  limit: z.ZodOptional<z.ZodNumber>;
  orderBy: z.ZodOptional<z.ZodString>;
  status: z.ZodOptional<z.ZodEnum<{
    failed: "failed";
    pending: "pending";
    processing: "processing";
    completed: "completed";
    cancelled: "cancelled";
  }>>;
  type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
    crawl: "crawl";
    deep_crawl: "deep_crawl";
    extract: "extract";
    source_sync: "source_sync";
  }>, z.ZodLiteral<"crawl">]>>;
}, z.core.$strip>;
declare const listRunsResponseSchema: z.ZodObject<{
  runs: z.ZodArray<z.ZodObject<{
    indexed_pages: z.ZodOptional<z.ZodNumber>;
    indexing_done: z.ZodOptional<z.ZodNumber>;
    indexing_failed: z.ZodOptional<z.ZodNumber>;
    indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
    indexing_in_progress: z.ZodOptional<z.ZodNumber>;
    indexing_queued: z.ZodOptional<z.ZodNumber>;
    deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodUUID;
    completed_at: z.ZodNullable<z.ZodString>;
    config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
    created_at: z.ZodString;
    credential_id: z.ZodNullable<z.ZodUUID>;
    done: z.ZodNumber;
    error_code: z.ZodNullable<z.ZodString>;
    error_count: z.ZodNullable<z.ZodNumber>;
    error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    extraction_query: z.ZodNullable<z.ZodString>;
    extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    failed: z.ZodNumber;
    in_progress: z.ZodNumber;
    inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    indexing_completed_at: z.ZodNullable<z.ZodString>;
    indexing_started_at: z.ZodNullable<z.ZodString>;
    indexing_time_ms: z.ZodNullable<z.ZodNumber>;
    last_error: z.ZodNullable<z.ZodString>;
    last_error_at: z.ZodNullable<z.ZodString>;
    last_heartbeat: z.ZodNullable<z.ZodString>;
    max_retries: z.ZodNullable<z.ZodNumber>;
    message_ids: z.ZodArray<z.ZodString>;
    metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    needs_dispatch: z.ZodBoolean;
    priority: z.ZodNullable<z.ZodNumber>;
    processing_time_ms: z.ZodNullable<z.ZodNumber>;
    query: z.ZodNullable<z.ZodString>;
    queued: z.ZodNumber;
    requested_by_user_id: z.ZodNullable<z.ZodUUID>;
    retry_count: z.ZodNullable<z.ZodNumber>;
    started_at: z.ZodNullable<z.ZodString>;
    status: z.ZodEnum<{
      failed: "failed";
      pending: "pending";
      processing: "processing";
      completed: "completed";
      cancelled: "cancelled";
    }>;
    workspace_id: z.ZodUUID;
    type: z.ZodEnum<{
      crawl: "crawl";
      deep_crawl: "deep_crawl";
      extract: "extract";
      source_sync: "source_sync";
    }>;
    updated_at: z.ZodString;
    urls: z.ZodArray<z.ZodString>;
  }, z.core.$strip>>;
  page: z.ZodNumber;
  limit: z.ZodNumber;
  total: z.ZodNumber;
}, z.core.$strip>;
declare const getRunQuerySchema: z.ZodObject<{
  includeResults: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const getRunResponseSchema: z.ZodObject<{
  indexed_pages: z.ZodOptional<z.ZodNumber>;
  indexing_done: z.ZodOptional<z.ZodNumber>;
  indexing_failed: z.ZodOptional<z.ZodNumber>;
  indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
  indexing_in_progress: z.ZodOptional<z.ZodNumber>;
  indexing_queued: z.ZodOptional<z.ZodNumber>;
  deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  id: z.ZodUUID;
  completed_at: z.ZodNullable<z.ZodString>;
  config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
  created_at: z.ZodString;
  credential_id: z.ZodNullable<z.ZodUUID>;
  done: z.ZodNumber;
  error_code: z.ZodNullable<z.ZodString>;
  error_count: z.ZodNullable<z.ZodNumber>;
  error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  extraction_query: z.ZodNullable<z.ZodString>;
  extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  failed: z.ZodNumber;
  in_progress: z.ZodNumber;
  inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  indexing_completed_at: z.ZodNullable<z.ZodString>;
  indexing_started_at: z.ZodNullable<z.ZodString>;
  indexing_time_ms: z.ZodNullable<z.ZodNumber>;
  last_error: z.ZodNullable<z.ZodString>;
  last_error_at: z.ZodNullable<z.ZodString>;
  last_heartbeat: z.ZodNullable<z.ZodString>;
  max_retries: z.ZodNullable<z.ZodNumber>;
  message_ids: z.ZodArray<z.ZodString>;
  metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
  needs_dispatch: z.ZodBoolean;
  priority: z.ZodNullable<z.ZodNumber>;
  processing_time_ms: z.ZodNullable<z.ZodNumber>;
  query: z.ZodNullable<z.ZodString>;
  queued: z.ZodNumber;
  requested_by_user_id: z.ZodNullable<z.ZodUUID>;
  retry_count: z.ZodNullable<z.ZodNumber>;
  started_at: z.ZodNullable<z.ZodString>;
  status: z.ZodEnum<{
    failed: "failed";
    pending: "pending";
    processing: "processing";
    completed: "completed";
    cancelled: "cancelled";
  }>;
  workspace_id: z.ZodUUID;
  type: z.ZodEnum<{
    crawl: "crawl";
    deep_crawl: "deep_crawl";
    extract: "extract";
    source_sync: "source_sync";
  }>;
  updated_at: z.ZodString;
  urls: z.ZodArray<z.ZodString>;
  statistics: z.ZodObject<{
    total_results: z.ZodNumber;
    success_count: z.ZodNumber;
    error_count: z.ZodNumber;
    total_size: z.ZodNumber;
    average_response_time: z.ZodNumber;
  }, z.core.$strip>;
  crawl_results: z.ZodOptional<z.ZodArray<z.ZodObject<{
    clean_html_size: z.ZodNullable<z.ZodNumber>;
    clean_html_url: z.ZodNullable<z.ZodString>;
    content_hash: z.ZodNullable<z.ZodString>;
    conversion_completed_at: z.ZodNullable<z.ZodString>;
    conversion_error: z.ZodNullable<z.ZodString>;
    conversion_started_at: z.ZodNullable<z.ZodString>;
    conversion_status: z.ZodNullable<z.ZodString>;
    conversion_time_ms: z.ZodNullable<z.ZodNumber>;
    crawled_at: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    error_message: z.ZodNullable<z.ZodString>;
    extract_completed_at: z.ZodNullable<z.ZodString>;
    extract_started_at: z.ZodNullable<z.ZodString>;
    extract_time_ms: z.ZodNullable<z.ZodNumber>;
    extraction_data: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    extraction_usage: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    file_checksum: z.ZodNullable<z.ZodString>;
    file_mime_type: z.ZodNullable<z.ZodString>;
    file_path: z.ZodNullable<z.ZodString>;
    file_size: z.ZodNullable<z.ZodNumber>;
    final_url: z.ZodNullable<z.ZodString>;
    formats_requested: z.ZodNullable<z.ZodArray<z.ZodString>>;
    icon: z.ZodNullable<z.ZodString>;
    icon_size: z.ZodNullable<z.ZodNumber>;
    id: z.ZodUUID;
    images: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    indexing_completed_at: z.ZodNullable<z.ZodString>;
    indexing_started_at: z.ZodNullable<z.ZodString>;
    indexing_time_ms: z.ZodNullable<z.ZodNumber>;
    run_id: z.ZodUUID;
    links: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    markdown_size: z.ZodNullable<z.ZodNumber>;
    markdown_url: z.ZodNullable<z.ZodString>;
    metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    raw_html_size: z.ZodNullable<z.ZodNumber>;
    raw_html_url: z.ZodNullable<z.ZodString>;
    response_time_ms: z.ZodNullable<z.ZodNumber>;
    screenshot: z.ZodNullable<z.ZodString>;
    screenshot_format: z.ZodNullable<z.ZodString>;
    screenshot_height: z.ZodNullable<z.ZodNumber>;
    screenshot_width: z.ZodNullable<z.ZodNumber>;
    status_code: z.ZodNullable<z.ZodNumber>;
    workspace_id: z.ZodUUID;
    title: z.ZodNullable<z.ZodString>;
    url: z.ZodString;
  }, z.core.$strip>>>;
  source: z.ZodNullable<z.ZodObject<{
    id: z.ZodUUID;
    icon_url: z.ZodNullable<z.ZodString>;
    integration_type: z.ZodEnum<{
      web: "web";
      upload: "upload";
      github: "github";
    }>;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const listRunResultsQuerySchema: z.ZodObject<{
  page: z.ZodOptional<z.ZodNumber>;
  limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
declare const listRunResultsResponseSchema: z.ZodObject<{
  results: z.ZodArray<z.ZodObject<{
    clean_html_size: z.ZodNullable<z.ZodNumber>;
    clean_html_url: z.ZodNullable<z.ZodString>;
    content_hash: z.ZodNullable<z.ZodString>;
    conversion_completed_at: z.ZodNullable<z.ZodString>;
    conversion_error: z.ZodNullable<z.ZodString>;
    conversion_started_at: z.ZodNullable<z.ZodString>;
    conversion_status: z.ZodNullable<z.ZodString>;
    conversion_time_ms: z.ZodNullable<z.ZodNumber>;
    crawled_at: z.ZodNullable<z.ZodString>;
    created_at: z.ZodString;
    error_message: z.ZodNullable<z.ZodString>;
    extract_completed_at: z.ZodNullable<z.ZodString>;
    extract_started_at: z.ZodNullable<z.ZodString>;
    extract_time_ms: z.ZodNullable<z.ZodNumber>;
    extraction_data: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    extraction_usage: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    file_checksum: z.ZodNullable<z.ZodString>;
    file_mime_type: z.ZodNullable<z.ZodString>;
    file_path: z.ZodNullable<z.ZodString>;
    file_size: z.ZodNullable<z.ZodNumber>;
    final_url: z.ZodNullable<z.ZodString>;
    formats_requested: z.ZodNullable<z.ZodArray<z.ZodString>>;
    icon: z.ZodNullable<z.ZodString>;
    icon_size: z.ZodNullable<z.ZodNumber>;
    id: z.ZodUUID;
    images: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    indexing_completed_at: z.ZodNullable<z.ZodString>;
    indexing_started_at: z.ZodNullable<z.ZodString>;
    indexing_time_ms: z.ZodNullable<z.ZodNumber>;
    run_id: z.ZodUUID;
    links: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    markdown_size: z.ZodNullable<z.ZodNumber>;
    markdown_url: z.ZodNullable<z.ZodString>;
    metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
    raw_html_size: z.ZodNullable<z.ZodNumber>;
    raw_html_url: z.ZodNullable<z.ZodString>;
    response_time_ms: z.ZodNullable<z.ZodNumber>;
    screenshot: z.ZodNullable<z.ZodString>;
    screenshot_format: z.ZodNullable<z.ZodString>;
    screenshot_height: z.ZodNullable<z.ZodNumber>;
    screenshot_width: z.ZodNullable<z.ZodNumber>;
    status_code: z.ZodNullable<z.ZodNumber>;
    workspace_id: z.ZodUUID;
    title: z.ZodNullable<z.ZodString>;
    url: z.ZodString;
  }, z.core.$strip>>;
  page: z.ZodNumber;
  limit: z.ZodNumber;
  total: z.ZodNumber;
}, z.core.$strip>;
declare const screenshotResponseSchema: z.ZodObject<{
  signedUrl: z.ZodString;
}, z.core.$strip>;
declare const resultContentTypeSchema: z.ZodEnum<{
  links: "links";
  markdown: "markdown";
  cleanHtml: "cleanHtml";
  rawHtml: "rawHtml";
}>;
declare const sourceDocumentSchema: z.ZodObject<{
  id: z.ZodString;
  source_id: z.ZodString;
  url: z.ZodString;
  title: z.ZodNullable<z.ZodString>;
  status_code: z.ZodNullable<z.ZodNumber>;
  is_active: z.ZodNullable<z.ZodBoolean>;
  indexing_status: z.ZodNullable<z.ZodString>;
  indexing_error: z.ZodNullable<z.ZodString>;
  last_crawled_at: z.ZodNullable<z.ZodString>;
  latest_content_hash: z.ZodNullable<z.ZodString>;
  latest_version: z.ZodNullable<z.ZodNumber>;
  change_count: z.ZodNullable<z.ZodNumber>;
  last_changed_at: z.ZodNullable<z.ZodString>;
  latest_crawl_result_id: z.ZodNullable<z.ZodString>;
  last_indexed_crawl_result_id: z.ZodNullable<z.ZodString>;
  crawl_result: z.ZodNullable<z.ZodObject<{
    clean_html_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    clean_html_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    content_hash: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    conversion_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    conversion_error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    conversion_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    conversion_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    conversion_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    crawled_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    created_at: z.ZodOptional<z.ZodString>;
    error_message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    extract_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    extract_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    extract_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    extraction_data: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    extraction_usage: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    file_checksum: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    file_mime_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    file_path: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    file_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    final_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    formats_requested: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
    icon: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    icon_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    id: z.ZodOptional<z.ZodUUID>;
    images: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    indexing_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    indexing_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    indexing_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    links: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    markdown_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    markdown_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
    raw_html_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    raw_html_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    response_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    screenshot: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    screenshot_format: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    screenshot_height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    screenshot_width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status_code: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    url: z.ZodOptional<z.ZodString>;
    run_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    workspace_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  }, z.core.$loose>>;
  last_indexed_crawl_result: z.ZodNullable<z.ZodObject<{
    id: z.ZodString;
    indexing_completed_at: z.ZodNullable<z.ZodString>;
    indexing_time_ms: z.ZodNullable<z.ZodNumber>;
  }, z.core.$strip>>;
}, z.core.$loose>;
type SourceDocument = z.output<typeof sourceDocumentSchema>;
declare const sourceAnalysisResponseSchema: z.ZodObject<{
  url: z.ZodString;
  paths: z.ZodArray<z.ZodObject<{
    path: z.ZodString;
    depth: z.ZodNumber;
    count: z.ZodNumber;
    parent: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
  }, z.core.$strip>>;
  levelSummaries: z.ZodArray<z.ZodObject<{
    parent: z.ZodString;
    total: z.ZodNumber;
    shown: z.ZodNumber;
  }, z.core.$strip>>;
  warning: z.ZodNullable<z.ZodObject<{
    type: z.ZodLiteral<"sitemap_incomplete">;
    message: z.ZodString;
  }, z.core.$strip>>;
  id: z.ZodUUID;
  runId: z.ZodNullable<z.ZodUUID>;
  sourceId: z.ZodNullable<z.ZodUUID>;
  status: z.ZodEnum<{
    failed: "failed";
    completed: "completed";
    crawling: "crawling";
    analyzing: "analyzing";
    partial: "partial";
  }>;
  urlCount: z.ZodNullable<z.ZodNumber>;
  scopeUrls: z.ZodArray<z.ZodString>;
  error: z.ZodNullable<z.ZodString>;
  analyzedAt: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type SourceAnalysisResponse = z.output<typeof sourceAnalysisResponseSchema>;
declare const apiContract: {
  readonly sources: {
    readonly analyze: {
      readonly method: "POST";
      readonly path: "/api/v1/sources/discover/analyses";
      readonly requestSchema: z.ZodObject<{
        url: z.ZodString;
        sourceId: z.ZodOptional<z.ZodUUID>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        url: z.ZodString;
        paths: z.ZodArray<z.ZodObject<{
          path: z.ZodString;
          depth: z.ZodNumber;
          count: z.ZodNumber;
          parent: z.ZodNullable<z.ZodString>;
          name: z.ZodString;
        }, z.core.$strip>>;
        levelSummaries: z.ZodArray<z.ZodObject<{
          parent: z.ZodString;
          total: z.ZodNumber;
          shown: z.ZodNumber;
        }, z.core.$strip>>;
        warning: z.ZodNullable<z.ZodObject<{
          type: z.ZodLiteral<"sitemap_incomplete">;
          message: z.ZodString;
        }, z.core.$strip>>;
        id: z.ZodUUID;
        runId: z.ZodNullable<z.ZodUUID>;
        sourceId: z.ZodNullable<z.ZodUUID>;
        status: z.ZodEnum<{
          failed: "failed";
          completed: "completed";
          crawling: "crawling";
          analyzing: "analyzing";
          partial: "partial";
        }>;
        urlCount: z.ZodNullable<z.ZodNumber>;
        scopeUrls: z.ZodArray<z.ZodString>;
        error: z.ZodNullable<z.ZodString>;
        analyzedAt: z.ZodNullable<z.ZodString>;
      }, z.core.$strip>;
    };
    readonly analysis: {
      readonly method: "GET";
      readonly path: "/api/v1/sources/discover/analyses/{analysisId}";
      readonly responseSchema: z.ZodObject<{
        url: z.ZodString;
        paths: z.ZodArray<z.ZodObject<{
          path: z.ZodString;
          depth: z.ZodNumber;
          count: z.ZodNumber;
          parent: z.ZodNullable<z.ZodString>;
          name: z.ZodString;
        }, z.core.$strip>>;
        levelSummaries: z.ZodArray<z.ZodObject<{
          parent: z.ZodString;
          total: z.ZodNumber;
          shown: z.ZodNumber;
        }, z.core.$strip>>;
        warning: z.ZodNullable<z.ZodObject<{
          type: z.ZodLiteral<"sitemap_incomplete">;
          message: z.ZodString;
        }, z.core.$strip>>;
        id: z.ZodUUID;
        runId: z.ZodNullable<z.ZodUUID>;
        sourceId: z.ZodNullable<z.ZodUUID>;
        status: z.ZodEnum<{
          failed: "failed";
          completed: "completed";
          crawling: "crawling";
          analyzing: "analyzing";
          partial: "partial";
        }>;
        urlCount: z.ZodNullable<z.ZodNumber>;
        scopeUrls: z.ZodArray<z.ZodString>;
        error: z.ZodNullable<z.ZodString>;
        analyzedAt: z.ZodNullable<z.ZodString>;
      }, z.core.$strip>;
    };
    readonly documents: {
      readonly method: "GET";
      readonly path: "/api/v1/sources/{sourceId}/documents";
      readonly querySchema: z.ZodObject<{
        parent: z.ZodOptional<z.ZodString>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        documents: z.ZodArray<z.ZodObject<{
          id: z.ZodString;
          source_id: z.ZodString;
          url: z.ZodString;
          title: z.ZodNullable<z.ZodString>;
          status_code: z.ZodNullable<z.ZodNumber>;
          is_active: z.ZodNullable<z.ZodBoolean>;
          indexing_status: z.ZodNullable<z.ZodString>;
          indexing_error: z.ZodNullable<z.ZodString>;
          last_crawled_at: z.ZodNullable<z.ZodString>;
          latest_content_hash: z.ZodNullable<z.ZodString>;
          latest_version: z.ZodNullable<z.ZodNumber>;
          change_count: z.ZodNullable<z.ZodNumber>;
          last_changed_at: z.ZodNullable<z.ZodString>;
          latest_crawl_result_id: z.ZodNullable<z.ZodString>;
          last_indexed_crawl_result_id: z.ZodNullable<z.ZodString>;
          crawl_result: z.ZodNullable<z.ZodObject<{
            clean_html_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            clean_html_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            content_hash: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            crawled_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            created_at: z.ZodOptional<z.ZodString>;
            error_message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            extract_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            extract_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            extract_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            extraction_data: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            extraction_usage: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            file_checksum: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            file_mime_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            file_path: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            file_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            final_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            formats_requested: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            icon: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            icon_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            id: z.ZodOptional<z.ZodUUID>;
            images: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            indexing_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            indexing_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            indexing_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            links: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            markdown_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            markdown_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            metadata: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            raw_html_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            raw_html_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            response_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            screenshot: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            screenshot_format: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            screenshot_height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            screenshot_width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            status_code: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            url: z.ZodOptional<z.ZodString>;
            run_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          }, z.core.$loose>>;
          last_indexed_crawl_result: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            indexing_completed_at: z.ZodNullable<z.ZodString>;
            indexing_time_ms: z.ZodNullable<z.ZodNumber>;
          }, z.core.$strip>>;
        }, z.core.$loose>>;
        total: z.ZodNumber;
        nextOffset: z.ZodNullable<z.ZodNumber>;
        limit: z.ZodNumber;
        parent: z.ZodString;
      }, z.core.$strip>;
    };
    readonly changes: {
      readonly method: "GET";
      readonly path: "/api/v1/sources/{sourceId}/changes";
      readonly querySchema: z.ZodObject<{
        runId: z.ZodString;
        kind: z.ZodOptional<z.ZodEnum<{
          added: "added";
          changed: "changed";
          removed: "removed";
        }>>;
        offset: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        documents: z.ZodArray<z.ZodObject<{
          id: z.ZodString;
          source_id: z.ZodString;
          url: z.ZodString;
          title: z.ZodNullable<z.ZodString>;
          status_code: z.ZodNullable<z.ZodNumber>;
          is_active: z.ZodNullable<z.ZodBoolean>;
          indexing_status: z.ZodNullable<z.ZodString>;
          indexing_error: z.ZodNullable<z.ZodString>;
          last_crawled_at: z.ZodNullable<z.ZodString>;
          latest_content_hash: z.ZodNullable<z.ZodString>;
          latest_version: z.ZodNullable<z.ZodNumber>;
          change_count: z.ZodNullable<z.ZodNumber>;
          last_changed_at: z.ZodNullable<z.ZodString>;
          latest_crawl_result_id: z.ZodNullable<z.ZodString>;
          last_indexed_crawl_result_id: z.ZodNullable<z.ZodString>;
          crawl_result: z.ZodNullable<z.ZodObject<{
            clean_html_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            clean_html_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            content_hash: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_error: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_status: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            conversion_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            crawled_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            created_at: z.ZodOptional<z.ZodString>;
            error_message: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            extract_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            extract_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            extract_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            extraction_data: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            extraction_usage: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            file_checksum: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            file_mime_type: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            file_path: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            file_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            final_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            formats_requested: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString>>>;
            icon: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            icon_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            id: z.ZodOptional<z.ZodUUID>;
            images: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            indexing_completed_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            indexing_started_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            indexing_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            links: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            markdown_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            markdown_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            metadata: z.ZodOptional<z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>>;
            raw_html_size: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            raw_html_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            response_time_ms: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            screenshot: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            screenshot_format: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            screenshot_height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            screenshot_width: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            status_code: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            url: z.ZodOptional<z.ZodString>;
            run_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            workspace_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          }, z.core.$loose>>;
          last_indexed_crawl_result: z.ZodNullable<z.ZodObject<{
            id: z.ZodString;
            indexing_completed_at: z.ZodNullable<z.ZodString>;
            indexing_time_ms: z.ZodNullable<z.ZodNumber>;
          }, z.core.$strip>>;
        }, z.core.$loose>>;
        total: z.ZodNumber;
        nextOffset: z.ZodNullable<z.ZodNumber>;
        limit: z.ZodNumber;
      }, z.core.$strip>;
    };
    readonly list: {
      readonly method: "GET";
      readonly path: "/api/v1/sources";
      readonly querySchema: z.ZodObject<{
        search: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        sources: z.ZodArray<z.ZodObject<{
          crawl_config: z.ZodNullable<z.ZodUnknown>;
          crawl_interval: z.ZodNullable<z.ZodEnum<{
            custom: "custom";
            hourly: "hourly";
            daily: "daily";
            weekly: "weekly";
            monthly: "monthly";
          }>>;
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          created_by_workspace_id: z.ZodNullable<z.ZodString>;
          custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
          icon_url: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          identifier: z.ZodString;
          integration_type: z.ZodEnum<{
            web: "web";
            upload: "upload";
            github: "github";
          }>;
          is_active: z.ZodNullable<z.ZodBoolean>;
          label: z.ZodNullable<z.ZodString>;
          last_crawled_at: z.ZodNullable<z.ZodString>;
          max_depth: z.ZodNullable<z.ZodNumber>;
          max_items: z.ZodNullable<z.ZodNumber>;
          metadata: z.ZodNullable<z.ZodUnknown>;
          next_crawl_at: z.ZodNullable<z.ZodString>;
          public_source_id: z.ZodNullable<z.ZodString>;
          source_mode: z.ZodEnum<{
            discover: "discover";
            selected_pages: "selected_pages";
          }>;
          total_items_found: z.ZodNullable<z.ZodNumber>;
          type: z.ZodEnum<{
            domain: "domain";
            document: "document";
            repository: "repository";
          }>;
          updated_at: z.ZodString;
          visibility: z.ZodEnum<{
            public: "public";
            private: "private";
          }>;
          workspace_id: z.ZodNullable<z.ZodString>;
          totalItems: z.ZodNumber;
          latestRunStatus: z.ZodNullable<z.ZodString>;
          latestRunCreatedAt: z.ZodNullable<z.ZodString>;
          latestResultIcon: z.ZodNullable<z.ZodString>;
        }, z.core.$loose>>;
      }, z.core.$strip>;
    };
    readonly search: {
      readonly method: "GET";
      readonly path: "/api/v1/sources/search";
      readonly querySchema: z.ZodObject<{
        query: z.ZodString;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        sources: z.ZodArray<z.ZodObject<{
          type: z.ZodEnum<{
            domain: "domain";
            document: "document";
            repository: "repository";
          }>;
          id: z.ZodString;
          updated_at: z.ZodString;
          icon_url: z.ZodNullable<z.ZodString>;
          integration_type: z.ZodEnum<{
            web: "web";
            upload: "upload";
            github: "github";
          }>;
          identifier: z.ZodString;
          label: z.ZodNullable<z.ZodString>;
          visibility: z.ZodEnum<{
            public: "public";
            private: "private";
          }>;
          totalItems: z.ZodNumber;
          isSubscribed: z.ZodBoolean;
          isOwned: z.ZodBoolean;
          displayIdentifier: z.ZodString;
          displayTotalItems: z.ZodNumber;
        }, z.core.$loose>>;
      }, z.core.$strip>;
    };
    readonly create: {
      readonly method: "POST";
      readonly path: "/api/v1/sources";
      readonly requestSchema: z.ZodObject<{
        workspace_id: z.ZodOptional<z.ZodUUID>;
        type: z.ZodLiteral<"domain">;
        identifier: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        visibility: z.ZodOptional<z.ZodEnum<{
          public: "public";
          private: "private";
        }>>;
        source_mode: z.ZodOptional<z.ZodEnum<{
          discover: "discover";
          selected_pages: "selected_pages";
        }>>;
        crawl_config: z.ZodOptional<z.ZodObject<{
          maxDepth: z.ZodOptional<z.ZodNumber>;
          maxPages: z.ZodOptional<z.ZodNumber>;
          includePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
          excludePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
          selectedUrls: z.ZodOptional<z.ZodArray<z.ZodURL>>;
          crawlOptions: z.ZodOptional<z.ZodObject<{
            waitAfterLoad: z.ZodOptional<z.ZodNumber>;
            timeout: z.ZodOptional<z.ZodNumber>;
            includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            useHttp: z.ZodOptional<z.ZodBoolean>;
            useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
            removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
            includeDocumentLinks: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strip>>;
        }, z.core.$strip>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        crawl_interval: z.ZodOptional<z.ZodEnum<{
          custom: "custom";
          hourly: "hourly";
          daily: "daily";
          weekly: "weekly";
          monthly: "monthly";
        }>>;
        custom_interval_minutes: z.ZodOptional<z.ZodNumber>;
        analysis_id: z.ZodOptional<z.ZodUUID>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        source: z.ZodObject<{
          crawl_config: z.ZodNullable<z.ZodUnknown>;
          crawl_interval: z.ZodNullable<z.ZodEnum<{
            custom: "custom";
            hourly: "hourly";
            daily: "daily";
            weekly: "weekly";
            monthly: "monthly";
          }>>;
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          created_by_workspace_id: z.ZodNullable<z.ZodString>;
          custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
          icon_url: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          identifier: z.ZodString;
          integration_type: z.ZodEnum<{
            web: "web";
            upload: "upload";
            github: "github";
          }>;
          is_active: z.ZodNullable<z.ZodBoolean>;
          label: z.ZodNullable<z.ZodString>;
          last_crawled_at: z.ZodNullable<z.ZodString>;
          max_depth: z.ZodNullable<z.ZodNumber>;
          max_items: z.ZodNullable<z.ZodNumber>;
          metadata: z.ZodNullable<z.ZodUnknown>;
          next_crawl_at: z.ZodNullable<z.ZodString>;
          public_source_id: z.ZodNullable<z.ZodString>;
          source_mode: z.ZodEnum<{
            discover: "discover";
            selected_pages: "selected_pages";
          }>;
          total_items_found: z.ZodNullable<z.ZodNumber>;
          type: z.ZodEnum<{
            domain: "domain";
            document: "document";
            repository: "repository";
          }>;
          updated_at: z.ZodString;
          visibility: z.ZodEnum<{
            public: "public";
            private: "private";
          }>;
          workspace_id: z.ZodNullable<z.ZodString>;
        }, z.core.$loose>;
        created: z.ZodBoolean;
      }, z.core.$strip>;
    };
    readonly get: {
      readonly method: "GET";
      readonly path: "/api/v1/sources/{sourceId}";
      readonly responseSchema: z.ZodObject<{
        source: z.ZodObject<{
          crawl_config: z.ZodNullable<z.ZodUnknown>;
          crawl_interval: z.ZodNullable<z.ZodEnum<{
            custom: "custom";
            hourly: "hourly";
            daily: "daily";
            weekly: "weekly";
            monthly: "monthly";
          }>>;
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          created_by_workspace_id: z.ZodNullable<z.ZodString>;
          custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
          icon_url: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          identifier: z.ZodString;
          integration_type: z.ZodEnum<{
            web: "web";
            upload: "upload";
            github: "github";
          }>;
          is_active: z.ZodNullable<z.ZodBoolean>;
          label: z.ZodNullable<z.ZodString>;
          last_crawled_at: z.ZodNullable<z.ZodString>;
          max_depth: z.ZodNullable<z.ZodNumber>;
          max_items: z.ZodNullable<z.ZodNumber>;
          metadata: z.ZodNullable<z.ZodUnknown>;
          next_crawl_at: z.ZodNullable<z.ZodString>;
          public_source_id: z.ZodNullable<z.ZodString>;
          source_mode: z.ZodEnum<{
            discover: "discover";
            selected_pages: "selected_pages";
          }>;
          total_items_found: z.ZodNullable<z.ZodNumber>;
          type: z.ZodEnum<{
            domain: "domain";
            document: "document";
            repository: "repository";
          }>;
          updated_at: z.ZodString;
          visibility: z.ZodEnum<{
            public: "public";
            private: "private";
          }>;
          workspace_id: z.ZodNullable<z.ZodString>;
          description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$loose>;
      }, z.core.$strip>;
    };
    readonly update: {
      readonly method: "PATCH";
      readonly path: "/api/v1/sources/{sourceId}";
      readonly requestSchema: z.ZodObject<{
        label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        canonical_url: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodURL>, z.ZodTransform<string, string>>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
        source_mode: z.ZodOptional<z.ZodEnum<{
          discover: "discover";
          selected_pages: "selected_pages";
        }>>;
        crawl_interval: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
          custom: "custom";
          hourly: "hourly";
          daily: "daily";
          weekly: "weekly";
          monthly: "monthly";
        }>>>;
        custom_interval_minutes: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        crawl_config: z.ZodOptional<z.ZodObject<{
          includePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
          excludePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
          selectedRef: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          selectedUrls: z.ZodOptional<z.ZodArray<z.ZodString>>;
          crawlOptions: z.ZodOptional<z.ZodObject<{
            waitAfterLoad: z.ZodOptional<z.ZodNumber>;
            timeout: z.ZodOptional<z.ZodNumber>;
            includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
            useHttp: z.ZodOptional<z.ZodBoolean>;
            useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
            removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
            includeDocumentLinks: z.ZodOptional<z.ZodBoolean>;
          }, z.core.$strip>>;
        }, z.core.$strip>>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        source: z.ZodObject<{
          crawl_config: z.ZodNullable<z.ZodUnknown>;
          crawl_interval: z.ZodNullable<z.ZodEnum<{
            custom: "custom";
            hourly: "hourly";
            daily: "daily";
            weekly: "weekly";
            monthly: "monthly";
          }>>;
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          created_by_workspace_id: z.ZodNullable<z.ZodString>;
          custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
          icon_url: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          identifier: z.ZodString;
          integration_type: z.ZodEnum<{
            web: "web";
            upload: "upload";
            github: "github";
          }>;
          is_active: z.ZodNullable<z.ZodBoolean>;
          label: z.ZodNullable<z.ZodString>;
          last_crawled_at: z.ZodNullable<z.ZodString>;
          max_depth: z.ZodNullable<z.ZodNumber>;
          max_items: z.ZodNullable<z.ZodNumber>;
          metadata: z.ZodNullable<z.ZodUnknown>;
          next_crawl_at: z.ZodNullable<z.ZodString>;
          public_source_id: z.ZodNullable<z.ZodString>;
          source_mode: z.ZodEnum<{
            discover: "discover";
            selected_pages: "selected_pages";
          }>;
          total_items_found: z.ZodNullable<z.ZodNumber>;
          type: z.ZodEnum<{
            domain: "domain";
            document: "document";
            repository: "repository";
          }>;
          updated_at: z.ZodString;
          visibility: z.ZodEnum<{
            public: "public";
            private: "private";
          }>;
          workspace_id: z.ZodNullable<z.ZodString>;
        }, z.core.$loose>;
        run: z.ZodOptional<z.ZodNullable<z.ZodObject<{
          indexed_pages: z.ZodOptional<z.ZodNumber>;
          indexing_done: z.ZodOptional<z.ZodNumber>;
          indexing_failed: z.ZodOptional<z.ZodNumber>;
          indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
          indexing_in_progress: z.ZodOptional<z.ZodNumber>;
          indexing_queued: z.ZodOptional<z.ZodNumber>;
          deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          id: z.ZodUUID;
          completed_at: z.ZodNullable<z.ZodString>;
          config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
          created_at: z.ZodString;
          credential_id: z.ZodNullable<z.ZodUUID>;
          done: z.ZodNumber;
          error_code: z.ZodNullable<z.ZodString>;
          error_count: z.ZodNullable<z.ZodNumber>;
          error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          extraction_query: z.ZodNullable<z.ZodString>;
          extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          failed: z.ZodNumber;
          in_progress: z.ZodNumber;
          inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          indexing_completed_at: z.ZodNullable<z.ZodString>;
          indexing_started_at: z.ZodNullable<z.ZodString>;
          indexing_time_ms: z.ZodNullable<z.ZodNumber>;
          last_error: z.ZodNullable<z.ZodString>;
          last_error_at: z.ZodNullable<z.ZodString>;
          last_heartbeat: z.ZodNullable<z.ZodString>;
          max_retries: z.ZodNullable<z.ZodNumber>;
          message_ids: z.ZodArray<z.ZodString>;
          metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          needs_dispatch: z.ZodBoolean;
          priority: z.ZodNullable<z.ZodNumber>;
          processing_time_ms: z.ZodNullable<z.ZodNumber>;
          query: z.ZodNullable<z.ZodString>;
          queued: z.ZodNumber;
          requested_by_user_id: z.ZodNullable<z.ZodUUID>;
          retry_count: z.ZodNullable<z.ZodNumber>;
          started_at: z.ZodNullable<z.ZodString>;
          status: z.ZodEnum<{
            failed: "failed";
            pending: "pending";
            processing: "processing";
            completed: "completed";
            cancelled: "cancelled";
          }>;
          workspace_id: z.ZodUUID;
          type: z.ZodEnum<{
            crawl: "crawl";
            deep_crawl: "deep_crawl";
            extract: "extract";
            source_sync: "source_sync";
          }>;
          updated_at: z.ZodString;
          urls: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>>;
        dispatchDeferred: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>;
    };
    readonly delete: {
      readonly method: "DELETE";
      readonly path: "/api/v1/sources/{sourceId}";
      readonly responseSchema: z.ZodObject<{
        success: z.ZodLiteral<true>;
      }, z.core.$strip>;
    };
    readonly status: {
      readonly method: "GET";
      readonly path: "/api/v1/sources/{sourceId}/status";
      readonly responseSchema: z.ZodObject<{
        isCrawling: z.ZodBoolean;
        latestStatus: z.ZodNullable<z.ZodString>;
        latestError: z.ZodNullable<z.ZodString>;
        totalSize: z.ZodNumber;
        totalItems: z.ZodNumber;
        indexedItems: z.ZodNumber;
      }, z.core.$strip>;
    };
    readonly createGithub: {
      readonly method: "POST";
      readonly path: "/api/v1/sources/github";
      readonly requestSchema: z.ZodObject<{
        workspace_id: z.ZodOptional<z.ZodUUID>;
        repositoryUrl: z.ZodPipe<z.ZodPipe<z.ZodURL, z.ZodTransform<URL, string>>, z.ZodTransform<{
          owner: string;
          repo: string;
        }, URL>>;
        ref: z.ZodOptional<z.ZodString>;
        includePaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
        excludePaths: z.ZodDefault<z.ZodArray<z.ZodString>>;
        label: z.ZodOptional<z.ZodString>;
        canonical_url: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodURL>, z.ZodTransform<string, string>>>>;
        crawl_interval: z.ZodDefault<z.ZodEnum<{
          daily: "daily";
          weekly: "weekly";
          monthly: "monthly";
        }>>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        source: z.ZodObject<{
          crawl_config: z.ZodNullable<z.ZodUnknown>;
          crawl_interval: z.ZodNullable<z.ZodEnum<{
            custom: "custom";
            hourly: "hourly";
            daily: "daily";
            weekly: "weekly";
            monthly: "monthly";
          }>>;
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          created_by_workspace_id: z.ZodNullable<z.ZodString>;
          custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
          icon_url: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          identifier: z.ZodString;
          integration_type: z.ZodEnum<{
            web: "web";
            upload: "upload";
            github: "github";
          }>;
          is_active: z.ZodNullable<z.ZodBoolean>;
          label: z.ZodNullable<z.ZodString>;
          last_crawled_at: z.ZodNullable<z.ZodString>;
          max_depth: z.ZodNullable<z.ZodNumber>;
          max_items: z.ZodNullable<z.ZodNumber>;
          metadata: z.ZodNullable<z.ZodUnknown>;
          next_crawl_at: z.ZodNullable<z.ZodString>;
          public_source_id: z.ZodNullable<z.ZodString>;
          source_mode: z.ZodEnum<{
            discover: "discover";
            selected_pages: "selected_pages";
          }>;
          total_items_found: z.ZodNullable<z.ZodNumber>;
          type: z.ZodEnum<{
            domain: "domain";
            document: "document";
            repository: "repository";
          }>;
          updated_at: z.ZodString;
          visibility: z.ZodEnum<{
            public: "public";
            private: "private";
          }>;
          workspace_id: z.ZodNullable<z.ZodString>;
        }, z.core.$loose>;
        run: z.ZodObject<{
          indexed_pages: z.ZodOptional<z.ZodNumber>;
          indexing_done: z.ZodOptional<z.ZodNumber>;
          indexing_failed: z.ZodOptional<z.ZodNumber>;
          indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
          indexing_in_progress: z.ZodOptional<z.ZodNumber>;
          indexing_queued: z.ZodOptional<z.ZodNumber>;
          deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          id: z.ZodUUID;
          completed_at: z.ZodNullable<z.ZodString>;
          config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
          created_at: z.ZodString;
          credential_id: z.ZodNullable<z.ZodUUID>;
          done: z.ZodNumber;
          error_code: z.ZodNullable<z.ZodString>;
          error_count: z.ZodNullable<z.ZodNumber>;
          error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          extraction_query: z.ZodNullable<z.ZodString>;
          extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          failed: z.ZodNumber;
          in_progress: z.ZodNumber;
          inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          indexing_completed_at: z.ZodNullable<z.ZodString>;
          indexing_started_at: z.ZodNullable<z.ZodString>;
          indexing_time_ms: z.ZodNullable<z.ZodNumber>;
          last_error: z.ZodNullable<z.ZodString>;
          last_error_at: z.ZodNullable<z.ZodString>;
          last_heartbeat: z.ZodNullable<z.ZodString>;
          max_retries: z.ZodNullable<z.ZodNumber>;
          message_ids: z.ZodArray<z.ZodString>;
          metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          needs_dispatch: z.ZodBoolean;
          priority: z.ZodNullable<z.ZodNumber>;
          processing_time_ms: z.ZodNullable<z.ZodNumber>;
          query: z.ZodNullable<z.ZodString>;
          queued: z.ZodNumber;
          requested_by_user_id: z.ZodNullable<z.ZodUUID>;
          retry_count: z.ZodNullable<z.ZodNumber>;
          started_at: z.ZodNullable<z.ZodString>;
          status: z.ZodEnum<{
            failed: "failed";
            pending: "pending";
            processing: "processing";
            completed: "completed";
            cancelled: "cancelled";
          }>;
          workspace_id: z.ZodUUID;
          type: z.ZodEnum<{
            crawl: "crawl";
            deep_crawl: "deep_crawl";
            extract: "extract";
            source_sync: "source_sync";
          }>;
          updated_at: z.ZodString;
          urls: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
        dispatchDeferred: z.ZodBoolean;
      }, z.core.$strip>;
    };
    readonly recrawl: {
      readonly method: "POST";
      readonly path: "/api/v1/sources/{sourceId}/recrawl";
      readonly responseSchema: z.ZodObject<{
        source: z.ZodObject<{
          crawl_config: z.ZodNullable<z.ZodUnknown>;
          crawl_interval: z.ZodNullable<z.ZodEnum<{
            custom: "custom";
            hourly: "hourly";
            daily: "daily";
            weekly: "weekly";
            monthly: "monthly";
          }>>;
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          created_by_workspace_id: z.ZodNullable<z.ZodString>;
          custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
          icon_url: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          identifier: z.ZodString;
          integration_type: z.ZodEnum<{
            web: "web";
            upload: "upload";
            github: "github";
          }>;
          is_active: z.ZodNullable<z.ZodBoolean>;
          label: z.ZodNullable<z.ZodString>;
          last_crawled_at: z.ZodNullable<z.ZodString>;
          max_depth: z.ZodNullable<z.ZodNumber>;
          max_items: z.ZodNullable<z.ZodNumber>;
          metadata: z.ZodNullable<z.ZodUnknown>;
          next_crawl_at: z.ZodNullable<z.ZodString>;
          public_source_id: z.ZodNullable<z.ZodString>;
          source_mode: z.ZodEnum<{
            discover: "discover";
            selected_pages: "selected_pages";
          }>;
          total_items_found: z.ZodNullable<z.ZodNumber>;
          type: z.ZodEnum<{
            domain: "domain";
            document: "document";
            repository: "repository";
          }>;
          updated_at: z.ZodString;
          visibility: z.ZodEnum<{
            public: "public";
            private: "private";
          }>;
          workspace_id: z.ZodNullable<z.ZodString>;
        }, z.core.$loose>;
        run: z.ZodObject<{
          indexed_pages: z.ZodOptional<z.ZodNumber>;
          indexing_done: z.ZodOptional<z.ZodNumber>;
          indexing_failed: z.ZodOptional<z.ZodNumber>;
          indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
          indexing_in_progress: z.ZodOptional<z.ZodNumber>;
          indexing_queued: z.ZodOptional<z.ZodNumber>;
          deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          id: z.ZodUUID;
          completed_at: z.ZodNullable<z.ZodString>;
          config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
          created_at: z.ZodString;
          credential_id: z.ZodNullable<z.ZodUUID>;
          done: z.ZodNumber;
          error_code: z.ZodNullable<z.ZodString>;
          error_count: z.ZodNullable<z.ZodNumber>;
          error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          extraction_query: z.ZodNullable<z.ZodString>;
          extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          failed: z.ZodNumber;
          in_progress: z.ZodNumber;
          inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          indexing_completed_at: z.ZodNullable<z.ZodString>;
          indexing_started_at: z.ZodNullable<z.ZodString>;
          indexing_time_ms: z.ZodNullable<z.ZodNumber>;
          last_error: z.ZodNullable<z.ZodString>;
          last_error_at: z.ZodNullable<z.ZodString>;
          last_heartbeat: z.ZodNullable<z.ZodString>;
          max_retries: z.ZodNullable<z.ZodNumber>;
          message_ids: z.ZodArray<z.ZodString>;
          metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          needs_dispatch: z.ZodBoolean;
          priority: z.ZodNullable<z.ZodNumber>;
          processing_time_ms: z.ZodNullable<z.ZodNumber>;
          query: z.ZodNullable<z.ZodString>;
          queued: z.ZodNumber;
          requested_by_user_id: z.ZodNullable<z.ZodUUID>;
          retry_count: z.ZodNullable<z.ZodNumber>;
          started_at: z.ZodNullable<z.ZodString>;
          status: z.ZodEnum<{
            failed: "failed";
            pending: "pending";
            processing: "processing";
            completed: "completed";
            cancelled: "cancelled";
          }>;
          workspace_id: z.ZodUUID;
          type: z.ZodEnum<{
            crawl: "crawl";
            deep_crawl: "deep_crawl";
            extract: "extract";
            source_sync: "source_sync";
          }>;
          updated_at: z.ZodString;
          urls: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
        dispatchDeferred: z.ZodOptional<z.ZodBoolean>;
        previewRunId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      }, z.core.$strip>;
    };
  };
  readonly collections: {
    readonly list: {
      readonly method: "GET";
      readonly path: "/api/v1/collections";
      readonly responseSchema: z.ZodObject<{
        collections: z.ZodArray<z.ZodObject<{
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          description: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          metadata: z.ZodNullable<z.ZodUnknown>;
          name: z.ZodString;
          updated_at: z.ZodString;
          workspace_id: z.ZodString;
          sourceCount: z.ZodNumber;
          pageCount: z.ZodNumber;
        }, z.core.$loose>>;
      }, z.core.$strip>;
    };
    readonly create: {
      readonly method: "POST";
      readonly path: "/api/v1/collections";
      readonly requestSchema: z.ZodObject<{
        workspace_id: z.ZodOptional<z.ZodUUID>;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodAny>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        collection: z.ZodObject<{
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          description: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          metadata: z.ZodNullable<z.ZodUnknown>;
          name: z.ZodString;
          updated_at: z.ZodString;
          workspace_id: z.ZodString;
        }, z.core.$loose>;
      }, z.core.$strip>;
    };
    readonly get: {
      readonly method: "GET";
      readonly path: "/api/v1/collections/{collectionId}";
      readonly responseSchema: z.ZodObject<{
        collection: z.ZodObject<{
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          description: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          metadata: z.ZodNullable<z.ZodUnknown>;
          name: z.ZodString;
          updated_at: z.ZodString;
          workspace_id: z.ZodString;
        }, z.core.$loose>;
      }, z.core.$strip>;
    };
    readonly update: {
      readonly method: "PATCH";
      readonly path: "/api/v1/collections/{collectionId}";
      readonly requestSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        collection: z.ZodObject<{
          created_at: z.ZodString;
          created_by_user_id: z.ZodNullable<z.ZodString>;
          description: z.ZodNullable<z.ZodString>;
          id: z.ZodString;
          metadata: z.ZodNullable<z.ZodUnknown>;
          name: z.ZodString;
          updated_at: z.ZodString;
          workspace_id: z.ZodString;
        }, z.core.$loose>;
      }, z.core.$strip>;
    };
    readonly delete: {
      readonly method: "DELETE";
      readonly path: "/api/v1/collections/{collectionId}";
      readonly responseSchema: z.ZodObject<{
        success: z.ZodLiteral<true>;
      }, z.core.$strip>;
    };
    readonly rules: {
      readonly method: "GET";
      readonly path: "/api/v1/collections/{collectionId}/rules";
      readonly responseSchema: z.ZodObject<{
        rules: z.ZodArray<z.ZodObject<{
          action: z.ZodEnum<{
            include: "include";
            exclude: "exclude";
          }>;
          target: z.ZodEnum<{
            url: "url";
            source: "source";
            folder: "folder";
          }>;
          source_id: z.ZodString;
          target_id: z.ZodString;
          metadata: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$loose>>;
        counts: z.ZodNullable<z.ZodObject<{
          sources: z.ZodNumber;
          folders: z.ZodNumber;
          urls_selected: z.ZodNumber;
          urls_excluded: z.ZodNumber;
          urls_effective: z.ZodNumber;
        }, z.core.$strip>>;
        countsBySource: z.ZodRecord<z.ZodString, z.ZodNumber>;
      }, z.core.$strip>;
    };
    readonly updateRules: {
      readonly method: "PATCH";
      readonly path: "/api/v1/collections/{collectionId}/rules";
      readonly requestSchema: z.ZodObject<{
        add: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodEnum<{
            include: "include";
            exclude: "exclude";
          }>;
          target: z.ZodEnum<{
            url: "url";
            source: "source";
            folder: "folder";
          }>;
          source_id: z.ZodUUID;
          target_id: z.ZodString;
          metadata: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>>>;
        remove: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
          action: z.ZodEnum<{
            include: "include";
            exclude: "exclude";
          }>;
          target: z.ZodEnum<{
            url: "url";
            source: "source";
            folder: "folder";
          }>;
          source_id: z.ZodUUID;
          target_id: z.ZodString;
          metadata: z.ZodOptional<z.ZodAny>;
        }, z.core.$strip>>>>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        rules: z.ZodArray<z.ZodObject<{
          action: z.ZodEnum<{
            include: "include";
            exclude: "exclude";
          }>;
          target: z.ZodEnum<{
            url: "url";
            source: "source";
            folder: "folder";
          }>;
          source_id: z.ZodString;
          target_id: z.ZodString;
          metadata: z.ZodOptional<z.ZodUnknown>;
        }, z.core.$loose>>;
        counts: z.ZodNullable<z.ZodObject<{
          sources: z.ZodNumber;
          folders: z.ZodNumber;
          urls_selected: z.ZodNumber;
          urls_excluded: z.ZodNumber;
          urls_effective: z.ZodNumber;
        }, z.core.$strip>>;
        countsBySource: z.ZodRecord<z.ZodString, z.ZodNumber>;
      }, z.core.$strip>;
    };
  };
  readonly extract: {
    readonly method: "POST";
    readonly path: "/api/v1/extract";
    readonly requestSchema: z.ZodObject<{
      type: z.ZodLiteral<CrawlRunType$1.EXTRACT>;
      urls: z.ZodArray<z.ZodURL>;
      query: z.ZodString;
      schema: z.ZodRecord<z.ZodString, z.ZodAny>;
      maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, z.core.$strip>;
    readonly responseSchema: z.ZodObject<{
      indexed_pages: z.ZodOptional<z.ZodNumber>;
      indexing_done: z.ZodOptional<z.ZodNumber>;
      indexing_failed: z.ZodOptional<z.ZodNumber>;
      indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
      indexing_in_progress: z.ZodOptional<z.ZodNumber>;
      indexing_queued: z.ZodOptional<z.ZodNumber>;
      deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      id: z.ZodUUID;
      completed_at: z.ZodNullable<z.ZodString>;
      config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
      created_at: z.ZodString;
      credential_id: z.ZodNullable<z.ZodUUID>;
      done: z.ZodNumber;
      error_code: z.ZodNullable<z.ZodString>;
      error_count: z.ZodNullable<z.ZodNumber>;
      error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      extraction_query: z.ZodNullable<z.ZodString>;
      extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      failed: z.ZodNumber;
      in_progress: z.ZodNumber;
      inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      indexing_completed_at: z.ZodNullable<z.ZodString>;
      indexing_started_at: z.ZodNullable<z.ZodString>;
      indexing_time_ms: z.ZodNullable<z.ZodNumber>;
      last_error: z.ZodNullable<z.ZodString>;
      last_error_at: z.ZodNullable<z.ZodString>;
      last_heartbeat: z.ZodNullable<z.ZodString>;
      max_retries: z.ZodNullable<z.ZodNumber>;
      message_ids: z.ZodArray<z.ZodString>;
      metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      needs_dispatch: z.ZodBoolean;
      priority: z.ZodNullable<z.ZodNumber>;
      processing_time_ms: z.ZodNullable<z.ZodNumber>;
      query: z.ZodNullable<z.ZodString>;
      queued: z.ZodNumber;
      requested_by_user_id: z.ZodNullable<z.ZodUUID>;
      retry_count: z.ZodNullable<z.ZodNumber>;
      started_at: z.ZodNullable<z.ZodString>;
      status: z.ZodEnum<{
        failed: "failed";
        pending: "pending";
        processing: "processing";
        completed: "completed";
        cancelled: "cancelled";
      }>;
      workspace_id: z.ZodUUID;
      type: z.ZodEnum<{
        crawl: "crawl";
        deep_crawl: "deep_crawl";
        extract: "extract";
        source_sync: "source_sync";
      }>;
      updated_at: z.ZodString;
      urls: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
  };
  readonly search: {
    readonly method: "POST";
    readonly path: "/api/v1/search";
    readonly requestSchema: z.ZodObject<{
      query: z.ZodString;
      queries: z.ZodOptional<z.ZodArray<z.ZodString>>;
      queryMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        none: "none";
        auto: "auto";
      }>>>;
      limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
      collectionId: z.ZodOptional<z.ZodUUID>;
      fullTextWeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
      semanticWeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
      rrfK: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, z.core.$strict>;
    readonly responseSchema: z.ZodObject<{
      query: z.ZodString;
      queryMode: z.ZodEnum<{
        none: "none";
        auto: "auto";
      }>;
      executedQueries: z.ZodArray<z.ZodString>;
      scoring: z.ZodObject<{
        fullTextWeight: z.ZodNumber;
        semanticWeight: z.ZodNumber;
        rrfK: z.ZodNumber;
      }, z.core.$strip>;
      results: z.ZodArray<z.ZodObject<{
        chunk_id: z.ZodUUID;
        source_document_id: z.ZodUUID;
        source_id: z.ZodUUID;
        url: z.ZodString;
        title: z.ZodNullable<z.ZodString>;
        chunk_index: z.ZodNumber;
        text_content: z.ZodNullable<z.ZodString>;
        metadata: z.ZodUnknown;
        fts_rank: z.ZodNullable<z.ZodNumber>;
        semantic_rank: z.ZodNullable<z.ZodNumber>;
        score: z.ZodNullable<z.ZodNumber>;
      }, z.core.$strip>>;
      count: z.ZodNumber;
    }, z.core.$strip>;
  };
  readonly chat: {
    readonly query: {
      readonly method: "POST";
      readonly path: "/api/v1/chat";
      readonly requestSchema: z.ZodObject<{
        conversationId: z.ZodOptional<z.ZodUUID>;
        collectionId: z.ZodOptional<z.ZodUUID>;
        topK: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        model: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
          "gemini-2.5-flash": "gemini-2.5-flash";
          "gpt-5.4-nano": "gpt-5.4-nano";
          "gpt-5.5": "gpt-5.5";
        }>>>;
        stream: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        messages: z.ZodArray<z.ZodObject<{
          role: z.ZodEnum<{
            user: "user";
            assistant: "assistant";
            system: "system";
          }>;
          content: z.ZodString;
        }, z.core.$strict>>;
      }, z.core.$strict>;
      readonly responseSchema: z.ZodObject<{
        query: z.ZodString;
        answer: z.ZodString;
        insufficientEvidence: z.ZodBoolean;
        citations: z.ZodArray<z.ZodObject<{
          chunk_id: z.ZodUUID;
          source_document_id: z.ZodUUID;
          source_id: z.ZodUUID;
          url: z.ZodString;
          title: z.ZodNullable<z.ZodString>;
          snippet: z.ZodString;
          score: z.ZodNullable<z.ZodNumber>;
        }, z.core.$strip>>;
      }, z.core.$strip>;
    };
    readonly conversations: {
      readonly create: {
        readonly method: "POST";
        readonly path: "/api/v1/chat/conversations";
        readonly requestSchema: z.ZodObject<{
          title: z.ZodOptional<z.ZodString>;
        }, z.core.$strict>;
        readonly responseSchema: z.ZodObject<{
          id: z.ZodUUID;
          title: z.ZodNullable<z.ZodString>;
          created_at: z.ZodString;
          updated_at: z.ZodString;
        }, z.core.$strip>;
      };
      readonly list: {
        readonly method: "GET";
        readonly path: "/api/v1/chat/conversations";
        readonly responseSchema: z.ZodObject<{
          conversations: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            title: z.ZodNullable<z.ZodString>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
          }, z.core.$strip>>;
          limit: z.ZodNumber;
          total: z.ZodNumber;
        }, z.core.$strip>;
      };
      readonly get: {
        readonly method: "GET";
        readonly path: "/api/v1/chat/conversations/{conversationId}";
        readonly responseSchema: z.ZodObject<{
          conversation: z.ZodObject<{
            id: z.ZodUUID;
            title: z.ZodNullable<z.ZodString>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
          }, z.core.$strip>;
          messages: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            conversation_id: z.ZodUUID;
            role: z.ZodEnum<{
              user: "user";
              assistant: "assistant";
              system: "system";
            }>;
            content: z.ZodString;
            model: z.ZodNullable<z.ZodString>;
            prompt_tokens: z.ZodNullable<z.ZodNumber>;
            completion_tokens: z.ZodNullable<z.ZodNumber>;
            total_tokens: z.ZodNullable<z.ZodNumber>;
            created_at: z.ZodString;
          }, z.core.$strip>>;
          citations: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            message_id: z.ZodUUID;
            citation_index: z.ZodNumber;
            chunk_id: z.ZodNullable<z.ZodUUID>;
            source_document_id: z.ZodNullable<z.ZodUUID>;
            source_id: z.ZodNullable<z.ZodUUID>;
            url: z.ZodNullable<z.ZodString>;
            title: z.ZodNullable<z.ZodString>;
            quote: z.ZodNullable<z.ZodString>;
            score: z.ZodNullable<z.ZodNumber>;
            created_at: z.ZodString;
          }, z.core.$strip>>;
          limit: z.ZodNumber;
          hasMore: z.ZodBoolean;
          nextCursor: z.ZodNullable<z.ZodString>;
        }, z.core.$strip>;
      };
      readonly delete: {
        readonly method: "DELETE";
        readonly path: "/api/v1/chat/conversations/{conversationId}";
        readonly responseSchema: z.ZodObject<{
          success: z.ZodLiteral<true>;
        }, z.core.$strip>;
      };
      readonly update: {
        readonly method: "PATCH";
        readonly path: "/api/v1/chat/conversations/{conversationId}";
        readonly requestSchema: z.ZodObject<{
          title: z.ZodString;
        }, z.core.$strict>;
        readonly responseSchema: z.ZodObject<{
          conversation: z.ZodObject<{
            id: z.ZodUUID;
            title: z.ZodNullable<z.ZodString>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
          }, z.core.$strip>;
        }, z.core.$strip>;
      };
    };
  };
  readonly crawl: {
    readonly method: "POST";
    readonly path: "/api/v1/crawl";
    readonly requestSchema: z.ZodObject<{
      type: z.ZodLiteral<CrawlRunType$1.CRAWL>;
      config: z.ZodOptional<z.ZodObject<{
        maxDepth: z.ZodDefault<z.ZodNumber>;
        maxPages: z.ZodDefault<z.ZodNumber>;
        topKLinks: z.ZodDefault<z.ZodNumber>;
        minGainThreshold: z.ZodDefault<z.ZodNumber>;
        confidenceThreshold: z.ZodDefault<z.ZodNumber>;
      }, z.core.$strip>>;
      urls: z.ZodArray<z.ZodURL>;
      strategy: z.ZodOptional<z.ZodEnum<{
        lexical: "lexical";
        embedding: "embedding";
      }>>;
      options: z.ZodOptional<z.ZodObject<{
        formats: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<{
          links: "links";
          markdown: "markdown";
          cleanHtml: "cleanHtml";
          rawHtml: "rawHtml";
        }>>>>;
        includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        waitAfterLoad: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        timeout: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        blockAds: z.ZodDefault<z.ZodBoolean>;
        useInteractions: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        waitForSelector: z.ZodOptional<z.ZodString>;
        waitForImages: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
        screenshot: z.ZodOptional<z.ZodEnum<{
          screenshot: "screenshot";
          fullPageScreenshot: "fullPageScreenshot";
        }>>;
        useHttp: z.ZodOptional<z.ZodBoolean>;
        useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
        includeDocumentLinks: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
      }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly responseSchema: z.ZodObject<{
      indexed_pages: z.ZodOptional<z.ZodNumber>;
      indexing_done: z.ZodOptional<z.ZodNumber>;
      indexing_failed: z.ZodOptional<z.ZodNumber>;
      indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
      indexing_in_progress: z.ZodOptional<z.ZodNumber>;
      indexing_queued: z.ZodOptional<z.ZodNumber>;
      deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      id: z.ZodUUID;
      completed_at: z.ZodNullable<z.ZodString>;
      config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
      created_at: z.ZodString;
      credential_id: z.ZodNullable<z.ZodUUID>;
      done: z.ZodNumber;
      error_code: z.ZodNullable<z.ZodString>;
      error_count: z.ZodNullable<z.ZodNumber>;
      error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      extraction_query: z.ZodNullable<z.ZodString>;
      extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      failed: z.ZodNumber;
      in_progress: z.ZodNumber;
      inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      indexing_completed_at: z.ZodNullable<z.ZodString>;
      indexing_started_at: z.ZodNullable<z.ZodString>;
      indexing_time_ms: z.ZodNullable<z.ZodNumber>;
      last_error: z.ZodNullable<z.ZodString>;
      last_error_at: z.ZodNullable<z.ZodString>;
      last_heartbeat: z.ZodNullable<z.ZodString>;
      max_retries: z.ZodNullable<z.ZodNumber>;
      message_ids: z.ZodArray<z.ZodString>;
      metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      needs_dispatch: z.ZodBoolean;
      priority: z.ZodNullable<z.ZodNumber>;
      processing_time_ms: z.ZodNullable<z.ZodNumber>;
      query: z.ZodNullable<z.ZodString>;
      queued: z.ZodNumber;
      requested_by_user_id: z.ZodNullable<z.ZodUUID>;
      retry_count: z.ZodNullable<z.ZodNumber>;
      started_at: z.ZodNullable<z.ZodString>;
      status: z.ZodEnum<{
        failed: "failed";
        pending: "pending";
        processing: "processing";
        completed: "completed";
        cancelled: "cancelled";
      }>;
      workspace_id: z.ZodUUID;
      type: z.ZodEnum<{
        crawl: "crawl";
        deep_crawl: "deep_crawl";
        extract: "extract";
        source_sync: "source_sync";
      }>;
      updated_at: z.ZodString;
      urls: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
  };
  readonly deepCrawl: {
    readonly method: "POST";
    readonly path: "/api/v1/deep-crawl";
    readonly requestSchema: z.ZodObject<{
      type: z.ZodLiteral<CrawlRunType$1.DEEP_CRAWL>;
      config: z.ZodOptional<z.ZodObject<{
        maxDepth: z.ZodOptional<z.ZodNumber>;
        includeExternal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        includeDocumentLinks: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        scoreThreshold: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        normalizeScores: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        maxPages: z.ZodOptional<z.ZodNumber>;
        seedUrls: z.ZodOptional<z.ZodArray<z.ZodURL>>;
        includePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
        excludePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
        restrictToStartPath: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
      }, z.core.$strip>>;
      url: z.ZodURL;
      options: z.ZodOptional<z.ZodObject<{
        formats: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<{
          links: "links";
          markdown: "markdown";
          cleanHtml: "cleanHtml";
          rawHtml: "rawHtml";
        }>>>>;
        includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        waitAfterLoad: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        timeout: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        blockAds: z.ZodDefault<z.ZodBoolean>;
        useInteractions: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        waitForSelector: z.ZodOptional<z.ZodString>;
        waitForImages: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
        screenshot: z.ZodOptional<z.ZodEnum<{
          screenshot: "screenshot";
          fullPageScreenshot: "fullPageScreenshot";
        }>>;
        useHttp: z.ZodOptional<z.ZodBoolean>;
        useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
        includeDocumentLinks: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
      }, z.core.$strip>>;
    }, z.core.$strip>;
    readonly responseSchema: z.ZodObject<{
      indexed_pages: z.ZodOptional<z.ZodNumber>;
      indexing_done: z.ZodOptional<z.ZodNumber>;
      indexing_failed: z.ZodOptional<z.ZodNumber>;
      indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
      indexing_in_progress: z.ZodOptional<z.ZodNumber>;
      indexing_queued: z.ZodOptional<z.ZodNumber>;
      deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
      id: z.ZodUUID;
      completed_at: z.ZodNullable<z.ZodString>;
      config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
      created_at: z.ZodString;
      credential_id: z.ZodNullable<z.ZodUUID>;
      done: z.ZodNumber;
      error_code: z.ZodNullable<z.ZodString>;
      error_count: z.ZodNullable<z.ZodNumber>;
      error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      extraction_query: z.ZodNullable<z.ZodString>;
      extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      failed: z.ZodNumber;
      in_progress: z.ZodNumber;
      inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      indexing_completed_at: z.ZodNullable<z.ZodString>;
      indexing_started_at: z.ZodNullable<z.ZodString>;
      indexing_time_ms: z.ZodNullable<z.ZodNumber>;
      last_error: z.ZodNullable<z.ZodString>;
      last_error_at: z.ZodNullable<z.ZodString>;
      last_heartbeat: z.ZodNullable<z.ZodString>;
      max_retries: z.ZodNullable<z.ZodNumber>;
      message_ids: z.ZodArray<z.ZodString>;
      metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
      needs_dispatch: z.ZodBoolean;
      priority: z.ZodNullable<z.ZodNumber>;
      processing_time_ms: z.ZodNullable<z.ZodNumber>;
      query: z.ZodNullable<z.ZodString>;
      queued: z.ZodNumber;
      requested_by_user_id: z.ZodNullable<z.ZodUUID>;
      retry_count: z.ZodNullable<z.ZodNumber>;
      started_at: z.ZodNullable<z.ZodString>;
      status: z.ZodEnum<{
        failed: "failed";
        pending: "pending";
        processing: "processing";
        completed: "completed";
        cancelled: "cancelled";
      }>;
      workspace_id: z.ZodUUID;
      type: z.ZodEnum<{
        crawl: "crawl";
        deep_crawl: "deep_crawl";
        extract: "extract";
        source_sync: "source_sync";
      }>;
      updated_at: z.ZodString;
      urls: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
  };
  readonly runs: {
    readonly list: {
      readonly method: "GET";
      readonly path: "/api/v1/runs";
      readonly querySchema: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
        orderBy: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
          failed: "failed";
          pending: "pending";
          processing: "processing";
          completed: "completed";
          cancelled: "cancelled";
        }>>;
        type: z.ZodOptional<z.ZodUnion<readonly [z.ZodEnum<{
          crawl: "crawl";
          deep_crawl: "deep_crawl";
          extract: "extract";
          source_sync: "source_sync";
        }>, z.ZodLiteral<"crawl">]>>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        runs: z.ZodArray<z.ZodObject<{
          indexed_pages: z.ZodOptional<z.ZodNumber>;
          indexing_done: z.ZodOptional<z.ZodNumber>;
          indexing_failed: z.ZodOptional<z.ZodNumber>;
          indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
          indexing_in_progress: z.ZodOptional<z.ZodNumber>;
          indexing_queued: z.ZodOptional<z.ZodNumber>;
          deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
          id: z.ZodUUID;
          completed_at: z.ZodNullable<z.ZodString>;
          config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
          created_at: z.ZodString;
          credential_id: z.ZodNullable<z.ZodUUID>;
          done: z.ZodNumber;
          error_code: z.ZodNullable<z.ZodString>;
          error_count: z.ZodNullable<z.ZodNumber>;
          error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          extraction_query: z.ZodNullable<z.ZodString>;
          extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          failed: z.ZodNumber;
          in_progress: z.ZodNumber;
          inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          indexing_completed_at: z.ZodNullable<z.ZodString>;
          indexing_started_at: z.ZodNullable<z.ZodString>;
          indexing_time_ms: z.ZodNullable<z.ZodNumber>;
          last_error: z.ZodNullable<z.ZodString>;
          last_error_at: z.ZodNullable<z.ZodString>;
          last_heartbeat: z.ZodNullable<z.ZodString>;
          max_retries: z.ZodNullable<z.ZodNumber>;
          message_ids: z.ZodArray<z.ZodString>;
          metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          needs_dispatch: z.ZodBoolean;
          priority: z.ZodNullable<z.ZodNumber>;
          processing_time_ms: z.ZodNullable<z.ZodNumber>;
          query: z.ZodNullable<z.ZodString>;
          queued: z.ZodNumber;
          requested_by_user_id: z.ZodNullable<z.ZodUUID>;
          retry_count: z.ZodNullable<z.ZodNumber>;
          started_at: z.ZodNullable<z.ZodString>;
          status: z.ZodEnum<{
            failed: "failed";
            pending: "pending";
            processing: "processing";
            completed: "completed";
            cancelled: "cancelled";
          }>;
          workspace_id: z.ZodUUID;
          type: z.ZodEnum<{
            crawl: "crawl";
            deep_crawl: "deep_crawl";
            extract: "extract";
            source_sync: "source_sync";
          }>;
          updated_at: z.ZodString;
          urls: z.ZodArray<z.ZodString>;
        }, z.core.$strip>>;
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
      }, z.core.$strip>;
    };
    readonly create: {
      readonly method: "POST";
      readonly path: "/api/v1/runs";
      readonly requestSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<CrawlRunType$1.CRAWL>;
        config: z.ZodOptional<z.ZodObject<{
          maxDepth: z.ZodDefault<z.ZodNumber>;
          maxPages: z.ZodDefault<z.ZodNumber>;
          topKLinks: z.ZodDefault<z.ZodNumber>;
          minGainThreshold: z.ZodDefault<z.ZodNumber>;
          confidenceThreshold: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>;
        urls: z.ZodArray<z.ZodURL>;
        strategy: z.ZodOptional<z.ZodEnum<{
          lexical: "lexical";
          embedding: "embedding";
        }>>;
        options: z.ZodOptional<z.ZodObject<{
          formats: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<{
            links: "links";
            markdown: "markdown";
            cleanHtml: "cleanHtml";
            rawHtml: "rawHtml";
          }>>>>;
          includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
          excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
          headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
          waitAfterLoad: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
          timeout: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
          blockAds: z.ZodDefault<z.ZodBoolean>;
          useInteractions: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
          waitForSelector: z.ZodOptional<z.ZodString>;
          waitForImages: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
          removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
          screenshot: z.ZodOptional<z.ZodEnum<{
            screenshot: "screenshot";
            fullPageScreenshot: "fullPageScreenshot";
          }>>;
          useHttp: z.ZodOptional<z.ZodBoolean>;
          useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
          includeDocumentLinks: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<CrawlRunType$1.EXTRACT>;
        urls: z.ZodArray<z.ZodURL>;
        query: z.ZodString;
        schema: z.ZodRecord<z.ZodString, z.ZodAny>;
        maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<CrawlRunType$1.DEEP_CRAWL>;
        config: z.ZodOptional<z.ZodObject<{
          maxDepth: z.ZodOptional<z.ZodNumber>;
          includeExternal: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
          includeDocumentLinks: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
          scoreThreshold: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
          normalizeScores: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
          maxPages: z.ZodOptional<z.ZodNumber>;
          seedUrls: z.ZodOptional<z.ZodArray<z.ZodURL>>;
          includePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
          excludePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
          restrictToStartPath: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>;
        url: z.ZodURL;
        options: z.ZodOptional<z.ZodObject<{
          formats: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<{
            links: "links";
            markdown: "markdown";
            cleanHtml: "cleanHtml";
            rawHtml: "rawHtml";
          }>>>>;
          includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
          excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
          headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
          waitAfterLoad: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
          timeout: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
          blockAds: z.ZodDefault<z.ZodBoolean>;
          useInteractions: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
          waitForSelector: z.ZodOptional<z.ZodString>;
          waitForImages: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
          removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
          screenshot: z.ZodOptional<z.ZodEnum<{
            screenshot: "screenshot";
            fullPageScreenshot: "fullPageScreenshot";
          }>>;
          useHttp: z.ZodOptional<z.ZodBoolean>;
          useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
          includeDocumentLinks: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        }, z.core.$strip>>;
      }, z.core.$strip>], "type">;
      readonly responseSchema: z.ZodObject<{
        indexed_pages: z.ZodOptional<z.ZodNumber>;
        indexing_done: z.ZodOptional<z.ZodNumber>;
        indexing_failed: z.ZodOptional<z.ZodNumber>;
        indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
        indexing_in_progress: z.ZodOptional<z.ZodNumber>;
        indexing_queued: z.ZodOptional<z.ZodNumber>;
        deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodUUID;
        completed_at: z.ZodNullable<z.ZodString>;
        config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
        created_at: z.ZodString;
        credential_id: z.ZodNullable<z.ZodUUID>;
        done: z.ZodNumber;
        error_code: z.ZodNullable<z.ZodString>;
        error_count: z.ZodNullable<z.ZodNumber>;
        error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        extraction_query: z.ZodNullable<z.ZodString>;
        extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        failed: z.ZodNumber;
        in_progress: z.ZodNumber;
        inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        indexing_completed_at: z.ZodNullable<z.ZodString>;
        indexing_started_at: z.ZodNullable<z.ZodString>;
        indexing_time_ms: z.ZodNullable<z.ZodNumber>;
        last_error: z.ZodNullable<z.ZodString>;
        last_error_at: z.ZodNullable<z.ZodString>;
        last_heartbeat: z.ZodNullable<z.ZodString>;
        max_retries: z.ZodNullable<z.ZodNumber>;
        message_ids: z.ZodArray<z.ZodString>;
        metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        needs_dispatch: z.ZodBoolean;
        priority: z.ZodNullable<z.ZodNumber>;
        processing_time_ms: z.ZodNullable<z.ZodNumber>;
        query: z.ZodNullable<z.ZodString>;
        queued: z.ZodNumber;
        requested_by_user_id: z.ZodNullable<z.ZodUUID>;
        retry_count: z.ZodNullable<z.ZodNumber>;
        started_at: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
          failed: "failed";
          pending: "pending";
          processing: "processing";
          completed: "completed";
          cancelled: "cancelled";
        }>;
        workspace_id: z.ZodUUID;
        type: z.ZodEnum<{
          crawl: "crawl";
          deep_crawl: "deep_crawl";
          extract: "extract";
          source_sync: "source_sync";
        }>;
        updated_at: z.ZodString;
        urls: z.ZodArray<z.ZodString>;
      }, z.core.$strip>;
    };
    readonly get: {
      readonly method: "GET";
      readonly path: "/api/v1/runs/{runId}";
      readonly querySchema: z.ZodObject<{
        includeResults: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        indexed_pages: z.ZodOptional<z.ZodNumber>;
        indexing_done: z.ZodOptional<z.ZodNumber>;
        indexing_failed: z.ZodOptional<z.ZodNumber>;
        indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
        indexing_in_progress: z.ZodOptional<z.ZodNumber>;
        indexing_queued: z.ZodOptional<z.ZodNumber>;
        deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodUUID;
        completed_at: z.ZodNullable<z.ZodString>;
        config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
        created_at: z.ZodString;
        credential_id: z.ZodNullable<z.ZodUUID>;
        done: z.ZodNumber;
        error_code: z.ZodNullable<z.ZodString>;
        error_count: z.ZodNullable<z.ZodNumber>;
        error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        extraction_query: z.ZodNullable<z.ZodString>;
        extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        failed: z.ZodNumber;
        in_progress: z.ZodNumber;
        inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        indexing_completed_at: z.ZodNullable<z.ZodString>;
        indexing_started_at: z.ZodNullable<z.ZodString>;
        indexing_time_ms: z.ZodNullable<z.ZodNumber>;
        last_error: z.ZodNullable<z.ZodString>;
        last_error_at: z.ZodNullable<z.ZodString>;
        last_heartbeat: z.ZodNullable<z.ZodString>;
        max_retries: z.ZodNullable<z.ZodNumber>;
        message_ids: z.ZodArray<z.ZodString>;
        metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        needs_dispatch: z.ZodBoolean;
        priority: z.ZodNullable<z.ZodNumber>;
        processing_time_ms: z.ZodNullable<z.ZodNumber>;
        query: z.ZodNullable<z.ZodString>;
        queued: z.ZodNumber;
        requested_by_user_id: z.ZodNullable<z.ZodUUID>;
        retry_count: z.ZodNullable<z.ZodNumber>;
        started_at: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
          failed: "failed";
          pending: "pending";
          processing: "processing";
          completed: "completed";
          cancelled: "cancelled";
        }>;
        workspace_id: z.ZodUUID;
        type: z.ZodEnum<{
          crawl: "crawl";
          deep_crawl: "deep_crawl";
          extract: "extract";
          source_sync: "source_sync";
        }>;
        updated_at: z.ZodString;
        urls: z.ZodArray<z.ZodString>;
        statistics: z.ZodObject<{
          total_results: z.ZodNumber;
          success_count: z.ZodNumber;
          error_count: z.ZodNumber;
          total_size: z.ZodNumber;
          average_response_time: z.ZodNumber;
        }, z.core.$strip>;
        crawl_results: z.ZodOptional<z.ZodArray<z.ZodObject<{
          clean_html_size: z.ZodNullable<z.ZodNumber>;
          clean_html_url: z.ZodNullable<z.ZodString>;
          content_hash: z.ZodNullable<z.ZodString>;
          conversion_completed_at: z.ZodNullable<z.ZodString>;
          conversion_error: z.ZodNullable<z.ZodString>;
          conversion_started_at: z.ZodNullable<z.ZodString>;
          conversion_status: z.ZodNullable<z.ZodString>;
          conversion_time_ms: z.ZodNullable<z.ZodNumber>;
          crawled_at: z.ZodNullable<z.ZodString>;
          created_at: z.ZodString;
          error_message: z.ZodNullable<z.ZodString>;
          extract_completed_at: z.ZodNullable<z.ZodString>;
          extract_started_at: z.ZodNullable<z.ZodString>;
          extract_time_ms: z.ZodNullable<z.ZodNumber>;
          extraction_data: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          extraction_usage: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          file_checksum: z.ZodNullable<z.ZodString>;
          file_mime_type: z.ZodNullable<z.ZodString>;
          file_path: z.ZodNullable<z.ZodString>;
          file_size: z.ZodNullable<z.ZodNumber>;
          final_url: z.ZodNullable<z.ZodString>;
          formats_requested: z.ZodNullable<z.ZodArray<z.ZodString>>;
          icon: z.ZodNullable<z.ZodString>;
          icon_size: z.ZodNullable<z.ZodNumber>;
          id: z.ZodUUID;
          images: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          indexing_completed_at: z.ZodNullable<z.ZodString>;
          indexing_started_at: z.ZodNullable<z.ZodString>;
          indexing_time_ms: z.ZodNullable<z.ZodNumber>;
          run_id: z.ZodUUID;
          links: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          markdown_size: z.ZodNullable<z.ZodNumber>;
          markdown_url: z.ZodNullable<z.ZodString>;
          metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          raw_html_size: z.ZodNullable<z.ZodNumber>;
          raw_html_url: z.ZodNullable<z.ZodString>;
          response_time_ms: z.ZodNullable<z.ZodNumber>;
          screenshot: z.ZodNullable<z.ZodString>;
          screenshot_format: z.ZodNullable<z.ZodString>;
          screenshot_height: z.ZodNullable<z.ZodNumber>;
          screenshot_width: z.ZodNullable<z.ZodNumber>;
          status_code: z.ZodNullable<z.ZodNumber>;
          workspace_id: z.ZodUUID;
          title: z.ZodNullable<z.ZodString>;
          url: z.ZodString;
        }, z.core.$strip>>>;
        source: z.ZodNullable<z.ZodObject<{
          id: z.ZodUUID;
          icon_url: z.ZodNullable<z.ZodString>;
          integration_type: z.ZodEnum<{
            web: "web";
            upload: "upload";
            github: "github";
          }>;
        }, z.core.$strip>>;
      }, z.core.$strip>;
    };
    readonly cancel: {
      readonly method: "POST";
      readonly path: "/api/v1/runs/{runId}/cancel";
      readonly responseSchema: z.ZodObject<{
        success: z.ZodLiteral<true>;
      }, z.core.$strip>;
    };
    readonly retry: {
      readonly method: "POST";
      readonly path: "/api/v1/runs/{runId}/retry";
      readonly requestSchema: z.ZodObject<{
        urls: z.ZodOptional<z.ZodArray<z.ZodURL>>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        indexed_pages: z.ZodOptional<z.ZodNumber>;
        indexing_done: z.ZodOptional<z.ZodNumber>;
        indexing_failed: z.ZodOptional<z.ZodNumber>;
        indexing_failed_pages: z.ZodOptional<z.ZodNumber>;
        indexing_in_progress: z.ZodOptional<z.ZodNumber>;
        indexing_queued: z.ZodOptional<z.ZodNumber>;
        deletion_requested_at: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        id: z.ZodUUID;
        completed_at: z.ZodNullable<z.ZodString>;
        config: z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>;
        created_at: z.ZodString;
        credential_id: z.ZodNullable<z.ZodUUID>;
        done: z.ZodNumber;
        error_code: z.ZodNullable<z.ZodString>;
        error_count: z.ZodNullable<z.ZodNumber>;
        error_details: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        extraction_query: z.ZodNullable<z.ZodString>;
        extraction_schema: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        failed: z.ZodNumber;
        in_progress: z.ZodNumber;
        inline_credentials: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        indexing_completed_at: z.ZodNullable<z.ZodString>;
        indexing_started_at: z.ZodNullable<z.ZodString>;
        indexing_time_ms: z.ZodNullable<z.ZodNumber>;
        last_error: z.ZodNullable<z.ZodString>;
        last_error_at: z.ZodNullable<z.ZodString>;
        last_heartbeat: z.ZodNullable<z.ZodString>;
        max_retries: z.ZodNullable<z.ZodNumber>;
        message_ids: z.ZodArray<z.ZodString>;
        metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
        needs_dispatch: z.ZodBoolean;
        priority: z.ZodNullable<z.ZodNumber>;
        processing_time_ms: z.ZodNullable<z.ZodNumber>;
        query: z.ZodNullable<z.ZodString>;
        queued: z.ZodNumber;
        requested_by_user_id: z.ZodNullable<z.ZodUUID>;
        retry_count: z.ZodNullable<z.ZodNumber>;
        started_at: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
          failed: "failed";
          pending: "pending";
          processing: "processing";
          completed: "completed";
          cancelled: "cancelled";
        }>;
        workspace_id: z.ZodUUID;
        type: z.ZodEnum<{
          crawl: "crawl";
          deep_crawl: "deep_crawl";
          extract: "extract";
          source_sync: "source_sync";
        }>;
        updated_at: z.ZodString;
        urls: z.ZodArray<z.ZodString>;
      }, z.core.$strip>;
    };
    readonly delete: {
      readonly method: "DELETE";
      readonly path: "/api/v1/runs/{runId}";
      readonly responseSchema: z.ZodObject<{
        success: z.ZodLiteral<true>;
      }, z.core.$strip>;
    };
    readonly results: {
      readonly method: "GET";
      readonly path: "/api/v1/runs/{runId}/results";
      readonly querySchema: z.ZodObject<{
        page: z.ZodOptional<z.ZodNumber>;
        limit: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        results: z.ZodArray<z.ZodObject<{
          clean_html_size: z.ZodNullable<z.ZodNumber>;
          clean_html_url: z.ZodNullable<z.ZodString>;
          content_hash: z.ZodNullable<z.ZodString>;
          conversion_completed_at: z.ZodNullable<z.ZodString>;
          conversion_error: z.ZodNullable<z.ZodString>;
          conversion_started_at: z.ZodNullable<z.ZodString>;
          conversion_status: z.ZodNullable<z.ZodString>;
          conversion_time_ms: z.ZodNullable<z.ZodNumber>;
          crawled_at: z.ZodNullable<z.ZodString>;
          created_at: z.ZodString;
          error_message: z.ZodNullable<z.ZodString>;
          extract_completed_at: z.ZodNullable<z.ZodString>;
          extract_started_at: z.ZodNullable<z.ZodString>;
          extract_time_ms: z.ZodNullable<z.ZodNumber>;
          extraction_data: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          extraction_usage: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          file_checksum: z.ZodNullable<z.ZodString>;
          file_mime_type: z.ZodNullable<z.ZodString>;
          file_path: z.ZodNullable<z.ZodString>;
          file_size: z.ZodNullable<z.ZodNumber>;
          final_url: z.ZodNullable<z.ZodString>;
          formats_requested: z.ZodNullable<z.ZodArray<z.ZodString>>;
          icon: z.ZodNullable<z.ZodString>;
          icon_size: z.ZodNullable<z.ZodNumber>;
          id: z.ZodUUID;
          images: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          indexing_completed_at: z.ZodNullable<z.ZodString>;
          indexing_started_at: z.ZodNullable<z.ZodString>;
          indexing_time_ms: z.ZodNullable<z.ZodNumber>;
          run_id: z.ZodUUID;
          links: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          markdown_size: z.ZodNullable<z.ZodNumber>;
          markdown_url: z.ZodNullable<z.ZodString>;
          metadata: z.ZodNullable<z.ZodType<unknown, unknown, z.core.$ZodTypeInternals<unknown, unknown>>>;
          raw_html_size: z.ZodNullable<z.ZodNumber>;
          raw_html_url: z.ZodNullable<z.ZodString>;
          response_time_ms: z.ZodNullable<z.ZodNumber>;
          screenshot: z.ZodNullable<z.ZodString>;
          screenshot_format: z.ZodNullable<z.ZodString>;
          screenshot_height: z.ZodNullable<z.ZodNumber>;
          screenshot_width: z.ZodNullable<z.ZodNumber>;
          status_code: z.ZodNullable<z.ZodNumber>;
          workspace_id: z.ZodUUID;
          title: z.ZodNullable<z.ZodString>;
          url: z.ZodString;
        }, z.core.$strip>>;
        page: z.ZodNumber;
        limit: z.ZodNumber;
        total: z.ZodNumber;
      }, z.core.$strip>;
    };
    readonly resultContent: {
      readonly method: "GET";
      readonly path: "/api/v1/runs/{runId}/results/{resultId}/content";
      readonly querySchema: z.ZodObject<{
        type: z.ZodOptional<z.ZodEnum<{
          links: "links";
          markdown: "markdown";
          cleanHtml: "cleanHtml";
          rawHtml: "rawHtml";
        }>>;
        download: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>;
    };
    readonly resultScreenshot: {
      readonly method: "GET";
      readonly path: "/api/v1/runs/{runId}/results/{resultId}/screenshot";
      readonly querySchema: z.ZodObject<{
        download: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>;
      readonly responseSchema: z.ZodObject<{
        signedUrl: z.ZodString;
      }, z.core.$strip>;
    };
  };
};
type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
type ApiContract = typeof apiContract;
type CrawlRun = z.infer<typeof crawlRunSchema>;
type CrawlRunStatistics = z.infer<typeof crawlRunStatisticsSchema>;
type CrawlResult = z.infer<typeof crawlResultSchema>;
type CrawlRunType = z.infer<typeof crawlRunTypeSchema>;
type GetRunQuery = z.infer<typeof getRunQuerySchema>;
type GetRunResponse = z.infer<typeof getRunResponseSchema>;
type ListRunResultsQuery = z.infer<typeof listRunResultsQuerySchema>;
type ListRunResultsResponse = z.infer<typeof listRunResultsResponseSchema>;
type ListRunsQuery = z.infer<typeof listRunsQuerySchema>;
type ListRunsResponse = z.infer<typeof listRunsResponseSchema>;
type ResultContentType = z.infer<typeof resultContentTypeSchema>;
type SearchResponse = z.infer<typeof searchResponseSchema>;
type SearchResult = z.infer<typeof searchResultSchema>;
type ChatCitation = z.infer<typeof chatCitationSchema>;
type ChatResponse = z.infer<typeof chatResponseSchema>;
type ChatConversation = z.infer<typeof chatConversationSchema>;
type ChatConversationMessage = z.infer<typeof chatConversationMessageSchema>;
type ChatConversationCitation = z.infer<typeof chatConversationCitationSchema>;
type ChatConversationsListResponse = z.infer<typeof chatConversationsListResponseSchema>;
type ChatConversationDetailResponse = z.infer<typeof chatConversationDetailResponseSchema>;
type UpdateChatConversationResponse = z.infer<typeof updateChatConversationResponseSchema>;
type SdkSuccessResponse = z.infer<typeof sdkSuccessResponseSchema>;
type ScreenshotResponse = z.infer<typeof screenshotResponseSchema>;
//#endregion
//#region packages/api-contract/src/resourceSchemas.d.ts
declare const sourceSchema: z.ZodObject<{
  crawl_config: z.ZodNullable<z.ZodUnknown>;
  crawl_interval: z.ZodNullable<z.ZodEnum<{
    custom: "custom";
    hourly: "hourly";
    daily: "daily";
    weekly: "weekly";
    monthly: "monthly";
  }>>;
  created_at: z.ZodString;
  created_by_user_id: z.ZodNullable<z.ZodString>;
  created_by_workspace_id: z.ZodNullable<z.ZodString>;
  custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
  icon_url: z.ZodNullable<z.ZodString>;
  id: z.ZodString;
  identifier: z.ZodString;
  integration_type: z.ZodEnum<{
    web: "web";
    upload: "upload";
    github: "github";
  }>;
  is_active: z.ZodNullable<z.ZodBoolean>;
  label: z.ZodNullable<z.ZodString>;
  last_crawled_at: z.ZodNullable<z.ZodString>;
  max_depth: z.ZodNullable<z.ZodNumber>;
  max_items: z.ZodNullable<z.ZodNumber>;
  metadata: z.ZodNullable<z.ZodUnknown>;
  next_crawl_at: z.ZodNullable<z.ZodString>;
  public_source_id: z.ZodNullable<z.ZodString>;
  source_mode: z.ZodEnum<{
    discover: "discover";
    selected_pages: "selected_pages";
  }>;
  total_items_found: z.ZodNullable<z.ZodNumber>;
  type: z.ZodEnum<{
    domain: "domain";
    document: "document";
    repository: "repository";
  }>;
  updated_at: z.ZodString;
  visibility: z.ZodEnum<{
    public: "public";
    private: "private";
  }>;
  workspace_id: z.ZodNullable<z.ZodString>;
}, z.core.$loose>;
declare const collectionSchema: z.ZodObject<{
  created_at: z.ZodString;
  created_by_user_id: z.ZodNullable<z.ZodString>;
  description: z.ZodNullable<z.ZodString>;
  id: z.ZodString;
  metadata: z.ZodNullable<z.ZodUnknown>;
  name: z.ZodString;
  updated_at: z.ZodString;
  workspace_id: z.ZodString;
}, z.core.$loose>;
declare const sourceListItemSchema: z.ZodObject<{
  crawl_config: z.ZodNullable<z.ZodUnknown>;
  crawl_interval: z.ZodNullable<z.ZodEnum<{
    custom: "custom";
    hourly: "hourly";
    daily: "daily";
    weekly: "weekly";
    monthly: "monthly";
  }>>;
  created_at: z.ZodString;
  created_by_user_id: z.ZodNullable<z.ZodString>;
  created_by_workspace_id: z.ZodNullable<z.ZodString>;
  custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
  icon_url: z.ZodNullable<z.ZodString>;
  id: z.ZodString;
  identifier: z.ZodString;
  integration_type: z.ZodEnum<{
    web: "web";
    upload: "upload";
    github: "github";
  }>;
  is_active: z.ZodNullable<z.ZodBoolean>;
  label: z.ZodNullable<z.ZodString>;
  last_crawled_at: z.ZodNullable<z.ZodString>;
  max_depth: z.ZodNullable<z.ZodNumber>;
  max_items: z.ZodNullable<z.ZodNumber>;
  metadata: z.ZodNullable<z.ZodUnknown>;
  next_crawl_at: z.ZodNullable<z.ZodString>;
  public_source_id: z.ZodNullable<z.ZodString>;
  source_mode: z.ZodEnum<{
    discover: "discover";
    selected_pages: "selected_pages";
  }>;
  total_items_found: z.ZodNullable<z.ZodNumber>;
  type: z.ZodEnum<{
    domain: "domain";
    document: "document";
    repository: "repository";
  }>;
  updated_at: z.ZodString;
  visibility: z.ZodEnum<{
    public: "public";
    private: "private";
  }>;
  workspace_id: z.ZodNullable<z.ZodString>;
  totalItems: z.ZodNumber;
  latestRunStatus: z.ZodNullable<z.ZodString>;
  latestRunCreatedAt: z.ZodNullable<z.ZodString>;
  latestResultIcon: z.ZodNullable<z.ZodString>;
}, z.core.$loose>;
declare const sourceSearchResultSchema: z.ZodObject<{
  type: z.ZodEnum<{
    domain: "domain";
    document: "document";
    repository: "repository";
  }>;
  id: z.ZodString;
  updated_at: z.ZodString;
  icon_url: z.ZodNullable<z.ZodString>;
  integration_type: z.ZodEnum<{
    web: "web";
    upload: "upload";
    github: "github";
  }>;
  identifier: z.ZodString;
  label: z.ZodNullable<z.ZodString>;
  visibility: z.ZodEnum<{
    public: "public";
    private: "private";
  }>;
  totalItems: z.ZodNumber;
  isSubscribed: z.ZodBoolean;
  isOwned: z.ZodBoolean;
  displayIdentifier: z.ZodString;
  displayTotalItems: z.ZodNumber;
}, z.core.$loose>;
declare const sourceDetailSchema: z.ZodObject<{
  crawl_config: z.ZodNullable<z.ZodUnknown>;
  crawl_interval: z.ZodNullable<z.ZodEnum<{
    custom: "custom";
    hourly: "hourly";
    daily: "daily";
    weekly: "weekly";
    monthly: "monthly";
  }>>;
  created_at: z.ZodString;
  created_by_user_id: z.ZodNullable<z.ZodString>;
  created_by_workspace_id: z.ZodNullable<z.ZodString>;
  custom_interval_minutes: z.ZodNullable<z.ZodNumber>;
  icon_url: z.ZodNullable<z.ZodString>;
  id: z.ZodString;
  identifier: z.ZodString;
  integration_type: z.ZodEnum<{
    web: "web";
    upload: "upload";
    github: "github";
  }>;
  is_active: z.ZodNullable<z.ZodBoolean>;
  label: z.ZodNullable<z.ZodString>;
  last_crawled_at: z.ZodNullable<z.ZodString>;
  max_depth: z.ZodNullable<z.ZodNumber>;
  max_items: z.ZodNullable<z.ZodNumber>;
  metadata: z.ZodNullable<z.ZodUnknown>;
  next_crawl_at: z.ZodNullable<z.ZodString>;
  public_source_id: z.ZodNullable<z.ZodString>;
  source_mode: z.ZodEnum<{
    discover: "discover";
    selected_pages: "selected_pages";
  }>;
  total_items_found: z.ZodNullable<z.ZodNumber>;
  type: z.ZodEnum<{
    domain: "domain";
    document: "document";
    repository: "repository";
  }>;
  updated_at: z.ZodString;
  visibility: z.ZodEnum<{
    public: "public";
    private: "private";
  }>;
  workspace_id: z.ZodNullable<z.ZodString>;
  description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$loose>;
declare const sourceStatusSchema: z.ZodObject<{
  isCrawling: z.ZodBoolean;
  latestStatus: z.ZodNullable<z.ZodString>;
  latestError: z.ZodNullable<z.ZodString>;
  totalSize: z.ZodNumber;
  totalItems: z.ZodNumber;
  indexedItems: z.ZodNumber;
}, z.core.$strip>;
declare const collectionListItemSchema: z.ZodObject<{
  created_at: z.ZodString;
  created_by_user_id: z.ZodNullable<z.ZodString>;
  description: z.ZodNullable<z.ZodString>;
  id: z.ZodString;
  metadata: z.ZodNullable<z.ZodUnknown>;
  name: z.ZodString;
  updated_at: z.ZodString;
  workspace_id: z.ZodString;
  sourceCount: z.ZodNumber;
  pageCount: z.ZodNumber;
}, z.core.$loose>;
declare const updateCollectionRequestSchema: z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const collectionRuleResponseSchema: z.ZodObject<{
  action: z.ZodEnum<{
    include: "include";
    exclude: "exclude";
  }>;
  target: z.ZodEnum<{
    url: "url";
    source: "source";
    folder: "folder";
  }>;
  source_id: z.ZodString;
  target_id: z.ZodString;
  metadata: z.ZodOptional<z.ZodUnknown>;
}, z.core.$loose>;
declare const collectionRulesResponseSchema: z.ZodObject<{
  rules: z.ZodArray<z.ZodObject<{
    action: z.ZodEnum<{
      include: "include";
      exclude: "exclude";
    }>;
    target: z.ZodEnum<{
      url: "url";
      source: "source";
      folder: "folder";
    }>;
    source_id: z.ZodString;
    target_id: z.ZodString;
    metadata: z.ZodOptional<z.ZodUnknown>;
  }, z.core.$loose>>;
  counts: z.ZodNullable<z.ZodObject<{
    sources: z.ZodNumber;
    folders: z.ZodNumber;
    urls_selected: z.ZodNumber;
    urls_excluded: z.ZodNumber;
    urls_effective: z.ZodNumber;
  }, z.core.$strip>>;
  countsBySource: z.ZodRecord<z.ZodString, z.ZodNumber>;
}, z.core.$strip>;
type Source = z.infer<typeof sourceSchema>;
type SourceSearchResult = z.infer<typeof sourceSearchResultSchema>;
type SourceStatus = z.infer<typeof sourceStatusSchema>;
type Collection = z.infer<typeof collectionSchema>;
type CollectionRule = z.infer<typeof collectionRuleResponseSchema>;
//#endregion
export { ApiContract, ApiErrorResponse, ChatCitation, ChatConversation, ChatConversationCitation, ChatConversationDetailResponse, ChatConversationMessage, ChatConversationsListResponse, ChatResponse, Collection, CollectionRule, CrawlResult, CrawlRun, CrawlRunStatistics, CrawlRunType, GetRunQuery, GetRunResponse, ListRunResultsQuery, ListRunResultsResponse, ListRunsQuery, ListRunsResponse, ResultContentType, ScreenshotResponse, SdkSuccessResponse, SearchResponse, SearchResult, Source, SourceAnalysisResponse, SourceDocument, SourceSearchResult, SourceStatus, UpdateChatConversationResponse, apiContract, apiErrorResponseSchema, chatCitationSchema, chatConversationCitationSchema, chatConversationDetailResponseSchema, chatConversationMessageSchema, chatConversationSchema, chatConversationsListResponseSchema, chatResponseSchema, collectionListItemSchema, collectionRuleResponseSchema, collectionRulesResponseSchema, collectionSchema, crawlResultSchema, crawlRunSchema, crawlRunStatisticsSchema, crawlRunTypeSchema, getRunQuerySchema, getRunResponseSchema, listRunResultsQuerySchema, listRunResultsResponseSchema, listRunsQuerySchema, listRunsResponseSchema, resultContentTypeSchema, screenshotResponseSchema, sdkSuccessResponseSchema, searchResponseSchema, searchResultSchema, sourceAnalysisResponseSchema, sourceDetailSchema, sourceDocumentSchema, sourceListItemSchema, sourceSchema, sourceSearchResultSchema, sourceStatusSchema, updateChatConversationResponseSchema, updateCollectionRequestSchema };