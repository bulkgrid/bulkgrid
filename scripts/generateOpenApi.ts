import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createOpenApiDocument } from '@bulkgrid/contracts/openapi';

export async function generateOpenApi(outputRoot = process.cwd()): Promise<void> {
  await mkdir(join(outputRoot, 'openapi'), { recursive: true });
  const text = `${JSON.stringify(createOpenApiDocument(), null, 2)}\n`;
  await writeFile(join(outputRoot, 'openapi/bulkgrid.openapi.json'), text);
  await writeFile(join(outputRoot, 'docs/api-reference/openapi.json'), text);
}

if (process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await generateOpenApi();
}
