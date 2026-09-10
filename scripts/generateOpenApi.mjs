import { mkdir, writeFile } from 'node:fs/promises';
import { createOpenApiDocument } from '@bulkgrid/contracts/openapi';
await mkdir('openapi', { recursive: true });
const text = JSON.stringify(createOpenApiDocument(), null, 2) + '\n';
await writeFile('openapi/bulkgrid.openapi.json', text);
await writeFile('docs/api-reference/openapi.json', text);
