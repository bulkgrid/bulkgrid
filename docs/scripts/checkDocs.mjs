import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiContract } from '@bulkgrid/contracts';
import { createOpenApiDocument } from '@bulkgrid/contracts/openapi';
import {
  createSourceSchema,
  githubSourceCreateRequestSchema,
  createCollectionSchema,
  sourceDiscoverRequestSchema,
  extractSchemaGenerationRequestSchema,
} from '@bulkgrid/contracts/schemas';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
let links = 0;
let examples = 0;
const schemas = new Map([
  ['/api/v1/search', apiContract.search.requestSchema],
  ['/api/v1/crawl', apiContract.crawl.requestSchema],
  ['/api/v1/extract', apiContract.extract.requestSchema],
  ['/api/v1/deep-crawl', apiContract.deepCrawl.requestSchema],
  ['/api/v1/sources', createSourceSchema],
  ['/api/v1/collections', createCollectionSchema],
  ['/api/v1/sources/discover', sourceDiscoverRequestSchema],
  ['/api/v1/extract/schema', extractSchemaGenerationRequestSchema],
  ['/api/v1/sources/github', githubSourceCreateRequestSchema],
]);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}
async function checkLink(link, source) {
  if (!link.startsWith('/') || link.startsWith('//')) return;
  const pathname = link.split(/[?#]/)[0];
  const target = join(root, pathname.slice(1));
  links++;
  if (!(await exists(target)) && !(await exists(`${target}.mdx`)) && !(await exists(join(target, 'index.mdx')))) {
    errors.push(`${source}: missing link ${link}`);
  }
}
async function inspectDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspectDirectory(path);
      continue;
    }
    if (!entry.name.endsWith('.mdx')) continue;
    const source = await readFile(path, 'utf8');
    if (!/^---\ntitle: .+\ndescription: .+\n/.test(source)) errors.push(`${path}: missing page metadata`);
    for (const match of source.matchAll(/(?:\]\(|href=["'])(\/[^)"'#\s]*)/g)) await checkLink(match[1], path);
    for (const match of source.matchAll(/```(?:bash|sh|shell)[^\n]*\n([\s\S]*?)```/g)) {
      const endpoint = match[1].match(/(\/api\/v1\/[\w/-]+)(?:["\s]|$)/)?.[1];
      const body = match[1].match(/-d\s+'([\s\S]*?)'/)?.[1];
      if (!endpoint || !body || !schemas.has(endpoint)) continue;
      try {
        const result = schemas.get(endpoint).safeParse(JSON.parse(body));
        examples++;
        if (!result.success) errors.push(`${path}: ${endpoint}: ${result.error.message}`);
      } catch {
        errors.push(`${path}: invalid request JSON`);
      }
    }
  }
}
await inspectDirectory(root);
const config = JSON.parse(await readFile(join(root, 'docs.json'), 'utf8'));
async function inspectNavigation(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.openapi === 'string') await checkLink(`/${value.openapi}`, 'navigation');
  if (Array.isArray(value.pages)) {
    for (const page of value.pages) {
      if (typeof page === 'string') await checkLink(`/${page}`, 'navigation');
    }
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) {
      for (const item of child) await inspectNavigation(item);
    } else if (child && typeof child === 'object') await inspectNavigation(child);
  }
}
await inspectNavigation(config.navigation);
const document = JSON.parse(JSON.stringify(createOpenApiDocument()));
function inspectReferences(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.$ref === 'string' && value.$ref.startsWith('#/')) {
    const target = value.$ref
      .slice(2)
      .split('/')
      .reduce((current, key) => current?.[key.replace(/~1/g, '/').replace(/~0/g, '~')], document);
    if (target === undefined) errors.push(`OpenAPI: unresolved reference ${value.$ref}`);
  }
  for (const child of Object.values(value)) inspectReferences(child);
}
inspectReferences(document);
for (const relativePath of [
  'api-reference/openapi.json',
  '../openapi/bulkgrid.openapi.json',
]) {
  try {
    assert.deepEqual(JSON.parse(await readFile(resolve(root, relativePath), 'utf8')), document);
  } catch {
    errors.push(`${relativePath}: stale specification; regenerate the public export from the platform`);
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Docs check passed: ${examples} request examples, ${links} links/navigation entries, and 2 synchronized OpenAPI files.`,
  );
}
