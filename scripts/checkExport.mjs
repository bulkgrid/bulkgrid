import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
async function check(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    if (['node_modules', '.git'].includes(item.name)) continue;
    const path = join(dir, item.name);
    if (item.isSymbolicLink()) throw new Error(`Unexpected symlink: ${path}`);
    if (item.name === '.env' || item.name.startsWith('.env.')) throw new Error(`Environment file: ${path}`);
    if (item.isDirectory()) {
      await check(path);
      continue;
    }
    if (!/\.(ts|js|mjs|json)$/.test(path) || path.endsWith('export-manifest.json') || path.endsWith('checkExport.mjs')) continue;
    const text = await readFile(path, 'utf8');
    if (/@repo\//.test(text) || /(?:\/Users\/|\/private\/|\/tmp\/bulkgrid-contracts)/.test(text))
      throw new Error(`Private workspace reference: ${path}`);
  }
}
await check('.');
console.log('Export has no private workspace imports, local paths, environment files, or symlinks.');
