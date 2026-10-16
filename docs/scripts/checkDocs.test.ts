import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createOpenApiDocument } from '@bulkgrid/contracts/openapi';
import { checkDocs, findUnresolvedOpenApiReferences } from './checkDocs.js';

const temporaryDirectories: string[] = [];

async function createDocsFixture(page: string, navigation: unknown): Promise<string> {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'bulkgrid-docs-check-'));
  temporaryDirectories.push(temporaryDirectory);

  const docsRoot = join(temporaryDirectory, 'docs');
  const apiReferenceDirectory = join(docsRoot, 'api-reference');
  const openApiDirectory = join(temporaryDirectory, 'openapi');
  await mkdir(apiReferenceDirectory, { recursive: true });
  await mkdir(openApiDirectory, { recursive: true });

  const document = JSON.stringify(createOpenApiDocument(), null, 2);
  await writeFile(join(apiReferenceDirectory, 'openapi.json'), document);
  await writeFile(join(openApiDirectory, 'bulkgrid.openapi.json'), document);
  await writeFile(join(docsRoot, 'docs.json'), JSON.stringify({ navigation }));
  await writeFile(join(docsRoot, 'guide.mdx'), page);
  return docsRoot;
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('checkDocs', () => {
  it('accepts valid request examples, links, navigation, and synchronized OpenAPI files', async () => {
    const docsRoot = await createDocsFixture(
      [
        '---',
        'title: Guide',
        'description: A fixture page',
        '---',
        '',
        '[API reference](/api-reference/openapi.json)',
        '',
        '```bash',
        'curl https://example.test/api/v1/search -d \'{"query":"fixture","limit":2}\'',
        '```',
      ].join('\n'),
      { tabs: [{ openapi: 'api-reference/openapi.json', pages: ['guide'] }] },
    );

    const result = await checkDocs(docsRoot);

    expect(result.errors).toEqual([]);
    expect(result.examples).toBe(1);
    expect(result.links).toBe(3);
    await expect(readFile(join(docsRoot, 'api-reference/openapi.json'), 'utf8')).resolves.toContain('"openapi": "3.0.3"');
  });

  it('reports malformed page metadata, missing links, and invalid request payloads', async () => {
    const docsRoot = await createDocsFixture(
      ['[Missing page](/missing)', '', '```bash', 'curl https://example.test/api/v1/search -d \'{"query":42}\'', '```'].join(
        '\n',
      ),
      { pages: ['missing-navigation-page'] },
    );

    const result = await checkDocs(docsRoot);

    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('missing page metadata'),
        expect.stringContaining('missing link /missing'),
        expect.stringContaining('/api/v1/search:'),
        expect.stringContaining('missing link /missing-navigation-page'),
      ]),
    );
    expect(result.examples).toBe(1);
  });

  it('reports stale specifications and safely ignores malformed navigation values', async () => {
    const docsRoot = await createDocsFixture('---\ntitle: Guide\ndescription: A fixture page\n---\n', {
      pages: [null, 42],
      openapi: 7,
    });
    await writeFile(join(docsRoot, 'api-reference/openapi.json'), '{}');

    const result = await checkDocs(docsRoot);

    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('api-reference/openapi.json: stale specification')]),
    );
    expect(result.examples).toBe(0);
  });
});

describe('findUnresolvedOpenApiReferences', () => {
  it('resolves escaped object keys and array positions, and reports unresolved references', () => {
    const document: unknown = {
      components: { 'a/b': { 'x~y': true } },
      entries: [{ name: 'first' }],
      paths: [{ $ref: '#/components/a~1b/x~0y' }, { $ref: '#/entries/0/name' }, { $ref: '#/entries/1/name' }],
    };

    expect(findUnresolvedOpenApiReferences(document)).toEqual(['OpenAPI: unresolved reference #/entries/1/name']);
    expect(findUnresolvedOpenApiReferences('not an OpenAPI object')).toEqual([]);
  });
});
