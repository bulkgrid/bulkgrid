import { lstat, readdir, readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const CHECKER_PATH = resolve(fileURLToPath(import.meta.url));
const IGNORED_DIRECTORY_NAMES = new Set(['node_modules', '.git']);
const SCANNED_EXTENSIONS = new Set(['.ts', '.js', '.mjs', '.json']);
const PRIVATE_REFERENCE_PATTERNS = [/@repo\//, /(?:\/Users\/|\/private\/|\/tmp\/bulkgrid-contracts)/];

function isEnvironmentFile(name: string): boolean {
  return name === '.env' || name.startsWith('.env.');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function visitDirectory(directory: string): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name));

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      throw new Error(`Unexpected symlink: ${path}`);
    }
    if (isEnvironmentFile(entry.name)) {
      throw new Error(`Environment file: ${path}`);
    }
    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORY_NAMES.has(entry.name)) {
        await visitDirectory(path);
      }
      continue;
    }
    if (!entry.isFile() || !SCANNED_EXTENSIONS.has(extname(path)) || path.endsWith('export-manifest.json')) {
      continue;
    }
    if (resolve(path) === CHECKER_PATH) {
      continue;
    }

    const details = await lstat(path);
    if (details.isSymbolicLink()) {
      throw new Error(`Unexpected symlink: ${path}`);
    }
    if (!details.isFile()) {
      continue;
    }
    const source = await readFile(path, 'utf8');
    if (PRIVATE_REFERENCE_PATTERNS.some((pattern) => pattern.test(source))) {
      throw new Error(`Private workspace reference: ${path}`);
    }
  }
}

export async function checkExport(exportRoot = resolve('.')): Promise<void> {
  await visitDirectory(resolve(exportRoot));
}

async function main(args: readonly string[] = process.argv.slice(2)): Promise<void> {
  if (args.length > 0) {
    throw new Error('Usage: tsx scripts/checkExport.ts');
  }
  await checkExport();
  process.stdout.write('Export has no private workspace imports, local paths, environment files, or symlinks.\n');
}

function isMainModule(): boolean {
  const invokedPath = process.argv[1];
  return invokedPath !== undefined && pathToFileURL(resolve(invokedPath)).href === import.meta.url;
}

if (isMainModule()) {
  main().catch((error) => {
    process.stderr.write(`${errorMessage(error)}\n`);
    process.exitCode = 1;
  });
}
