import { BulkgridClient } from '@bulkgrid/sdk';
const apiKey = process.env.BULKGRID_API_KEY;
if (!apiKey) throw new Error('Set BULKGRID_API_KEY to a key with search:query access.');
const client = new BulkgridClient({ apiKey, baseUrl: process.env.BULKGRID_BASE_URL ?? 'https://bulkgrid.com' });
const response = await client.search({ query: process.argv[2] ?? 'authentication setup', limit: 5 });
console.log(JSON.stringify(response, null, 2));
