import { randomUUID } from 'node:crypto';
import { lstat, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUTPUTS, ROOT, buildExpectedPackages, packageRootFor, validatePackageDirectory } from './shared.js';

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isMissingPath(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function parseArguments(arguments_: readonly string[]): string {
  let outputDirectory = path.join(ROOT, 'plugins');
  for (let index = 0; index < arguments_.length; index += 1) {
    const flag = arguments_[index];
    const value = arguments_[index + 1];
    if (flag !== '--output-dir' || !value) {
      throw new Error('Usage: tsx scripts/plugins/build.ts [--output-dir <directory>]');
    }
    outputDirectory = path.resolve(value);
    index += 1;
  }
  return outputDirectory;
}

async function assertNoSymlinkAncestors(target: string) {
  const absolute = path.resolve(target);
  const root = path.parse(absolute).root;
  let current = root;
  for (const part of path.relative(root, absolute).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const info = await lstat(current).catch((error: unknown) => {
      if (isMissingPath(error)) {
        return null;
      }
      throw error;
    });
    if (info) {
      if (info.isSymbolicLink()) {
        throw new Error(`Refusing to write through symbolic link: ${current}`);
      }
      if (current !== absolute && !info.isDirectory()) {
        throw new Error(`Output parent is not a directory: ${current}`);
      }
    }
  }
}

async function writePackage(outputDirectory: string, output: (typeof OUTPUTS)[number], files: Map<string, Buffer>) {
  const target = packageRootFor(output, outputDirectory);
  await assertNoSymlinkAncestors(target);
  await mkdir(outputDirectory, { recursive: true });
  const suffix = randomUUID();
  const staging = path.join(outputDirectory, `.${output.id}.staging-${suffix}`);
  const backup = path.join(outputDirectory, `.${output.id}.backup-${suffix}`);
  let movedOldOutput = false;

  try {
    for (const [relativeFile, contents] of files) {
      const destination = path.join(staging, relativeFile);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, contents, { mode: 0o644 });
    }
    await validatePackageDirectory(staging, output, files);

    const existing = await lstat(target).catch((error: unknown) => {
      if (isMissingPath(error)) {
        return null;
      }
      throw error;
    });
    if (existing) {
      if (existing.isSymbolicLink() || !existing.isDirectory()) {
        throw new Error(`Refusing to replace non-directory plugin output: ${target}`);
      }
      await rename(target, backup);
      movedOldOutput = true;
    }
    await rename(staging, target);
    if (movedOldOutput) {
      await rm(backup, { recursive: true });
    }
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    if (movedOldOutput) {
      const targetExists = await lstat(target)
        .then(() => true)
        .catch(() => false);
      if (!targetExists) {
        await rename(backup, target);
      }
    }
    throw error;
  }
}

export async function buildPlugins(outputDirectory = path.join(ROOT, 'plugins')) {
  const expected = await buildExpectedPackages();
  await assertNoSymlinkAncestors(outputDirectory);
  for (const [output, files] of expected) {
    await writePackage(outputDirectory, output, files);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const outputDirectory = parseArguments(process.argv.slice(2));
    await buildPlugins(outputDirectory);
    console.log(`Generated ${OUTPUTS.map(({ id }) => id).join(' and ')} under ${outputDirectory}`);
  } catch (error) {
    console.error(`Plugin build failed: ${errorMessage(error)}`);
    process.exitCode = 1;
  }
}
