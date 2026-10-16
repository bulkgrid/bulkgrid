import { readFile, readdir, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { apiContract } from '@bulkgrid/contracts';
import { createOpenApiDocument } from '@bulkgrid/contracts/openapi';
import {
  createSourceSchema,
  githubSourceCreateRequestSchema,
  createCollectionSchema,
  extractSchemaGenerationRequestSchema,
} from '@bulkgrid/contracts/schemas';

interface RequestSchema {
  safeParse(
    value: unknown,
  ): { readonly success: true } | { readonly success: false; readonly error: { readonly message: string } };
}

interface LinkCheckContext {
  readonly link: string;
  readonly source: string;
  readonly root: string;
  readonly errors: string[];
}

interface NavigationContext {
  readonly value: unknown;
  readonly root: string;
  readonly errors: string[];
  readonly source?: string;
}

export interface DocsCheckResult {
  readonly errors: readonly string[];
  readonly links: number;
  readonly examples: number;
}

const DOCS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const requestSchemas = new Map<string, RequestSchema>([
  ['/api/v1/search', apiContract.search.requestSchema],
  ['/api/v1/crawl', apiContract.crawl.requestSchema],
  ['/api/v1/extract', apiContract.extract.requestSchema],
  ['/api/v1/deep-crawl', apiContract.deepCrawl.requestSchema],
  ['/api/v1/sources', createSourceSchema],
  ['/api/v1/collections', createCollectionSchema],
  ['/api/v1/sources/discover/analyses', apiContract.sources.analyze.requestSchema],
  ['/api/v1/extract/schema', extractSchemaGenerationRequestSchema],
  ['/api/v1/sources/github', githubSourceCreateRequestSchema],
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJson(value: string): unknown {
  return JSON.parse(value);
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function checkLink({ link, source, root, errors }: LinkCheckContext): Promise<number> {
  if (!link.startsWith('/') || link.startsWith('//')) {
    return 0;
  }

  const pathname = link.split(/[?#]/)[0] ?? '';
  const target = join(root, pathname.slice(1));
  const found = (await exists(target)) || (await exists(`${target}.mdx`)) || (await exists(join(target, 'index.mdx')));

  if (!found) {
    errors.push(`${source}: missing link ${link}`);
  }

  return 1;
}

async function inspectDirectory(directory: string, root: string, errors: string[]): Promise<{ links: number; examples: number }> {
  let links = 0;
  let examples = 0;

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const nested = await inspectDirectory(path, root, errors);
      links += nested.links;
      examples += nested.examples;
      continue;
    }

    if (!entry.name.endsWith('.mdx')) {
      continue;
    }

    const source = await readFile(path, 'utf8');
    if (!/^---\ntitle: .+\ndescription: .+\n/.test(source)) {
      errors.push(`${path}: missing page metadata`);
    }

    for (const match of source.matchAll(/(?:\]\(|href=["'])(\/[^)"'#\s]*)/g)) {
      const link = match[1];
      if (link !== undefined) {
        links += await checkLink({ link, source: path, root, errors });
      }
    }

    for (const match of source.matchAll(/```(?:bash|sh|shell)[^\n]*\n([\s\S]*?)```/g)) {
      const command = match[1] ?? '';
      const endpoint = command.match(/(\/api\/v1\/[\w/-]+)(?:["\s]|$)/)?.[1];
      const body = command.match(/-d\s+'([\s\S]*?)'/)?.[1];
      if (endpoint === undefined || body === undefined) {
        continue;
      }

      const schema = requestSchemas.get(endpoint);
      if (schema === undefined) {
        continue;
      }

      let request: unknown;
      try {
        request = parseJson(body);
      } catch {
        errors.push(`${path}: invalid request JSON`);
        continue;
      }

      const result = schema.safeParse(request);
      examples += 1;
      if (!result.success) {
        errors.push(`${path}: ${endpoint}: ${result.error.message}`);
      }
    }
  }

  return { links, examples };
}

async function inspectNavigation({ value, root, errors, source = 'navigation' }: NavigationContext): Promise<number> {
  if (Array.isArray(value)) {
    let links = 0;
    for (const child of value) {
      links += await inspectNavigation({ value: child, root, errors, source });
    }
    return links;
  }

  if (!isRecord(value)) {
    return 0;
  }

  let links = 0;
  if (typeof value.openapi === 'string') {
    links += await checkLink({
      link: `/${value.openapi}`,
      source,
      root,
      errors,
    });
  }

  if (Array.isArray(value.pages)) {
    for (const page of value.pages) {
      if (typeof page === 'string') {
        links += await checkLink({ link: `/${page}`, source, root, errors });
      }
    }
  }

  for (const child of Object.values(value)) {
    links += await inspectNavigation({ value: child, root, errors, source });
  }

  return links;
}

function resolveJsonPointer(document: unknown, reference: string): unknown {
  if (!reference.startsWith('#/')) {
    return undefined;
  }

  let current = document;
  for (const segment of reference.slice(2).split('/')) {
    const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
    if (Array.isArray(current) && /^(0|[1-9]\d*)$/.test(key)) {
      current = current[Number(key)];
    } else if (isRecord(current)) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current;
}

export function findUnresolvedOpenApiReferences(document: unknown): string[] {
  const errors: string[] = [];

  function inspect(value: unknown): void {
    if (Array.isArray(value)) {
      for (const child of value) {
        inspect(child);
      }
      return;
    }

    if (!isRecord(value)) {
      return;
    }

    if (typeof value.$ref === 'string' && value.$ref.startsWith('#/')) {
      if (resolveJsonPointer(document, value.$ref) === undefined) {
        errors.push(`OpenAPI: unresolved reference ${value.$ref}`);
      }
    }

    for (const child of Object.values(value)) {
      inspect(child);
    }
  }

  inspect(document);
  return errors;
}

export async function checkDocs(root = DOCS_ROOT): Promise<DocsCheckResult> {
  const errors: string[] = [];
  const directoryResult = await inspectDirectory(root, root, errors);
  let links = directoryResult.links;
  const examples = directoryResult.examples;

  const config = parseJson(await readFile(join(root, 'docs.json'), 'utf8'));
  if (isRecord(config)) {
    links += await inspectNavigation({
      value: config.navigation,
      root,
      errors,
    });
  } else {
    errors.push('docs.json: expected an object');
  }

  const document = parseJson(JSON.stringify(createOpenApiDocument()));
  errors.push(...findUnresolvedOpenApiReferences(document));

  for (const relativePath of ['api-reference/openapi.json', '../openapi/bulkgrid.openapi.json']) {
    try {
      const contents = parseJson(await readFile(resolve(root, relativePath), 'utf8'));
      if (!isDeepStrictEqual(contents, document)) {
        errors.push(`${relativePath}: stale specification; regenerate the public export from the platform`);
      }
    } catch {
      errors.push(`${relativePath}: stale specification; regenerate the public export from the platform`);
    }
  }

  return { errors, links, examples };
}

async function main(): Promise<void> {
  const result = await checkDocs();
  if (result.errors.length > 0) {
    console.error(result.errors.join('\n'));
    process.exitCode = 1;
    return;
  }

  console.log(
    `Docs check passed: ${result.examples} request examples, ${result.links} links/navigation entries, and 2 synchronized OpenAPI files.`,
  );
}

if (process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await main();
}
