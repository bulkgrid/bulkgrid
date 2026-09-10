import { z } from "zod";
//#region packages/types/dist/index.d.ts
//#endregion
//#region src/openapi.d.ts
interface OpenAPIInfo {
  title: string;
  description?: string;
  version: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}
interface OpenAPIServer {
  url: string;
  description?: string;
  variables?: Record<string, {
    enum?: string[];
    default: string;
    description?: string;
  }>;
}
interface OpenAPIParameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: Record<string, any>;
  example?: Record<string, any>;
  examples?: Record<string, any>;
}
interface OpenAPIRequestBody {
  description?: string;
  content: Record<string, {
    schema?: any;
    example?: any;
    examples?: Record<string, any>;
    encoding?: Record<string, any>;
  }>;
  required?: boolean;
}
interface OpenAPIResponse {
  description: string;
  headers?: Record<string, any>;
  content?: Record<string, {
    schema?: any;
    example?: any;
    examples?: Record<string, any>;
    encoding?: Record<string, any>;
  }>;
  links?: Record<string, any>;
}
interface OpenAPIOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: {
    description?: string;
    url: string;
  };
  operationId?: string;
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses: Record<string, OpenAPIResponse>;
  callbacks?: Record<string, any>;
  deprecated?: boolean;
  security?: Record<string, string[]>[];
  servers?: OpenAPIServer[];
}
interface OpenAPIPath {
  summary?: string;
  description?: string;
  get?: OpenAPIOperation;
  put?: OpenAPIOperation;
  post?: OpenAPIOperation;
  delete?: OpenAPIOperation;
  options?: OpenAPIOperation;
  head?: OpenAPIOperation;
  patch?: OpenAPIOperation;
  trace?: OpenAPIOperation;
  servers?: OpenAPIServer[];
  parameters?: OpenAPIParameter[];
}
interface OpenAPISchema {
  type?: string;
  format?: string;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  properties?: Record<string, OpenAPISchema>;
  additionalProperties?: boolean | OpenAPISchema;
  items?: OpenAPISchema;
  allOf?: OpenAPISchema[];
  oneOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  not?: OpenAPISchema;
  nullable?: boolean;
  discriminator?: {
    propertyName: string;
    mapping?: Record<string, string>;
  };
  readOnly?: boolean;
  writeOnly?: boolean;
  xml?: any;
  externalDocs?: {
    description?: string;
    url: string;
  };
  example?: any;
  deprecated?: boolean;
}
interface OpenAPIComponents {
  schemas?: Record<string, OpenAPISchema>;
  responses?: Record<string, OpenAPIResponse>;
  parameters?: Record<string, OpenAPIParameter>;
  examples?: Record<string, any>;
  requestBodies?: Record<string, OpenAPIRequestBody>;
  headers?: Record<string, any>;
  securitySchemes?: Record<string, any>;
  links?: Record<string, any>;
  callbacks?: Record<string, any>;
}
interface OpenAPISpecification {
  openapi: string;
  info: OpenAPIInfo;
  servers?: OpenAPIServer[];
  paths: Record<string, OpenAPIPath>;
  components?: OpenAPIComponents;
  security?: Record<string, string[]>[];
  tags?: {
    name: string;
    description?: string;
    externalDocs?: {
      description?: string;
      url: string;
    };
  }[];
  externalDocs?: {
    description?: string;
    url: string;
  };
}
declare enum CrawlRunType {
  CRAWL = "crawl",
  DEEP_CRAWL = "deep_crawl",
  EXTRACT = "extract",
  SOURCE_SYNC = "source_sync"
}
//#endregion
export { OpenAPISpecification as n, CrawlRunType as t };