import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUTPUTS, ROOT, assert, checkGeneratedOutputs, isRecord, inventoryPackage, packageRootFor } from './shared.js';
import type { PackageInventoryEntry } from './shared.js';

const ARCHIVER = path.join(ROOT, 'scripts/plugins/archive.py');

interface ArchiveOptions {
  readonly outputDirectory?: string;
  readonly expectedVersion?: string;
}

interface PluginArchiveArtifact {
  readonly plugin: string;
  readonly file: string;
  readonly sha256: string;
  readonly files: PackageInventoryEntry[];
}

interface PluginReleaseRecord {
  readonly schemaVersion: 1;
  readonly pluginVersion: string;
  readonly source: {
    readonly commit: string;
    readonly dirtyInputPaths: string[];
  };
  readonly tools: {
    readonly node: string;
    readonly npm: string;
    readonly python: string;
    readonly zip: string;
  };
  readonly verification: {
    readonly generatedOutputDrift: 'passed';
    readonly archiveIntegrityAndExtraction: 'passed';
    readonly clientRuntimeAcceptance: 'pending';
  };
  readonly acceptedClientVersions: {
    readonly ChatGPT: null;
    readonly Codex: null;
    readonly Cursor: null;
    readonly 'GitHub Copilot': null;
    readonly 'Claude Code': null;
  };
  readonly artifacts: PluginArchiveArtifact[];
}

interface PluginArchiveResult {
  readonly recordPath: string;
  readonly record: PluginReleaseRecord;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isMissingPath(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item: unknown) => typeof item === 'string');
}

function parseArguments(arguments_: readonly string[]): ArchiveOptions & { readonly outputDirectory: string } {
  let outputDirectory = path.join(ROOT, 'dist/plugins');
  let expectedVersion;
  for (let index = 0; index < arguments_.length; index += 1) {
    const flag = arguments_[index];
    const value = arguments_[index + 1];
    if (flag === '--output-dir' && value) {
      outputDirectory = path.resolve(value);
      index += 1;
    } else if (flag === '--version' && value) {
      expectedVersion = value;
      index += 1;
    } else {
      throw new Error('Usage: tsx scripts/plugins/archive.ts [--output-dir <directory>] [--version <version>]');
    }
  }
  return { outputDirectory, expectedVersion };
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
    if (info?.isSymbolicLink()) {
      throw new Error(`Refusing to write through symbolic link: ${current}`);
    }
    if (info && current !== absolute && !info.isDirectory()) {
      throw new Error(`Output parent is not a directory: ${current}`);
    }
  }
}

function runArchiver(...arguments_: string[]): string {
  return execFileSync('python3', [ARCHIVER, ...arguments_], { cwd: ROOT, encoding: 'utf8' }).trim();
}

function gitOutput(...arguments_: string[]): string {
  return execFileSync('git', arguments_, { cwd: ROOT, encoding: 'utf8' }).trim();
}

function sourceCommit(): string {
  return gitOutput('rev-parse', 'HEAD');
}

function dirtyInputPaths(): string[] {
  const inputPaths = [
    'packages/agent-core/package.json',
    'packages/agent-core/LICENSE',
    'packages/agent-core/NOTICE',
    'packages/agent-core/metadata',
    'packages/agent-core/assets',
    'packages/agent-claude/package.json',
    'packages/agent-claude/templates',
    'skills/LICENSE.md',
    'skills/bulkgrid-search',
    'scripts/plugins',
    'plugins/bulkgrid',
    'plugins/bulkgrid-claude',
  ];
  const status = execFileSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all', '--', ...inputPaths], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  return [
    ...new Set(
      status
        .split('\0')
        .filter(Boolean)
        .map((entry) => entry.slice(3)),
    ),
  ].sort();
}

function pythonVersion(): string {
  return execFileSync('python3', ['--version'], { cwd: ROOT, encoding: 'utf8' }).trim();
}

function archiveDigest(contents: Buffer): string {
  return createHash('sha256').update(contents).digest('hex');
}

export async function createPluginArchives({
  outputDirectory = path.join(ROOT, 'dist/plugins'),
  expectedVersion,
}: ArchiveOptions = {}): Promise<PluginArchiveResult> {
  const expected = await checkGeneratedOutputs();
  const portableOutput = OUTPUTS.find(({ id }) => id === 'bulkgrid');
  assert(portableOutput, 'Portable plugin output definition is missing');
  const portableFiles = expected.get(portableOutput);
  assert(portableFiles, 'Portable plugin source files are missing');
  const portable = portableFiles.get('plugin.json');
  assert(portable, 'Portable plugin manifest is missing');
  const portableManifestValue: unknown = JSON.parse(portable.toString('utf8'));
  assert(isRecord(portableManifestValue), 'Portable plugin manifest must be a JSON object');
  const version = portableManifestValue.version;
  assert(typeof version === 'string', 'Portable plugin version must be a string');
  if (expectedVersion && version !== expectedVersion) {
    throw new Error(`Requested version ${expectedVersion} does not match plugin metadata ${version}`);
  }

  await assertNoSymlinkAncestors(outputDirectory);
  await mkdir(outputDirectory, { recursive: true });

  const artifacts: PluginArchiveArtifact[] = [];
  for (const output of OUTPUTS) {
    const packageRoot = packageRootFor(output);
    const fileName = `${output.id}-${version}.zip`;
    const archivePath = path.join(outputDirectory, fileName);
    await assertNoSymlinkAncestors(archivePath);
    runArchiver('write', archivePath, packageRoot);
    const archiveMembersValue: unknown = JSON.parse(runArchiver('verify', archivePath));
    assert(isStringArray(archiveMembersValue), `Archive member list is invalid: ${fileName}`);
    const archiveMembers = archiveMembersValue;

    const extractedParent = await mkdtemp(path.join(os.tmpdir(), 'bulkgrid-plugin-'));
    try {
      const extractedRoot = path.join(extractedParent, 'package');
      runArchiver('extract', archivePath, extractedRoot);
      const inventory = await inventoryPackage(extractedRoot);
      const sourceInventory = await inventoryPackage(packageRoot);
      if (JSON.stringify(inventory) !== JSON.stringify(sourceInventory)) {
        throw new Error(`Extracted archive does not match ${packageRoot}`);
      }
      const expectedPaths = sourceInventory.map(({ path: file }) => file);
      if (JSON.stringify(archiveMembers) !== JSON.stringify(expectedPaths)) {
        throw new Error(`Archive file order or inventory is incorrect: ${fileName}`);
      }
      artifacts.push({
        plugin: output.id,
        file: fileName,
        sha256: archiveDigest(await readFile(archivePath)),
        files: inventory,
      });
    } finally {
      await rm(extractedParent, { recursive: true, force: true });
    }
  }

  const record: PluginReleaseRecord = {
    schemaVersion: 1,
    pluginVersion: version,
    source: {
      commit: sourceCommit(),
      dirtyInputPaths: dirtyInputPaths(),
    },
    tools: {
      node: process.version,
      npm: execFileSync('npm', ['--version'], { cwd: ROOT, encoding: 'utf8' }).trim(),
      python: pythonVersion(),
      zip: 'Python standard-library zipfile; stored entries; sorted paths; fixed 1980-01-01 timestamps; mode 0644',
    },
    verification: {
      generatedOutputDrift: 'passed',
      archiveIntegrityAndExtraction: 'passed',
      clientRuntimeAcceptance: 'pending',
    },
    acceptedClientVersions: {
      ChatGPT: null,
      Codex: null,
      Cursor: null,
      'GitHub Copilot': null,
      'Claude Code': null,
    },
    artifacts,
  };
  const recordPath = path.join(outputDirectory, 'release-record.json');
  const existingRecord = await lstat(recordPath).catch((error: unknown) => {
    if (isMissingPath(error)) {
      return null;
    }
    throw error;
  });
  if (existingRecord && (existingRecord.isSymbolicLink() || !existingRecord.isFile())) {
    throw new Error(`Refusing to replace non-regular release record: ${recordPath}`);
  }
  await writeFile(recordPath, `${JSON.stringify(record, null, 2)}\n`, { mode: 0o644 });
  return { recordPath, record };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const { outputDirectory, expectedVersion } = parseArguments(process.argv.slice(2));
    const { recordPath, record } = await createPluginArchives({ outputDirectory, expectedVersion });
    console.log(`Created ${record.artifacts.map(({ file }) => file).join(' and ')}`);
    console.log(`Release record: ${recordPath}`);
  } catch (error) {
    console.error(`Plugin archive failed: ${errorMessage(error)}`);
    process.exitCode = 1;
  }
}
