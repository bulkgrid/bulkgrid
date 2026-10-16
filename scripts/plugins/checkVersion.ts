import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function assertPluginTagMatchesVersion(tag: string | undefined, manifest: unknown): void {
  if (!isRecord(manifest) || typeof manifest.version !== 'string' || tag !== `plugin-v${manifest.version}`) {
    throw new Error('Tag does not match plugin version');
  }
}

function parseJson(value: string): unknown {
  return JSON.parse(value);
}

async function main(): Promise<void> {
  const scriptDirectory = dirname(fileURLToPath(import.meta.url));
  const manifestPath = resolve(scriptDirectory, '../../plugins/bulkgrid/plugin.json');
  const manifest = parseJson(await readFile(manifestPath, 'utf8'));
  assertPluginTagMatchesVersion(process.env.PLUGIN_TAG, manifest);
}

if (process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await main();
}
