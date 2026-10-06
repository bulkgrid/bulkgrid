import { createHash } from 'node:crypto';
import type { Stats } from 'node:fs';
import { lstat, mkdir, readFile, readdir, realpath, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type JsonValue = string | number | boolean | null | JsonValue[] | JsonObject;
interface JsonObject {
  [key: string]: JsonValue;
}

type ExpectedType = 'directory' | 'file';
type ContentKind = 'source' | 'package' | 'ignore';
type ExportAction = 'unchanged' | 'add' | 'update';
type ExportMode = '--preview' | '--apply';

interface ExportPlanEntry {
  readonly relativePath: string;
  readonly contentKind: ContentKind;
  readonly sourceDigest: string;
  readonly contentDigest: string;
  readonly targetDigest: string | null;
  readonly action: ExportAction;
}

interface ExportPlan {
  readonly stagingRoot: string;
  readonly publicRoot: string;
  readonly entries: readonly ExportPlanEntry[];
  readonly packageConflicts: Readonly<Record<string, readonly string[]>>;
  readonly preservedPaths: readonly string[];
}

interface PackageMapResult {
  readonly value: JsonObject;
  readonly conflicts: readonly string[];
}

interface PackageMergeResult {
  readonly manifest: JsonObject;
  readonly conflicts: Readonly<Record<string, readonly string[]>>;
}

interface ValidateSourcePathOptions {
  readonly root: string;
  readonly relativePath: string;
  readonly expectedType: ExpectedType;
  readonly optional?: boolean;
}

type CliOptions =
  | { readonly help: true }
  | { readonly help: false; readonly mode: ExportMode; readonly stagingDirectory: string };

const PUBLIC_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TREE_PATHS = ['packages/sdk', 'packages/cli', 'packages/contracts', 'docs', 'examples', 'openapi'] as const;
const FILE_PATHS = ['export-manifest.json'] as const;
const OPTIONAL_TREE_PATHS = ['packages/sdk-python'] as const;
const OPTIONAL_FILE_PATHS = ['.github/workflows/check-python-sdk.yml'] as const;
const ROOT_MANIFEST_MAPS = [
  'scripts',
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
  'overrides',
] as const;
const IGNORED_TREE_NAMES = new Set(['.git', 'dist', 'node_modules']);
const PRESERVED_PATHS = [
  'README.md',
  'AGENT_PLUGINS.md',
  'PLUGIN_RELEASE.md',
  'MAINTAINERS.md',
  'CONTRIBUTING.md',
  'package-lock.json',
  'skills/**',
  'plugins/**',
  'packages/agent-core/**',
  'packages/agent-claude/**',
  '.claude-plugin/**',
  '.cursor-plugin/**',
  '.agents/plugins/**',
  'marketplace files and directories',
  'scripts/**',
  'docs/scripts/**',
  'tooling configuration files',
  '.github/workflows/** except .github/workflows/check-python-sdk.yml',
];
const RETIRED_JS_TOOLING_PATH =
  /(?:^|[^A-Za-z0-9_./\\-])(?:\.\/)?(?:scripts|docs\/scripts)\/[^\s"'`<>|&=;,()]*\.(?:mjs|cjs|js)(?![A-Za-z0-9_.-])/;

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }
  if (typeof value === 'object') {
    return Object.values(value).every(isJsonValue);
  }
  return false;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && Object.values(value).every(isJsonValue);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item: unknown) => typeof item === 'string');
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function sha256(data: Buffer | string): string {
  return createHash('sha256').update(data).digest('hex');
}

function isInside(parent: string, child: string): boolean {
  const pathFromParent = relative(parent, child);
  return (
    pathFromParent === '' || (!pathFromParent.startsWith(`..${sep}`) && pathFromParent !== '..' && !isAbsolute(pathFromParent))
  );
}

function isEnvironmentFile(name: string): boolean {
  return name === '.env' || name.startsWith('.env.');
}

function isPublicOwnedDocumentationScript(relativePath: string): boolean {
  return relativePath === 'docs/scripts' || relativePath.startsWith('docs/scripts/');
}

async function requireType(path: string, expectedType: ExpectedType): Promise<void> {
  let details: Stats;
  try {
    details = await lstat(path);
  } catch (error) {
    if (isMissingFileError(error)) {
      throw new Error(`Required export path is missing: ${path}`);
    }
    throw error;
  }

  if (details.isSymbolicLink()) {
    throw new Error(`Symbolic links are not allowed in an export: ${path}`);
  }
  if (expectedType === 'directory' && !details.isDirectory()) {
    throw new Error(`Expected an export directory: ${path}`);
  }
  if (expectedType === 'file' && !details.isFile()) {
    throw new Error(`Expected a regular export file: ${path}`);
  }
}

async function validateSourcePath({
  root,
  relativePath,
  expectedType,
  optional = false,
}: ValidateSourcePathOptions): Promise<boolean> {
  const segments = relativePath.split('/');
  let currentPath = root;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (segment === undefined) {
      throw new Error(`Invalid export path: ${relativePath}`);
    }
    currentPath = join(currentPath, segment);
    let details: Stats;
    try {
      details = await lstat(currentPath);
    } catch (error) {
      if (isMissingFileError(error)) {
        if (optional) {
          return false;
        }
        throw new Error(`Required export path is missing: ${currentPath}`);
      }
      throw error;
    }

    if (details.isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed in an export: ${currentPath}`);
    }
    const isLeaf = index === segments.length - 1;
    if (!isLeaf && !details.isDirectory()) {
      throw new Error(`An export parent is not a directory: ${currentPath}`);
    }
    if (isLeaf && expectedType === 'directory' && !details.isDirectory()) {
      throw new Error(`Expected an export directory: ${currentPath}`);
    }
    if (isLeaf && expectedType === 'file' && !details.isFile()) {
      throw new Error(`Expected a regular export file: ${currentPath}`);
    }
  }
  return true;
}

async function assertSafeSource(root: string, relativePath: string, expectedType: ExpectedType = 'file'): Promise<void> {
  await validateSourcePath({ root, relativePath, expectedType });
}

async function collectTreeFiles(sourceRoot: string, treePath: string): Promise<string[]> {
  const files: string[] = [];
  const treeRoot = join(sourceRoot, treePath);
  await assertSafeSource(sourceRoot, treePath, 'directory');

  async function visit(directory: string, relativeDirectory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const path = join(directory, entry.name);
      const relativePath = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
      const details = await lstat(path);

      if (details.isSymbolicLink()) {
        throw new Error(`Symbolic links are not allowed in an export: ${path}`);
      }
      if (isEnvironmentFile(entry.name)) {
        throw new Error(`Environment files are not allowed in an export: ${path}`);
      }
      const isPythonSdkIgnoreFile = relativePath === 'packages/sdk-python/.gitignore';
      if (IGNORED_TREE_NAMES.has(entry.name) || (entry.name.startsWith('.') && !isPythonSdkIgnoreFile)) {
        continue;
      }
      if (details.isDirectory()) {
        await visit(path, relativePath);
        continue;
      }
      if (!details.isFile()) {
        throw new Error(`Expected a regular export file: ${path}`);
      }

      const isPublicOwnedDocsScript = treePath === 'docs' && isPublicOwnedDocumentationScript(relativePath);
      if (!isPublicOwnedDocsScript) {
        files.push(relativePath);
      }
    }
  }

  await visit(treeRoot, treePath);
  return files;
}

async function assertSafeDestination(root: string, relativePath: string, expectedType: ExpectedType = 'file'): Promise<void> {
  const segments = relativePath.split('/');
  let currentPath = root;

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index];
    if (segment === undefined) {
      throw new Error(`Invalid public destination path: ${relativePath}`);
    }
    currentPath = join(currentPath, segment);
    let details: Stats;
    try {
      details = await lstat(currentPath);
    } catch (error) {
      if (isMissingFileError(error)) {
        return;
      }
      throw error;
    }

    if (details.isSymbolicLink()) {
      throw new Error(`Symbolic links are not allowed in the public checkout: ${currentPath}`);
    }
    const isLeaf = index === segments.length - 1;
    if (!isLeaf && !details.isDirectory()) {
      throw new Error(`A public export parent is not a directory: ${currentPath}`);
    }
    if (isLeaf && expectedType === 'directory' && !details.isDirectory()) {
      throw new Error(`Expected a public directory: ${currentPath}`);
    }
    if (isLeaf && expectedType === 'file' && !details.isFile()) {
      throw new Error(`Expected a public file: ${currentPath}`);
    }
  }
}

async function readJson(path: string): Promise<JsonObject> {
  try {
    const parsed: unknown = JSON.parse(await readFile(path, 'utf8'));
    if (!isJsonObject(parsed)) {
      throw new Error('The JSON root must be an object.');
    }
    return parsed;
  } catch (error) {
    throw new Error(`Could not read valid JSON from ${path}: ${errorMessage(error)}`, { cause: error });
  }
}

function getObjectMap(manifest: JsonObject, key: string): JsonObject {
  const value = manifest[key];
  if (value === undefined || value === null) {
    return {};
  }
  if (!isJsonObject(value)) {
    throw new Error(`Root package.json field must be an object: ${key}`);
  }
  return value;
}

function assertNoImportedLegacyToolingScripts(exported: JsonObject, current: JsonObject): void {
  const exportedScripts = getObjectMap(exported, 'scripts');
  const currentScripts = getObjectMap(current, 'scripts');

  for (const [name, command] of Object.entries(exportedScripts)) {
    if (Object.hasOwn(currentScripts, name)) {
      continue;
    }
    if (typeof command !== 'string') {
      throw new Error(`Root package.json script must be a string: ${name}`);
    }
    if (RETIRED_JS_TOOLING_PATH.test(command)) {
      throw new Error(`New root package.json script references public-owned JavaScript tooling: ${name}`);
    }
  }
}

function mergeObjectMap(exported: JsonObject, current: JsonObject, key: string): PackageMapResult {
  const exportedMap = getObjectMap(exported, key);
  const currentMap = getObjectMap(current, key);

  const conflicts = Object.keys(exportedMap)
    .filter((name) => Object.hasOwn(currentMap, name) && currentMap[name] !== exportedMap[name])
    .sort();
  return {
    value: { ...exportedMap, ...currentMap },
    conflicts,
  };
}

function getWorkspacePatterns(manifest: JsonObject): readonly string[] {
  const workspaces = manifest.workspaces ?? [];
  if (!isStringArray(workspaces)) {
    throw new Error('Root package.json workspaces must be arrays of strings to apply an export safely.');
  }
  return workspaces;
}

function mergeWorkspacePatterns(exported: JsonObject, current: JsonObject): string[] {
  return [...new Set([...getWorkspacePatterns(exported), ...getWorkspacePatterns(current)])];
}

function mergePackageManifest(exported: JsonObject, current: JsonObject): PackageMergeResult {
  assertNoImportedLegacyToolingScripts(exported, current);
  const manifest: JsonObject = { ...exported, ...current };
  const conflicts: Record<string, readonly string[]> = {};

  for (const key of ROOT_MANIFEST_MAPS) {
    const result = mergeObjectMap(exported, current, key);
    manifest[key] = result.value;
    if (result.conflicts.length > 0) {
      conflicts[key] = result.conflicts;
    }
  }

  manifest.workspaces = mergeWorkspacePatterns(exported, current);
  return { manifest, conflicts };
}

function serializeJsonObject(value: JsonObject): string {
  const serialized = JSON.stringify(value, null, 2);
  if (typeof serialized !== 'string') {
    throw new Error('Could not serialize the merged root package.json.');
  }
  return `${serialized}\n`;
}

function mergeIgnoreFiles(exportedText: string, currentText: string): string {
  const lines = [...exportedText.split(/\r?\n/), ...currentText.split(/\r?\n/)];
  const uniqueLines = [...new Set(lines.filter((line, index) => line.length > 0 || index < lines.length - 1))];
  return `${uniqueLines.join('\n')}\n`;
}

async function readOptionalFile(path: string): Promise<Buffer | null> {
  try {
    return await readFile(path);
  } catch (error) {
    if (isMissingFileError(error)) {
      return null;
    }
    throw error;
  }
}

export async function createExportPlan(stagingDirectory: string, publicRepositoryRoot = PUBLIC_ROOT): Promise<ExportPlan> {
  if (!isAbsolute(stagingDirectory)) {
    throw new Error('The staging directory must be an absolute path.');
  }

  const stagingPath = resolve(stagingDirectory);
  const publicPath = resolve(publicRepositoryRoot);
  await requireType(stagingPath, 'directory');
  await requireType(publicPath, 'directory');
  const stagingRoot = await realpath(stagingPath);
  const publicRoot = await realpath(publicPath);

  if (isInside(publicRoot, stagingRoot) || isInside(stagingRoot, publicRoot)) {
    throw new Error('The staging export and public checkout must be separate directories.');
  }

  for (const directory of TREE_PATHS) {
    await assertSafeSource(stagingRoot, directory, 'directory');
  }
  const optionalTrees: string[] = [];
  for (const directory of OPTIONAL_TREE_PATHS) {
    if (await validateSourcePath({ root: stagingRoot, relativePath: directory, expectedType: 'directory', optional: true })) {
      optionalTrees.push(directory);
    }
  }
  for (const file of FILE_PATHS) {
    await assertSafeSource(stagingRoot, file);
  }
  await assertSafeSource(stagingRoot, '.gitignore');
  await assertSafeSource(stagingRoot, 'package.json');

  const optionalFiles: string[] = [];
  for (const file of OPTIONAL_FILE_PATHS) {
    if (await validateSourcePath({ root: stagingRoot, relativePath: file, expectedType: 'file', optional: true })) {
      optionalFiles.push(file);
    }
  }

  const files: string[] = [];
  for (const treePath of [...TREE_PATHS, ...optionalTrees]) {
    const treeFiles = await collectTreeFiles(stagingRoot, treePath);
    files.push(...treeFiles);
  }
  files.push(...FILE_PATHS, ...optionalFiles);

  const stagedPackagePath = join(stagingRoot, 'package.json');
  const publicPackagePath = join(publicRoot, 'package.json');
  await assertSafeDestination(publicRoot, 'package.json');
  const stagedPackage = await readJson(stagedPackagePath);
  const currentPackage = await readJson(publicPackagePath);
  const packageResult = mergePackageManifest(stagedPackage, currentPackage);
  const mergedPackageText = serializeJsonObject(packageResult.manifest);
  const stagedIgnorePath = join(stagingRoot, '.gitignore');
  const publicIgnorePath = join(publicRoot, '.gitignore');
  await assertSafeDestination(publicRoot, '.gitignore');
  const stagedIgnore = await readFile(stagedIgnorePath, 'utf8');
  const currentIgnore = (await readOptionalFile(publicIgnorePath))?.toString('utf8') ?? '';
  const mergedIgnoreText = mergeIgnoreFiles(stagedIgnore, currentIgnore);

  const entries: Omit<ExportPlanEntry, 'action'>[] = [];
  for (const relativePath of files) {
    await assertSafeSource(stagingRoot, relativePath);
    await assertSafeDestination(publicRoot, relativePath);
    const source = await readFile(join(stagingRoot, relativePath));
    const target = await readOptionalFile(join(publicRoot, relativePath));
    entries.push({
      relativePath,
      contentKind: 'source',
      sourceDigest: sha256(source),
      contentDigest: sha256(source),
      targetDigest: target === null ? null : sha256(target),
    });
  }

  const generatedEntries: readonly {
    readonly relativePath: string;
    readonly contentKind: 'package' | 'ignore';
    readonly content: Buffer;
    readonly sourcePath: string;
  }[] = [
    {
      relativePath: 'package.json',
      contentKind: 'package',
      content: Buffer.from(mergedPackageText),
      sourcePath: stagedPackagePath,
    },
    {
      relativePath: '.gitignore',
      contentKind: 'ignore',
      content: Buffer.from(mergedIgnoreText),
      sourcePath: stagedIgnorePath,
    },
  ];
  for (const generated of generatedEntries) {
    const source = await readFile(generated.sourcePath);
    const target = await readOptionalFile(join(publicRoot, generated.relativePath));
    entries.push({
      relativePath: generated.relativePath,
      contentKind: generated.contentKind,
      contentDigest: sha256(generated.content),
      sourceDigest: sha256(source),
      targetDigest: target === null ? null : sha256(target),
    });
  }

  entries.sort((left, right) => left.relativePath.localeCompare(right.relativePath));
  const changes: ExportPlanEntry[] = entries.map((entry) => ({
    ...entry,
    action: entry.targetDigest === entry.contentDigest ? 'unchanged' : entry.targetDigest === null ? 'add' : 'update',
  }));

  return {
    stagingRoot,
    publicRoot,
    entries: changes,
    packageConflicts: packageResult.conflicts,
    preservedPaths: PRESERVED_PATHS,
  };
}

async function readPlannedContent(plan: ExportPlan, entry: ExportPlanEntry): Promise<Buffer> {
  if (entry.contentKind === 'package') {
    await assertSafeSource(plan.stagingRoot, 'package.json');
    const stagedPackage = await readJson(join(plan.stagingRoot, 'package.json'));
    const currentPackage = await readJson(join(plan.publicRoot, 'package.json'));
    const { manifest } = mergePackageManifest(stagedPackage, currentPackage);
    return Buffer.from(serializeJsonObject(manifest));
  }
  if (entry.contentKind === 'ignore') {
    await assertSafeSource(plan.stagingRoot, '.gitignore');
    const staged = await readFile(join(plan.stagingRoot, '.gitignore'), 'utf8');
    const current = (await readOptionalFile(join(plan.publicRoot, '.gitignore')))?.toString('utf8') ?? '';
    return Buffer.from(mergeIgnoreFiles(staged, current));
  }
  await assertSafeSource(plan.stagingRoot, entry.relativePath);
  return readFile(join(plan.stagingRoot, entry.relativePath));
}

export async function applyExportPlan(plan: ExportPlan): Promise<void> {
  const verifiedContents = new Map<string, Buffer>();
  for (const entry of plan.entries) {
    const sourcePath =
      entry.contentKind === 'package' ? 'package.json' : entry.contentKind === 'ignore' ? '.gitignore' : entry.relativePath;
    await assertSafeSource(plan.stagingRoot, sourcePath);
    const source = await readFile(join(plan.stagingRoot, sourcePath));
    if (sha256(source) !== entry.sourceDigest) {
      throw new Error(`The staged export changed after preview: ${entry.relativePath}`);
    }

    await assertSafeDestination(plan.publicRoot, entry.relativePath);
    const current = await readOptionalFile(join(plan.publicRoot, entry.relativePath));
    const currentDigest = current === null ? null : sha256(current);
    if (currentDigest !== entry.targetDigest) {
      throw new Error(`The public checkout changed after preview: ${entry.relativePath}`);
    }

    const content = await readPlannedContent(plan, entry);
    if (sha256(content) !== entry.contentDigest) {
      throw new Error(`The reviewed export output changed after preview: ${entry.relativePath}`);
    }
    verifiedContents.set(entry.relativePath, content);
  }

  for (const entry of plan.entries) {
    if (entry.action === 'unchanged') {
      continue;
    }
    const destination = join(plan.publicRoot, entry.relativePath);
    await assertSafeDestination(plan.publicRoot, entry.relativePath);
    await mkdir(dirname(destination), { recursive: true });
    await assertSafeDestination(plan.publicRoot, entry.relativePath);
    const current = await readOptionalFile(destination);
    const currentDigest = current === null ? null : sha256(current);
    if (currentDigest !== entry.targetDigest) {
      throw new Error(`The public checkout changed during apply: ${entry.relativePath}`);
    }
    const content = verifiedContents.get(entry.relativePath);
    if (content === undefined) {
      throw new Error(`The reviewed export content is missing: ${entry.relativePath}`);
    }
    await writeFile(destination, content);
  }
}

export function formatExportPlan(plan: ExportPlan): string {
  const changed = plan.entries.filter((entry) => entry.action !== 'unchanged');
  const counts = {
    add: changed.filter((entry) => entry.action === 'add').length,
    update: changed.filter((entry) => entry.action === 'update').length,
  };
  const lines = [
    `Export preview: ${counts.add} new, ${counts.update} changed, ${plan.entries.length - changed.length} unchanged`,
    'Public-owned paths preserved:',
    ...plan.preservedPaths.map((path) => `  ${path}`),
  ];

  if (changed.length > 0) {
    lines.push('Files to add or update:', ...changed.map((entry) => `  ${entry.action} ${entry.relativePath}`));
  } else {
    lines.push('Files to add or update: none');
  }

  const conflictGroups = Object.entries(plan.packageConflicts);
  if (conflictGroups.length > 0) {
    lines.push('Root package.json collisions (public values are retained):');
    for (const [field, names] of conflictGroups) {
      lines.push(`  ${field}: ${names.join(', ')}`);
    }
  } else {
    lines.push('Root package.json collisions: none');
  }

  lines.push('package-lock.json is not copied; run npm install in the public checkout after applying.');
  return `${lines.join('\n')}\n`;
}

function parseArguments(args: readonly string[]): CliOptions {
  if (args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  const modes = args.filter((argument): argument is ExportMode => argument === '--preview' || argument === '--apply');
  const paths = args.filter((argument) => !argument.startsWith('-'));
  const stagingDirectory = paths[0];
  const hasUnknownFlag = args.some((argument) => argument.startsWith('-') && argument !== '--preview' && argument !== '--apply');
  if (modes.length > 1 || stagingDirectory === undefined || paths.length !== 1 || hasUnknownFlag) {
    throw new Error('Usage: tsx scripts/applyExport.ts [--preview|--apply] /absolute/path/to/staging-export');
  }

  return {
    help: false,
    mode: modes[0] ?? '--preview',
    stagingDirectory,
  };
}

async function main(args: readonly string[] = process.argv.slice(2)): Promise<void> {
  const options = parseArguments(args);
  if (options.help) {
    process.stdout.write('Usage: tsx scripts/applyExport.ts [--preview|--apply] /absolute/path/to/staging-export\n');
    return;
  }

  const plan = await createExportPlan(options.stagingDirectory);
  process.stdout.write(formatExportPlan(plan));
  if (options.mode === '--apply') {
    await applyExportPlan(plan);
    process.stdout.write('Export applied. Regenerate the public package lockfile with npm install.\n');
  } else {
    process.stdout.write('Preview only. Review this plan, then rerun with --apply to write these changes.\n');
  }
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
