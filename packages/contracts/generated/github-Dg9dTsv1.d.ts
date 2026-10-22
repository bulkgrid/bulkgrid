import { t as CrawlRunType } from "./index-C0RbIjwa.js";
import { z } from "zod";
//#region packages/schemas/src/crawlRuns.d.ts
declare const crawlRunFormatSchema: z.ZodEnum<{
  links: "links";
  markdown: "markdown";
  cleanHtml: "cleanHtml";
  rawHtml: "rawHtml";
}>;
declare const crawlRunStatusSchema: z.ZodEnum<{
  failed: "failed";
  pending: "pending";
  processing: "processing";
  completed: "completed";
  cancelled: "cancelled";
}>;
declare const crawlRunStrategySchema: z.ZodEnum<{
  lexical: "lexical";
  embedding: "embedding";
}>;
declare const crawlRunScreenshotSchema: z.ZodEnum<{
  screenshot: "screenshot";
  fullPageScreenshot: "fullPageScreenshot";
}>;
declare const crawlRunOptionsSchema: z.ZodObject<{
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
}, z.core.$strip>;
declare const smartCrawlConfigSchema: z.ZodObject<{
  maxDepth: z.ZodDefault<z.ZodNumber>;
  maxPages: z.ZodDefault<z.ZodNumber>;
  topKLinks: z.ZodDefault<z.ZodNumber>;
  minGainThreshold: z.ZodDefault<z.ZodNumber>;
  confidenceThreshold: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
declare const deepCrawlConfigSchema: z.ZodObject<{
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
}, z.core.$strip>;
declare const crawlRunRequestSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.CRAWL>;
  runId: z.ZodString;
  urls: z.ZodArray<z.ZodURL>;
  strategy: z.ZodOptional<z.ZodEnum<{
    lexical: "lexical";
    embedding: "embedding";
  }>>;
  config: z.ZodOptional<z.ZodObject<{
    maxDepth: z.ZodDefault<z.ZodNumber>;
    maxPages: z.ZodDefault<z.ZodNumber>;
    topKLinks: z.ZodDefault<z.ZodNumber>;
    minGainThreshold: z.ZodDefault<z.ZodNumber>;
    confidenceThreshold: z.ZodDefault<z.ZodNumber>;
  }, z.core.$strip>>;
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
declare const extractRunRequestSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.EXTRACT>;
  runId: z.ZodString;
  urls: z.ZodArray<z.ZodURL>;
  query: z.ZodString;
  schema: z.ZodRecord<z.ZodString, z.ZodAny>;
  maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
declare const deepCrawlRunRequestSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
  runId: z.ZodString;
  url: z.ZodURL;
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
declare const deepCrawlTaskTypeSchema: z.ZodEnum<{
  crawl: "crawl";
  seed: "seed";
}>;
declare const deepCrawlTaskRequestSchema: z.ZodObject<{
  taskType: z.ZodEnum<{
    crawl: "crawl";
    seed: "seed";
  }>;
  payload: z.ZodObject<{
    type: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
    runId: z.ZodString;
    url: z.ZodURL;
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
}, z.core.$strip>;
declare const cancelRunRequestSchema: z.ZodObject<{
  type: z.ZodLiteral<"cancel">;
  runId: z.ZodString;
}, z.core.$strip>;
declare const retryRunBodySchema: z.ZodObject<{
  urls: z.ZodOptional<z.ZodArray<z.ZodURL>>;
}, z.core.$strip>;
declare const mapRunRequestSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.MAP>;
  runId: z.ZodString;
  url: z.ZodURL;
  config: z.ZodDefault<z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    includeSubdomains: z.ZodDefault<z.ZodBoolean>;
    ignoreQueryParameters: z.ZodDefault<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strip>;
declare const crawlRunRequestUnionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.CRAWL>;
  runId: z.ZodString;
  urls: z.ZodArray<z.ZodURL>;
  strategy: z.ZodOptional<z.ZodEnum<{
    lexical: "lexical";
    embedding: "embedding";
  }>>;
  config: z.ZodOptional<z.ZodObject<{
    maxDepth: z.ZodDefault<z.ZodNumber>;
    maxPages: z.ZodDefault<z.ZodNumber>;
    topKLinks: z.ZodDefault<z.ZodNumber>;
    minGainThreshold: z.ZodDefault<z.ZodNumber>;
    confidenceThreshold: z.ZodDefault<z.ZodNumber>;
  }, z.core.$strip>>;
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
  type: z.ZodLiteral<CrawlRunType.EXTRACT>;
  runId: z.ZodString;
  urls: z.ZodArray<z.ZodURL>;
  query: z.ZodString;
  schema: z.ZodRecord<z.ZodString, z.ZodAny>;
  maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
  runId: z.ZodString;
  url: z.ZodURL;
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
  type: z.ZodLiteral<"cancel">;
  runId: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.MAP>;
  runId: z.ZodString;
  url: z.ZodURL;
  config: z.ZodDefault<z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    includeSubdomains: z.ZodDefault<z.ZodBoolean>;
    ignoreQueryParameters: z.ZodDefault<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strip>], "type">;
declare const extractResultSchema: z.ZodObject<{
  data: z.ZodRecord<z.ZodString, z.ZodAny>;
  sources_used: z.ZodArray<z.ZodString>;
  actions_taken: z.ZodArray<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>>>;
  confidence: z.ZodNumber;
  extraction_steps: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
declare const runResultSchema: z.ZodObject<{
  runId: z.ZodString;
  status: z.ZodEnum<{
    failed: "failed";
    completed: "completed";
  }>;
  result: z.ZodOptional<z.ZodUnknown>;
  error: z.ZodOptional<z.ZodObject<{
    message: z.ZodString;
    code: z.ZodString;
    stack: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  completedAt: z.ZodString;
  processingTime: z.ZodNumber;
}, z.core.$strip>;
declare const crawlRunStatusQuerySchema: z.ZodObject<{
  runId: z.ZodString;
}, z.core.$strip>;
declare const crawlRunInputSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.CRAWL>;
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
declare const extractRunInputSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.EXTRACT>;
  urls: z.ZodArray<z.ZodURL>;
  query: z.ZodString;
  schema: z.ZodRecord<z.ZodString, z.ZodAny>;
  maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
declare const deepCrawlRunInputSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
  url: z.ZodURL;
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
declare const mapRunInputSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.MAP>;
  url: z.ZodURL;
  config: z.ZodDefault<z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    includeSubdomains: z.ZodDefault<z.ZodBoolean>;
    ignoreQueryParameters: z.ZodDefault<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strip>;
declare const crawlRunInputUnionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.CRAWL>;
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
  type: z.ZodLiteral<CrawlRunType.EXTRACT>;
  urls: z.ZodArray<z.ZodURL>;
  query: z.ZodString;
  schema: z.ZodRecord<z.ZodString, z.ZodAny>;
  maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
  url: z.ZodURL;
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
  type: z.ZodLiteral<CrawlRunType.MAP>;
  url: z.ZodURL;
  config: z.ZodDefault<z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    includeSubdomains: z.ZodDefault<z.ZodBoolean>;
    ignoreQueryParameters: z.ZodDefault<z.ZodBoolean>;
    limit: z.ZodDefault<z.ZodNumber>;
    timeout: z.ZodDefault<z.ZodNumber>;
  }, z.core.$strict>>;
}, z.core.$strip>], "type">;
type CrawlRunInput = z.infer<typeof crawlRunInputSchema>;
type ExtractRunInput = z.infer<typeof extractRunInputSchema>;
type DeepCrawlRunInput = z.infer<typeof deepCrawlRunInputSchema>;
type MapRunInput = z.infer<typeof mapRunInputSchema>;
type MapRunRequest = z.infer<typeof mapRunRequestSchema>;
type CrawlRunInputUnion = z.infer<typeof crawlRunInputUnionSchema>;
type CrawlRunStatus = z.infer<typeof crawlRunStatusSchema>;
type SmartCrawlConfig = z.infer<typeof smartCrawlConfigSchema>;
type DeepCrawlConfig = z.infer<typeof deepCrawlConfigSchema>;
type CrawlRunRequest = z.infer<typeof crawlRunRequestSchema>;
type ExtractRunRequest = z.infer<typeof extractRunRequestSchema>;
type DeepCrawlRunRequest = z.infer<typeof deepCrawlRunRequestSchema>;
type DeepCrawlTaskType = z.infer<typeof deepCrawlTaskTypeSchema>;
type DeepCrawlTaskRequest = z.infer<typeof deepCrawlTaskRequestSchema>;
type CrawlRunRequestUnion = z.infer<typeof crawlRunRequestUnionSchema>;
type CancelRunRequest = z.infer<typeof cancelRunRequestSchema>;
type RunResult = z.infer<typeof runResultSchema>;
type ExtractResult = z.infer<typeof extractResultSchema>;
type CrawlRunOptions = z.infer<typeof crawlRunOptionsSchema>;
type CrawlRunStatusQuery = z.infer<typeof crawlRunStatusQuerySchema>;
type RetryRunBody = z.infer<typeof retryRunBodySchema>;
/** Read both legacy nested and current flat persisted deep-crawl configuration. */
declare function readDeepCrawlConfig(value: unknown): {
  config: Record<string, unknown>;
  options: unknown;
};
//#endregion
//#region packages/schemas/src/map.d.ts
declare const mapUrlSchema: z.ZodURL;
declare const mapOptionsSchema: z.ZodObject<{
  search: z.ZodOptional<z.ZodString>;
  includeSubdomains: z.ZodDefault<z.ZodBoolean>;
  ignoreQueryParameters: z.ZodDefault<z.ZodBoolean>;
  limit: z.ZodDefault<z.ZodNumber>;
  timeout: z.ZodDefault<z.ZodNumber>;
}, z.core.$strict>;
declare const mapLinkSchema: z.ZodObject<{
  url: z.ZodURL;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const mapResultSchema: z.ZodObject<{
  success: z.ZodLiteral<true>;
  links: z.ZodArray<z.ZodObject<{
    url: z.ZodURL;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  warnings: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
type MapOptions = z.input<typeof mapOptionsSchema>;
type MapLink = z.infer<typeof mapLinkSchema>;
type MapResult = z.infer<typeof mapResultSchema>;
//#endregion
//#region packages/schemas/src/search.d.ts
declare const hybridSearchDefaultConfig: {
  results: {
    default: number;
    min: number;
    max: number;
  };
  rrfK: {
    default: number;
    min: number;
    max: number;
  };
  semanticWeight: {
    default: number;
    min: number;
    max: number;
  };
  fullTextWeight: {
    default: number;
    min: number;
    max: number;
  };
  queryVariants: {
    max: number;
  };
};
declare const searchQueryModeSchema: z.ZodEnum<{
  none: "none";
  auto: "auto";
}>;
type SearchQueryMode = z.infer<typeof searchQueryModeSchema>;
declare const searchInputSchema: z.ZodObject<{
  query: z.ZodString;
  queries: z.ZodOptional<z.ZodArray<z.ZodString>>;
  queryMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    none: "none";
    auto: "auto";
  }>>>;
  limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  collectionId: z.ZodOptional<z.ZodUUID>;
  sourceIds: z.ZodOptional<z.ZodArray<z.ZodUUID>>;
  fullTextWeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  semanticWeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  rrfK: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strict>;
type SearchInput = z.infer<typeof searchInputSchema>;
type SearchInputPayload = z.input<typeof searchInputSchema>;
declare const searchMcpToolDefaultConfig: {
  results: {
    default: number;
    min: number;
    max: number;
  };
  semanticWeight: {
    default: number;
    min: number;
    max: number;
  };
  fullTextWeight: {
    default: number;
    min: number;
    max: number;
  };
  queryVariants: {
    max: number;
  };
};
declare const mcpSearchInputSchema: z.ZodObject<{
  query: z.ZodString;
  queryMode: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    none: "none";
    auto: "auto";
  }>>>;
  fullTextWeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  semanticWeight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  queries: z.ZodOptional<z.ZodArray<z.ZodString>>;
  collectionId: z.ZodOptional<z.ZodUUID>;
  sourceIds: z.ZodOptional<z.ZodArray<z.ZodUUID>>;
}, z.core.$strict>;
type McpSearchInput = z.infer<typeof mcpSearchInputSchema>;
type McpSearchInputPayload = z.input<typeof mcpSearchInputSchema>;
//#endregion
//#region packages/schemas/src/webSearch.d.ts
declare const webSearchCrawlOptionsSchema: z.ZodObject<{
  screenshot: z.ZodOptional<z.ZodEnum<{
    screenshot: "screenshot";
    fullPageScreenshot: "fullPageScreenshot";
  }>>;
  waitAfterLoad: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  timeout: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
  includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
  excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
  useHttp: z.ZodOptional<z.ZodBoolean>;
  useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
  removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
  formats: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<{
    links: "links";
    markdown: "markdown";
    cleanHtml: "cleanHtml";
    rawHtml: "rawHtml";
  }>>>>;
  blockAds: z.ZodDefault<z.ZodBoolean>;
  useInteractions: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  waitForSelector: z.ZodOptional<z.ZodString>;
  waitForImages: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strict>;
declare const webSearchInputSchema: z.ZodObject<{
  query: z.ZodString;
  type: z.ZodDefault<z.ZodEnum<{
    web: "web";
    images: "images";
    news: "news";
  }>>;
  limit: z.ZodDefault<z.ZodNumber>;
  country: z.ZodDefault<z.ZodString>;
  language: z.ZodDefault<z.ZodString>;
  location: z.ZodOptional<z.ZodString>;
  crawl: z.ZodDefault<z.ZodBoolean>;
  crawlOptions: z.ZodOptional<z.ZodObject<{
    screenshot: z.ZodOptional<z.ZodEnum<{
      screenshot: "screenshot";
      fullPageScreenshot: "fullPageScreenshot";
    }>>;
    waitAfterLoad: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    timeout: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    useHttp: z.ZodOptional<z.ZodBoolean>;
    useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
    removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
    formats: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<{
      links: "links";
      markdown: "markdown";
      cleanHtml: "cleanHtml";
      rawHtml: "rawHtml";
    }>>>>;
    blockAds: z.ZodDefault<z.ZodBoolean>;
    useInteractions: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    waitForSelector: z.ZodOptional<z.ZodString>;
    waitForImages: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
  }, z.core.$strict>>;
}, z.core.$strict>;
declare const webSearchResultSchema: z.ZodObject<{
  url: z.ZodURL;
  title: z.ZodString;
  snippet: z.ZodString;
  position: z.ZodNumber;
}, z.core.$strip>;
declare const imageSearchResultSchema: z.ZodObject<{
  title: z.ZodString;
  url: z.ZodURL;
  imageUrl: z.ZodURL;
  imageWidth: z.ZodNullable<z.ZodNumber>;
  imageHeight: z.ZodNullable<z.ZodNumber>;
  thumbnailUrl: z.ZodNullable<z.ZodURL>;
  position: z.ZodNumber;
}, z.core.$strip>;
declare const newsSearchResultSchema: z.ZodObject<{
  url: z.ZodURL;
  title: z.ZodString;
  snippet: z.ZodString;
  position: z.ZodNumber;
  source: z.ZodNullable<z.ZodString>;
  date: z.ZodNullable<z.ZodString>;
  imageUrl: z.ZodNullable<z.ZodURL>;
}, z.core.$strip>;
declare const webSearchDataSchema: z.ZodObject<{
  query: z.ZodString;
  count: z.ZodNumber;
  warnings: z.ZodOptional<z.ZodArray<z.ZodString>>;
  type: z.ZodLiteral<"web">;
  results: z.ZodArray<z.ZodObject<{
    url: z.ZodURL;
    title: z.ZodString;
    snippet: z.ZodString;
    position: z.ZodNumber;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const imageSearchDataSchema: z.ZodObject<{
  query: z.ZodString;
  count: z.ZodNumber;
  warnings: z.ZodOptional<z.ZodArray<z.ZodString>>;
  type: z.ZodLiteral<"images">;
  results: z.ZodArray<z.ZodObject<{
    title: z.ZodString;
    url: z.ZodURL;
    imageUrl: z.ZodURL;
    imageWidth: z.ZodNullable<z.ZodNumber>;
    imageHeight: z.ZodNullable<z.ZodNumber>;
    thumbnailUrl: z.ZodNullable<z.ZodURL>;
    position: z.ZodNumber;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const newsSearchDataSchema: z.ZodObject<{
  query: z.ZodString;
  count: z.ZodNumber;
  warnings: z.ZodOptional<z.ZodArray<z.ZodString>>;
  type: z.ZodLiteral<"news">;
  results: z.ZodArray<z.ZodObject<{
    url: z.ZodURL;
    title: z.ZodString;
    snippet: z.ZodString;
    position: z.ZodNumber;
    source: z.ZodNullable<z.ZodString>;
    date: z.ZodNullable<z.ZodString>;
    imageUrl: z.ZodNullable<z.ZodURL>;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const searchResultDataSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  query: z.ZodString;
  count: z.ZodNumber;
  warnings: z.ZodOptional<z.ZodArray<z.ZodString>>;
  type: z.ZodLiteral<"web">;
  results: z.ZodArray<z.ZodObject<{
    url: z.ZodURL;
    title: z.ZodString;
    snippet: z.ZodString;
    position: z.ZodNumber;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  query: z.ZodString;
  count: z.ZodNumber;
  warnings: z.ZodOptional<z.ZodArray<z.ZodString>>;
  type: z.ZodLiteral<"images">;
  results: z.ZodArray<z.ZodObject<{
    title: z.ZodString;
    url: z.ZodURL;
    imageUrl: z.ZodURL;
    imageWidth: z.ZodNullable<z.ZodNumber>;
    imageHeight: z.ZodNullable<z.ZodNumber>;
    thumbnailUrl: z.ZodNullable<z.ZodURL>;
    position: z.ZodNumber;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  query: z.ZodString;
  count: z.ZodNumber;
  warnings: z.ZodOptional<z.ZodArray<z.ZodString>>;
  type: z.ZodLiteral<"news">;
  results: z.ZodArray<z.ZodObject<{
    url: z.ZodURL;
    title: z.ZodString;
    snippet: z.ZodString;
    position: z.ZodNumber;
    source: z.ZodNullable<z.ZodString>;
    date: z.ZodNullable<z.ZodString>;
    imageUrl: z.ZodNullable<z.ZodURL>;
  }, z.core.$strip>>;
}, z.core.$strip>], "type">;
declare function searchCrawlOptions(request: WebSearchRequest): {
  formats: ("links" | "markdown" | "cleanHtml" | "rawHtml")[];
  waitAfterLoad: number;
  timeout: number;
  blockAds: boolean;
  useInteractions: boolean;
  waitForImages: boolean;
  includeDocumentLinks: boolean;
  includeTags?: string[];
  excludeTags?: string[];
  headers?: Record<string, string>;
  waitForSelector?: string;
  removeConsentPopups?: boolean;
  screenshot?: "screenshot" | "fullPageScreenshot";
  useHttp?: boolean;
  useLlmsTxt?: boolean;
};
type SearchResultData = z.infer<typeof searchResultDataSchema>;
type WebSearchInput = z.input<typeof webSearchInputSchema>;
type WebSearchRequest = z.output<typeof webSearchInputSchema>;
type WebSearchResult = z.infer<typeof webSearchResultSchema>;
type ImageSearchResult = z.infer<typeof imageSearchResultSchema>;
type NewsSearchResult = z.infer<typeof newsSearchResultSchema>;
//#endregion
//#region packages/schemas/src/extractSchemaGeneration.d.ts
declare const extractSchemaGenerationRequestSchema: z.ZodObject<{
  query: z.ZodString;
  context: z.ZodOptional<z.ZodString>;
  allowNulls: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
declare const extractSchemaGenerationResponseSchemaBase: z.ZodObject<{
  schema: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"object">;
    properties: z.ZodObject<{}, z.core.$loose>;
    required: z.ZodArray<z.ZodString>;
    additionalProperties: z.ZodBoolean;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"array">;
    items: z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodObject<{}, z.core.$loose>;
      required: z.ZodArray<z.ZodString>;
      additionalProperties: z.ZodBoolean;
    }, z.core.$strip>;
  }, z.core.$strip>]>;
  notes: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
declare const extractSchemaGenerationResponseSchema: z.ZodObject<{
  schema: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"object">;
    properties: z.ZodObject<{}, z.core.$loose>;
    required: z.ZodArray<z.ZodString>;
    additionalProperties: z.ZodBoolean;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"array">;
    items: z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodObject<{}, z.core.$loose>;
      required: z.ZodArray<z.ZodString>;
      additionalProperties: z.ZodBoolean;
    }, z.core.$strip>;
  }, z.core.$strip>]>;
  notes: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type ExtractSchemaGenerationRequest = z.infer<typeof extractSchemaGenerationRequestSchema>;
type ExtractSchemaGenerationResponse = z.infer<typeof extractSchemaGenerationResponseSchemaBase>;
//#endregion
//#region packages/schemas/src/sources.d.ts
declare const sourceCanonicalUrlSchema: z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodURL>, z.ZodTransform<string, string>>;
declare const sourceCrawlOptionsSchema: z.ZodObject<{
  waitAfterLoad: z.ZodOptional<z.ZodNumber>;
  timeout: z.ZodOptional<z.ZodNumber>;
  includeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
  excludeTags: z.ZodOptional<z.ZodArray<z.ZodString>>;
  useHttp: z.ZodOptional<z.ZodBoolean>;
  useLlmsTxt: z.ZodOptional<z.ZodBoolean>;
  removeConsentPopups: z.ZodOptional<z.ZodBoolean>;
  includeDocumentLinks: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const sourceDeepCrawlConfigSchema: z.ZodObject<{
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
}, z.core.$strip>;
declare const sourceDiscoverRequestSchema: z.ZodObject<{
  url: z.ZodString;
  requestId: z.ZodOptional<z.ZodString>;
  includePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
  excludePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
declare const sourceDiscoveryAnalysisCreateSchema: z.ZodObject<{
  url: z.ZodString;
  sourceId: z.ZodOptional<z.ZodUUID>;
}, z.core.$strip>;
declare const sourceDiscoverRecommendationSchema: z.ZodObject<{
  path: z.ZodString;
  recommendedAction: z.ZodEnum<{
    include: "include";
    exclude: "exclude";
    neutral: "neutral";
  }>;
  confidence: z.ZodNumber;
  reason: z.ZodString;
}, z.core.$strip>;
declare const sourceDiscoverRecommendRequestSchema: z.ZodObject<{
  url: z.ZodString;
  requestId: z.ZodOptional<z.ZodString>;
  includePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
  excludePaths: z.ZodOptional<z.ZodArray<z.ZodString>>;
  prompt: z.ZodString;
  analysisId: z.ZodOptional<z.ZodUUID>;
}, z.core.$strip>;
declare const sourceDiscoverRecommendResponseSchema: z.ZodObject<{
  recommendations: z.ZodArray<z.ZodObject<{
    path: z.ZodString;
    recommendedAction: z.ZodEnum<{
      include: "include";
      exclude: "exclude";
      neutral: "neutral";
    }>;
    confidence: z.ZodNumber;
    reason: z.ZodString;
  }, z.core.$strip>>;
  notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
declare const createSourceSchema: z.ZodObject<{
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
    hourly: "hourly";
    daily: "daily";
    weekly: "weekly";
    monthly: "monthly";
    custom: "custom";
  }>>;
  custom_interval_minutes: z.ZodOptional<z.ZodNumber>;
  analysis_id: z.ZodOptional<z.ZodUUID>;
}, z.core.$strip>;
declare const updateSourceSchema: z.ZodObject<{
  label: z.ZodOptional<z.ZodNullable<z.ZodString>>;
  canonical_url: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodURL>, z.ZodTransform<string, string>>>>;
  metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodJSONSchema>>;
  source_mode: z.ZodOptional<z.ZodEnum<{
    discover: "discover";
    selected_pages: "selected_pages";
  }>>;
  crawl_interval: z.ZodOptional<z.ZodNullable<z.ZodEnum<{
    hourly: "hourly";
    daily: "daily";
    weekly: "weekly";
    monthly: "monthly";
    custom: "custom";
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
declare const sourceDeepCrawlRequestSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
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
  config: z.ZodOptional<z.ZodObject<{
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
  runType: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
  sourceId: z.ZodUUID;
  crawlType: z.ZodOptional<z.ZodEnum<{
    initial: "initial";
    manual: "manual";
    scheduled: "scheduled";
  }>>;
}, z.core.$strip>;
declare const sourceCrawlRequestSchema: z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.CRAWL>;
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
  runType: z.ZodLiteral<CrawlRunType.CRAWL>;
  sourceId: z.ZodUUID;
  crawlType: z.ZodOptional<z.ZodEnum<{
    initial: "initial";
    manual: "manual";
    scheduled: "scheduled";
  }>>;
}, z.core.$strip>;
declare const sourceCrawlRequestUnionSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
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
  config: z.ZodOptional<z.ZodObject<{
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
  runType: z.ZodLiteral<CrawlRunType.DEEP_CRAWL>;
  sourceId: z.ZodUUID;
  crawlType: z.ZodOptional<z.ZodEnum<{
    initial: "initial";
    manual: "manual";
    scheduled: "scheduled";
  }>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<CrawlRunType.CRAWL>;
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
  runType: z.ZodLiteral<CrawlRunType.CRAWL>;
  sourceId: z.ZodUUID;
  crawlType: z.ZodOptional<z.ZodEnum<{
    initial: "initial";
    manual: "manual";
    scheduled: "scheduled";
  }>>;
}, z.core.$strip>], "runType">;
type SourceDiscoverRequest = z.infer<typeof sourceDiscoverRequestSchema>;
type SourceDiscoveryAnalysisCreate = z.infer<typeof sourceDiscoveryAnalysisCreateSchema>;
type SourceDiscoverRecommendation = z.infer<typeof sourceDiscoverRecommendationSchema>;
type SourceDiscoverRecommendRequest = z.infer<typeof sourceDiscoverRecommendRequestSchema>;
type SourceDiscoverRecommendResponse = z.infer<typeof sourceDiscoverRecommendResponseSchema>;
type CreateSourceInput = z.infer<typeof createSourceSchema>;
type SourceDeepCrawlRequest = z.infer<typeof sourceDeepCrawlRequestSchema>;
type SourceCrawlRequest = z.infer<typeof sourceCrawlRequestSchema>;
type SourceCrawlRequestUnion = z.infer<typeof sourceCrawlRequestUnionSchema>;
//#endregion
//#region packages/schemas/src/collections.d.ts
declare const createCollectionSchema: z.ZodObject<{
  workspace_id: z.ZodOptional<z.ZodUUID>;
  name: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  metadata: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
declare const linkCollectionSourceSchema: z.ZodObject<{
  workspace_id: z.ZodOptional<z.ZodUUID>;
  collection_id: z.ZodUUID;
  source_id: z.ZodUUID;
  crawl_config_override: z.ZodOptional<z.ZodAny>;
  tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
declare const linkCollectionDocumentsSchema: z.ZodObject<{
  workspace_id: z.ZodOptional<z.ZodUUID>;
  collection_id: z.ZodUUID;
  source_document_ids: z.ZodArray<z.ZodUUID>;
  rule: z.ZodOptional<z.ZodEnum<{
    include: "include";
    exclude: "exclude";
  }>>;
  metadata: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
declare const linkCollectionFolderSchema: z.ZodObject<{
  workspace_id: z.ZodOptional<z.ZodUUID>;
  collection_id: z.ZodUUID;
  source_id: z.ZodUUID;
  folder_path: z.ZodString;
  rule: z.ZodOptional<z.ZodEnum<{
    include: "include";
    exclude: "exclude";
  }>>;
  metadata: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
declare const collectionRuleSchema: z.ZodObject<{
  action: z.ZodEnum<{
    include: "include";
    exclude: "exclude";
  }>;
  target: z.ZodEnum<{
    source: "source";
    folder: "folder";
    url: "url";
  }>;
  source_id: z.ZodUUID;
  target_id: z.ZodString;
  metadata: z.ZodOptional<z.ZodAny>;
}, z.core.$strip>;
declare const collectionRulesPatchSchema: z.ZodObject<{
  add: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
    action: z.ZodEnum<{
      include: "include";
      exclude: "exclude";
    }>;
    target: z.ZodEnum<{
      source: "source";
      folder: "folder";
      url: "url";
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
      source: "source";
      folder: "folder";
      url: "url";
    }>;
    source_id: z.ZodUUID;
    target_id: z.ZodString;
    metadata: z.ZodOptional<z.ZodAny>;
  }, z.core.$strip>>>>;
}, z.core.$strip>;
type CreateCollectionInput = z.infer<typeof createCollectionSchema>;
type LinkCollectionSourceInput = z.infer<typeof linkCollectionSourceSchema>;
type LinkCollectionDocumentsInput = z.infer<typeof linkCollectionDocumentsSchema>;
type LinkCollectionFolderInput = z.infer<typeof linkCollectionFolderSchema>;
type CollectionRuleInput = z.infer<typeof collectionRuleSchema>;
type CollectionRulesPatchInput = z.infer<typeof collectionRulesPatchSchema>;
//#endregion
//#region packages/schemas/src/chat.d.ts
declare const chatMessageRoleSchema: z.ZodEnum<{
  user: "user";
  assistant: "assistant";
  system: "system";
}>;
declare const googleLanguageModels: readonly ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
declare const googleEmbeddingModels: readonly ["gemini-embedding-001"];
declare const openAiLanguageModels: readonly ["gpt-5.4-nano", "gpt-5.5"];
declare const allowedChatModels: readonly ["gemini-2.5-flash", "gpt-5.4-nano", "gpt-5.5"];
declare const defaultChatModel: "gpt-5.5";
declare const chatModelSchema: z.ZodEnum<{
  "gemini-2.5-flash": "gemini-2.5-flash";
  "gpt-5.4-nano": "gpt-5.4-nano";
  "gpt-5.5": "gpt-5.5";
}>;
declare const chatModelContextWindowTokens: Readonly<Record<(typeof allowedChatModels)[number], number>>;
declare const chatMessageSchema: z.ZodObject<{
  role: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
    system: "system";
  }>;
  content: z.ZodString;
}, z.core.$strict>;
declare const chatInputSchema: z.ZodObject<{
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
declare const createChatConversationInputSchema: z.ZodObject<{
  title: z.ZodOptional<z.ZodString>;
}, z.core.$strict>;
declare const updateChatConversationInputSchema: z.ZodObject<{
  title: z.ZodString;
}, z.core.$strict>;
type ChatInput = z.infer<typeof chatInputSchema>;
type ChatInputPayload = z.input<typeof chatInputSchema>;
type ChatMessage = z.infer<typeof chatMessageSchema>;
type ChatModel = z.infer<typeof chatModelSchema>;
type CreateChatConversationInput = z.infer<typeof createChatConversationInputSchema>;
type UpdateChatConversationInput = z.infer<typeof updateChatConversationInputSchema>;
type GoogleLanguageModel = (typeof googleLanguageModels)[number];
type GoogleEmbeddingModel = (typeof googleEmbeddingModels)[number];
type OpenAiLanguageModel = (typeof openAiLanguageModels)[number];
declare function resolveChatModelContextWindowTokens(model: ChatModel): number;
//#endregion
//#region packages/schemas/src/github.d.ts
declare const githubRepositorySchema: z.ZodObject<{
  owner: z.ZodString;
  repo: z.ZodString;
}, z.core.$strip>;
declare const githubRepositoryMetadataSchema: z.ZodObject<{
  id: z.ZodNumber;
  owner: z.ZodString;
  name: z.ZodString;
  fullName: z.ZodString;
  defaultBranch: z.ZodString;
  visibility: z.ZodString;
  description: z.ZodNullable<z.ZodString>;
  url: z.ZodURL;
}, z.core.$strip>;
declare const githubRepositoryUrlSchema: z.ZodPipe<z.ZodPipe<z.ZodURL, z.ZodTransform<URL, string>>, z.ZodTransform<{
  owner: string;
  repo: string;
}, URL>>;
declare const githubSourceInitializeCommandSchema: z.ZodObject<{
  type: z.ZodLiteral<"initialize">;
  runId: z.ZodUUID;
  sourceId: z.ZodUUID;
}, z.core.$strip>;
declare const githubSyncCommandSchema: z.ZodObject<{
  type: z.ZodLiteral<"sync">;
  jobId: z.ZodUUID;
}, z.core.$strip>;
declare const githubCommandSchema: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<"initialize">;
  runId: z.ZodUUID;
  sourceId: z.ZodUUID;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"sync">;
  jobId: z.ZodUUID;
}, z.core.$strip>], "type">, z.ZodPipe<z.ZodObject<{
  jobId: z.ZodUUID;
}, z.core.$strip>, z.ZodTransform<{
  type: "sync";
  jobId: string;
}, {
  jobId: string;
}>>]>;
declare const githubSourceInitializationRunConfigSchema: z.ZodObject<{
  provider: z.ZodLiteral<"github">;
  phase: z.ZodLiteral<"initialize">;
  repository: z.ZodObject<{
    owner: z.ZodString;
    repo: z.ZodString;
  }, z.core.$strip>;
  selectedRef: z.ZodNullable<z.ZodString>;
  includePaths: z.ZodArray<z.ZodString>;
  excludePaths: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
declare const githubSourceAnalyzeRequestSchema: z.ZodObject<{
  connection_id: z.ZodOptional<z.ZodUUID>;
  workspace_id: z.ZodOptional<z.ZodUUID>;
  repositoryUrl: z.ZodPipe<z.ZodPipe<z.ZodURL, z.ZodTransform<URL, string>>, z.ZodTransform<{
    owner: string;
    repo: string;
  }, URL>>;
  ref: z.ZodOptional<z.ZodString>;
  suggestPaths: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const githubLatestReleaseSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  status: z.ZodLiteral<"available">;
  tag: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
  status: z.ZodLiteral<"none">;
}, z.core.$strip>, z.ZodObject<{
  status: z.ZodLiteral<"unavailable">;
}, z.core.$strip>], "status">;
declare const githubSourceAnalysisResultSchema: z.ZodObject<{
  label: z.ZodString;
  ref: z.ZodString;
  includePaths: z.ZodArray<z.ZodString>;
  excludePaths: z.ZodArray<z.ZodString>;
  confidence: z.ZodNumber;
  notes: z.ZodNullable<z.ZodString>;
  fileCount: z.ZodNumber;
  defaultBranch: z.ZodString;
  latestRelease: z.ZodDiscriminatedUnion<[z.ZodObject<{
    status: z.ZodLiteral<"available">;
    tag: z.ZodString;
  }, z.core.$strip>, z.ZodObject<{
    status: z.ZodLiteral<"none">;
  }, z.core.$strip>, z.ZodObject<{
    status: z.ZodLiteral<"unavailable">;
  }, z.core.$strip>], "status">;
  files: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
declare const githubSyncBatchJobSchema: z.ZodObject<{
  jobId: z.ZodUUID;
  batchId: z.ZodUUID;
}, z.core.$strip>;
declare const githubSourceCreateRequestSchema: z.ZodObject<{
  visibility: z.ZodDefault<z.ZodEnum<{
    public: "public";
    private: "private";
  }>>;
  public_source_id: z.ZodOptional<z.ZodUUID>;
  connection_id: z.ZodOptional<z.ZodUUID>;
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
type GithubRepository = z.infer<typeof githubRepositorySchema>;
type GithubRepositoryMetadata = z.infer<typeof githubRepositoryMetadataSchema>;
type GithubSourceInitializeCommand = z.infer<typeof githubSourceInitializeCommandSchema>;
type GithubSyncCommand = z.infer<typeof githubSyncCommandSchema>;
type GithubCommand = z.infer<typeof githubCommandSchema>;
type GithubSourceInitializationRunConfig = z.infer<typeof githubSourceInitializationRunConfigSchema>;
type GithubSourceAnalyzeRequest = z.infer<typeof githubSourceAnalyzeRequestSchema>;
type GithubSourceAnalysisResult = z.infer<typeof githubSourceAnalysisResultSchema>;
type GithubSyncBatchJob = z.infer<typeof githubSyncBatchJobSchema>;
type GithubSourceCreateRequest = z.infer<typeof githubSourceCreateRequestSchema>;
declare const githubConnectionRepositorySchema: z.ZodObject<{
  id: z.ZodNumber;
  fullName: z.ZodString;
  private: z.ZodBoolean;
}, z.core.$strip>;
declare const githubConnectionSchema: z.ZodObject<{
  id: z.ZodUUID;
  workspace_id: z.ZodUUID;
  installation_id: z.ZodNumber;
  repositories: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    fullName: z.ZodString;
    private: z.ZodBoolean;
  }, z.core.$strip>>;
  revoked_at: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
type GithubConnection = z.infer<typeof githubConnectionSchema>;
//#endregion
export { LinkCollectionSourceInput as $, readDeepCrawlConfig as $n, hybridSearchDefaultConfig as $t, CreateChatConversationInput as A, RunResult as An, extractSchemaGenerationRequestSchema as At, chatModelSchema as B, crawlRunStatusQuerySchema as Bn, newsSearchDataSchema as Bt, githubSourceInitializeCommandSchema as C, DeepCrawlTaskType as Cn, sourceDiscoverRecommendResponseSchema as Ct, ChatInputPayload as D, MapRunInput as Dn, updateSourceSchema as Dt, ChatInput as E, ExtractRunRequest as En, sourceDiscoveryAnalysisCreateSchema as Et, allowedChatModels as F, crawlRunInputUnionSchema as Fn, WebSearchInput as Ft, openAiLanguageModels as G, deepCrawlRunRequestSchema as Gn, webSearchDataSchema as Gt, defaultChatModel as H, crawlRunStrategySchema as Hn, searchCrawlOptions as Ht, chatInputSchema as I, crawlRunOptionsSchema as In, WebSearchRequest as It, CollectionRuleInput as J, extractResultSchema as Jn, McpSearchInput as Jt, resolveChatModelContextWindowTokens as K, deepCrawlTaskRequestSchema as Kn, webSearchInputSchema as Kt, chatMessageRoleSchema as L, crawlRunRequestSchema as Ln, WebSearchResult as Lt, GoogleLanguageModel as M, cancelRunRequestSchema as Mn, ImageSearchResult as Mt, OpenAiLanguageModel as N, crawlRunFormatSchema as Nn, NewsSearchResult as Nt, ChatMessage as O, MapRunRequest as On, ExtractSchemaGenerationRequest as Ot, UpdateChatConversationInput as P, crawlRunInputSchema as Pn, SearchResultData as Pt, LinkCollectionFolderInput as Q, mapRunRequestSchema as Qn, SearchQueryMode as Qt, chatMessageSchema as R, crawlRunRequestUnionSchema as Rn, imageSearchDataSchema as Rt, githubSourceInitializationRunConfigSchema as S, DeepCrawlTaskRequest as Sn, sourceDiscoverRecommendRequestSchema as St, githubSyncCommandSchema as T, ExtractRunInput as Tn, sourceDiscoverRequestSchema as Tt, googleEmbeddingModels as U, deepCrawlConfigSchema as Un, searchResultDataSchema as Ut, createChatConversationInputSchema as V, crawlRunStatusSchema as Vn, newsSearchResultSchema as Vt, googleLanguageModels as W, deepCrawlRunInputSchema as Wn, webSearchCrawlOptionsSchema as Wt, CreateCollectionInput as X, extractRunRequestSchema as Xn, SearchInput as Xt, CollectionRulesPatchInput as Y, extractRunInputSchema as Yn, McpSearchInputPayload as Yt, LinkCollectionDocumentsInput as Z, mapRunInputSchema as Zn, SearchInputPayload as Zt, githubRepositorySchema as _, CrawlRunStatus as _n, sourceCrawlOptionsSchema as _t, GithubSourceAnalysisResult as a, MapOptions as an, linkCollectionSourceSchema as at, githubSourceAnalyzeRequestSchema as b, DeepCrawlRunInput as bn, sourceDeepCrawlConfigSchema as bt, GithubSourceInitializationRunConfig as c, mapOptionsSchema as cn, SourceCrawlRequestUnion as ct, GithubSyncCommand as d, CancelRunRequest as dn, SourceDiscoverRecommendResponse as dt, mcpSearchInputSchema as en, retryRunBodySchema as er, collectionRuleSchema as et, githubCommandSchema as f, CrawlRunInput as fn, SourceDiscoverRecommendation as ft, githubRepositoryMetadataSchema as g, CrawlRunRequestUnion as gn, sourceCanonicalUrlSchema as gt, githubLatestReleaseSchema as h, CrawlRunRequest as hn, createSourceSchema as ht, GithubRepositoryMetadata as i, MapLink as in, linkCollectionFolderSchema as it, GoogleEmbeddingModel as j, SmartCrawlConfig as jn, extractSchemaGenerationResponseSchema as jt, ChatModel as k, RetryRunBody as kn, ExtractSchemaGenerationResponse as kt, GithubSourceInitializeCommand as l, mapResultSchema as ln, SourceDeepCrawlRequest as lt, githubConnectionSchema as m, CrawlRunOptions as mn, SourceDiscoveryAnalysisCreate as mt, GithubConnection as n, searchMcpToolDefaultConfig as nn, smartCrawlConfigSchema as nr, createCollectionSchema as nt, GithubSourceAnalyzeRequest as o, MapResult as on, CreateSourceInput as ot, githubConnectionRepositorySchema as p, CrawlRunInputUnion as pn, SourceDiscoverRequest as pt, updateChatConversationInputSchema as q, deepCrawlTaskTypeSchema as qn, webSearchResultSchema as qt, GithubRepository as r, searchQueryModeSchema as rn, linkCollectionDocumentsSchema as rt, GithubSourceCreateRequest as s, mapLinkSchema as sn, SourceCrawlRequest as st, GithubCommand as t, searchInputSchema as tn, runResultSchema as tr, collectionRulesPatchSchema as tt, GithubSyncBatchJob as u, mapUrlSchema as un, SourceDiscoverRecommendRequest as ut, githubRepositoryUrlSchema as v, CrawlRunStatusQuery as vn, sourceCrawlRequestSchema as vt, githubSyncBatchJobSchema as w, ExtractResult as wn, sourceDiscoverRecommendationSchema as wt, githubSourceCreateRequestSchema as x, DeepCrawlRunRequest as xn, sourceDeepCrawlRequestSchema as xt, githubSourceAnalysisResultSchema as y, DeepCrawlConfig as yn, sourceCrawlRequestUnionSchema as yt, chatModelContextWindowTokens as z, crawlRunScreenshotSchema as zn, imageSearchResultSchema as zt };