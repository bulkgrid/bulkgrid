import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkGeneratedOutputs } from './shared.js';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function checkPlugins() {
  return checkGeneratedOutputs();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    await checkPlugins();
    console.log('Generated plugin packages match their sources.');
  } catch (error) {
    console.error(`Plugin check failed: ${errorMessage(error)}`);
    process.exitCode = 1;
  }
}
