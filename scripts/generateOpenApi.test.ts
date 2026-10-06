import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { createOpenApiDocument } from '@bulkgrid/contracts/openapi';
import { generateOpenApi } from './generateOpenApi.js';

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe('generateOpenApi', () => {
  it('writes matching specifications to both configured output locations', async () => {
    const outputRoot = await mkdtemp(join(tmpdir(), 'bulkgrid-openapi-'));
    temporaryDirectories.push(outputRoot);
    await mkdir(join(outputRoot, 'docs/api-reference'), { recursive: true });

    await generateOpenApi(outputRoot);

    const outputPaths = [join(outputRoot, 'openapi/bulkgrid.openapi.json'), join(outputRoot, 'docs/api-reference/openapi.json')];
    const contents = await Promise.all(outputPaths.map((path) => readFile(path, 'utf8')));
    const expected = `${JSON.stringify(createOpenApiDocument(), null, 2)}\n`;

    expect(contents).toEqual([expected, expected]);
  });
});
