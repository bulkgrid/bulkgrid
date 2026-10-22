import { BulkgridClient } from '@bulkgrid/sdk';

const apiKey = process.env.BULKGRID_API_KEY;
if (!apiKey) throw new Error('Set BULKGRID_API_KEY to a key with runs:write access.');
const url = process.argv[2];
if (!url) throw new Error('Usage: node examples/map.mjs https://example.com');

const client = new BulkgridClient({
  apiKey,
  baseUrl: process.env.BULKGRID_BASE_URL ?? 'https://bulkgrid.com',
});
const run = await client.map({ url, config: { limit: 100 } });
console.log(JSON.stringify(run, null, 2));
console.error('Use client.runs.get(run.id) with runs:read to check progress. Completed URLs are in result_data.links.');
