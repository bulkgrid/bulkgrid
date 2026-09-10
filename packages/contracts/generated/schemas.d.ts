import { t as CrawlRunType } from "./index-BFguMy8c.js";
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
type CrawlRunInput = z.infer<typeof crawlRunInputSchema>;
type ExtractRunInput = z.infer<typeof extractRunInputSchema>;
type DeepCrawlRunInput = z.infer<typeof deepCrawlRunInputSchema>;
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
}, z.core.$strict>;
type McpSearchInput = z.infer<typeof mcpSearchInputSchema>;
type McpSearchInputPayload = z.input<typeof mcpSearchInputSchema>;
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
    custom: "custom";
    hourly: "hourly";
    daily: "daily";
    weekly: "weekly";
    monthly: "monthly";
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
  workspace_id: z.ZodOptional<z.ZodUUID>;
  repositoryUrl: z.ZodPipe<z.ZodPipe<z.ZodURL, z.ZodTransform<URL, string>>, z.ZodTransform<{
    owner: string;
    repo: string;
  }, URL>>;
  ref: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const githubSourceAnalysisResultSchema: z.ZodObject<{
  label: z.ZodString;
  ref: z.ZodString;
  includePaths: z.ZodArray<z.ZodString>;
  excludePaths: z.ZodArray<z.ZodString>;
  confidence: z.ZodNumber;
  notes: z.ZodNullable<z.ZodString>;
  fileCount: z.ZodNumber;
}, z.core.$strip>;
declare const githubSyncBatchJobSchema: z.ZodObject<{
  jobId: z.ZodUUID;
  batchId: z.ZodUUID;
}, z.core.$strip>;
declare const githubSourceCreateRequestSchema: z.ZodObject<{
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
    url: "url";
    source: "source";
    folder: "folder";
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
export { CancelRunRequest, ChatInput, ChatInputPayload, ChatMessage, ChatModel, CollectionRuleInput, CollectionRulesPatchInput, CrawlRunInput, CrawlRunInputUnion, CrawlRunOptions, CrawlRunRequest, CrawlRunRequestUnion, CrawlRunStatus, CrawlRunStatusQuery, CreateChatConversationInput, CreateCollectionInput, CreateSourceInput, DeepCrawlConfig, DeepCrawlRunInput, DeepCrawlRunRequest, DeepCrawlTaskRequest, DeepCrawlTaskType, ExtractResult, ExtractRunInput, ExtractRunRequest, ExtractSchemaGenerationRequest, ExtractSchemaGenerationResponse, GithubCommand, GithubRepository, GithubRepositoryMetadata, GithubSourceAnalysisResult, GithubSourceAnalyzeRequest, GithubSourceCreateRequest, GithubSourceInitializationRunConfig, GithubSourceInitializeCommand, GithubSyncBatchJob, GithubSyncCommand, GoogleEmbeddingModel, GoogleLanguageModel, LinkCollectionDocumentsInput, LinkCollectionFolderInput, LinkCollectionSourceInput, McpSearchInput, McpSearchInputPayload, OpenAiLanguageModel, RetryRunBody, RunResult, SearchInput, SearchInputPayload, SearchQueryMode, SmartCrawlConfig, SourceCrawlRequest, SourceCrawlRequestUnion, SourceDeepCrawlRequest, SourceDiscoverRecommendRequest, SourceDiscoverRecommendResponse, SourceDiscoverRecommendation, SourceDiscoverRequest, SourceDiscoveryAnalysisCreate, UpdateChatConversationInput, allowedChatModels, cancelRunRequestSchema, chatInputSchema, chatMessageRoleSchema, chatMessageSchema, chatModelContextWindowTokens, chatModelSchema, collectionRuleSchema, collectionRulesPatchSchema, crawlRunFormatSchema, crawlRunInputSchema, crawlRunInputUnionSchema, crawlRunOptionsSchema, crawlRunRequestSchema, crawlRunRequestUnionSchema, crawlRunScreenshotSchema, crawlRunStatusQuerySchema, crawlRunStatusSchema, crawlRunStrategySchema, createChatConversationInputSchema, createCollectionSchema, createSourceSchema, deepCrawlConfigSchema, deepCrawlRunInputSchema, deepCrawlRunRequestSchema, deepCrawlTaskRequestSchema, deepCrawlTaskTypeSchema, defaultChatModel, extractResultSchema, extractRunInputSchema, extractRunRequestSchema, extractSchemaGenerationRequestSchema, extractSchemaGenerationResponseSchema, githubCommandSchema, githubRepositoryMetadataSchema, githubRepositorySchema, githubRepositoryUrlSchema, githubSourceAnalysisResultSchema, githubSourceAnalyzeRequestSchema, githubSourceCreateRequestSchema, githubSourceInitializationRunConfigSchema, githubSourceInitializeCommandSchema, githubSyncBatchJobSchema, githubSyncCommandSchema, googleEmbeddingModels, googleLanguageModels, hybridSearchDefaultConfig, linkCollectionDocumentsSchema, linkCollectionFolderSchema, linkCollectionSourceSchema, mcpSearchInputSchema, openAiLanguageModels, resolveChatModelContextWindowTokens, retryRunBodySchema, runResultSchema, searchInputSchema, searchMcpToolDefaultConfig, searchQueryModeSchema, smartCrawlConfigSchema, sourceCanonicalUrlSchema, sourceCrawlOptionsSchema, sourceCrawlRequestSchema, sourceCrawlRequestUnionSchema, sourceDeepCrawlConfigSchema, sourceDeepCrawlRequestSchema, sourceDiscoverRecommendRequestSchema, sourceDiscoverRecommendResponseSchema, sourceDiscoverRecommendationSchema, sourceDiscoverRequestSchema, sourceDiscoveryAnalysisCreateSchema, updateChatConversationInputSchema, updateSourceSchema };