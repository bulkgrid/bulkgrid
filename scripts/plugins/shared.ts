import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export interface PluginOutput {
  readonly id: string;
  readonly directory: string;
  readonly manifest: string;
  readonly mcp: string;
  readonly files: readonly (readonly [destination: string, source: string])[];
}

export interface PackageInventoryEntry {
  readonly path: string;
  readonly sizeBytes: number;
  readonly sha256: string;
}

interface PortableAssetReferenceOptions {
  readonly manifest: Record<string, unknown>;
  readonly packageRoot: string;
  readonly files: ReadonlySet<string>;
  readonly label: string;
}

export type ExpectedPackageFiles = Map<string, Buffer>;
export type ExpectedPackages = Map<PluginOutput, ExpectedPackageFiles>;

export const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const PORTABLE_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
export const PORTABLE_MCP_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json';

export const OUTPUTS: readonly PluginOutput[] = [
  {
    id: 'bulkgrid',
    directory: 'plugins/bulkgrid',
    manifest: 'plugin.json',
    mcp: 'mcp.json',
    files: [
      ['plugin.json', 'packages/agent-core/metadata/plugin.json'],
      ['mcp.json', 'packages/agent-core/metadata/mcp.json'],
      ['assets/icon.png', 'packages/agent-core/assets/icon.png'],
      ['LICENSE', 'packages/agent-core/LICENSE'],
      ['NOTICE', 'packages/agent-core/NOTICE'],
      ['skills/LICENSE.md', 'skills/LICENSE.md'],
    ],
  },
  {
    id: 'bulkgrid-claude',
    directory: 'plugins/bulkgrid-claude',
    manifest: '.claude-plugin/plugin.json',
    mcp: '.mcp.json',
    files: [
      ['.claude-plugin/plugin.json', 'packages/agent-claude/templates/.claude-plugin/plugin.json'],
      ['.mcp.json', 'packages/agent-claude/templates/.mcp.json'],
      ['assets/icon.png', 'packages/agent-core/assets/icon.png'],
      ['LICENSE', 'packages/agent-core/LICENSE'],
      ['NOTICE', 'packages/agent-core/NOTICE'],
      ['skills/LICENSE.md', 'skills/LICENSE.md'],
    ],
  },
];

const SKILL_SOURCE = 'skills/bulkgrid-search';

const CATALOGS: readonly {
  readonly file: string;
  readonly name: string;
  readonly location: string;
  readonly shape: 'openai' | 'path';
}[] = [
  { file: '.agents/plugins/marketplace.json', name: 'bulkgrid', location: './plugins/bulkgrid', shape: 'openai' },
  { file: '.cursor-plugin/marketplace.json', name: 'bulkgrid', location: './plugins/bulkgrid', shape: 'path' },
  { file: '.claude-plugin/marketplace.json', name: 'bulkgrid', location: './plugins/bulkgrid-claude', shape: 'path' },
];

export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isMissingPath(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function requiredFile(files: ExpectedPackageFiles, file: string, label: string): Buffer {
  const contents = files.get(file);
  assert(contents, `${label} is missing`);
  return contents;
}

export function relative(root: string, target: string): string {
  return path.relative(root, target).split(path.sep).join('/');
}

export async function walkFiles(directory: string) {
  const rootInfo = await lstat(directory).catch((error: unknown) => {
    if (isMissingPath(error)) {
      return null;
    }
    throw error;
  });
  assert(rootInfo, `Missing directory: ${directory}`);
  assert(!rootInfo.isSymbolicLink(), `Symbolic links are not allowed: ${directory}`);
  assert(rootInfo.isDirectory(), `Expected a directory: ${directory}`);

  const files: string[] = [];
  const directories: string[] = [];
  async function visit(current: string) {
    const entries = await readdir(current, { withFileTypes: true });
    entries.sort((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0));
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const info = await lstat(fullPath);
      assert(!info.isSymbolicLink(), `Symbolic links are not allowed: ${fullPath}`);
      assert(info.isFile() || info.isDirectory(), `Unsupported filesystem entry: ${fullPath}`);
      if (info.isDirectory()) {
        directories.push(fullPath);
        await visit(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  await visit(directory);
  return { files, directories };
}

async function readJson(filePath: string, label: string): Promise<Record<string, unknown>> {
  const info = await lstat(filePath).catch((error: unknown) => {
    if (isMissingPath(error)) {
      return null;
    }
    throw error;
  });
  assert(info, `Missing required file: ${label}`);
  assert(!info.isSymbolicLink() && info.isFile(), `Expected a regular file: ${label}`);
  try {
    const value: unknown = JSON.parse(await readFile(filePath, 'utf8'));
    assert(isRecord(value), `${label} must contain a JSON object`);
    return value;
  } catch (error) {
    throw new Error(`Invalid JSON in ${label}: ${errorMessage(error)}`, { cause: error });
  }
}

export async function sourceFiles(output: PluginOutput): Promise<ExpectedPackageFiles> {
  const files = new Map();
  for (const [destination, source] of output.files) {
    const sourcePath = path.join(ROOT, source);
    const info = await lstat(sourcePath).catch((error: unknown) => {
      if (isMissingPath(error)) {
        return null;
      }
      throw error;
    });
    assert(info && !info.isSymbolicLink() && info.isFile(), `Missing regular source file: ${source}`);
    files.set(destination, await readFile(sourcePath));
  }

  const skillRoot = path.join(ROOT, SKILL_SOURCE);
  const skillTree = await walkFiles(skillRoot);
  assert(skillTree.files.length > 0, `Skill source has no files: ${SKILL_SOURCE}`);
  for (const file of skillTree.files) {
    const skillPath = relative(skillRoot, file);
    const segments = skillPath.toLowerCase().split('/');
    const name = segments.at(-1);
    assert(name, `Invalid skill source path: ${skillPath}`);
    assert(
      !segments.some(
        (segment) => segment.startsWith('.') || ['private', 'credentials', 'secrets', 'node_modules'].includes(segment),
      ) &&
        !/\.(?:pem|key)$/.test(name) &&
        !/^id_(?:rsa|dsa|ecdsa|ed25519)(?:\.|$)/.test(name) &&
        !/submission[-_]notes/.test(name),
      `Private or unsupported skill source file: ${skillPath}`,
    );
    files.set(`skills/bulkgrid-search/${skillPath}`, await readFile(file));
  }
  return files;
}

export async function buildExpectedPackages(): Promise<ExpectedPackages> {
  const packages: ExpectedPackages = new Map();
  for (const output of OUTPUTS) {
    packages.set(output, await sourceFiles(output));
  }

  const portableOutput = OUTPUTS.find(({ id }) => id === 'bulkgrid');
  const claudeOutput = OUTPUTS.find(({ id }) => id === 'bulkgrid-claude');
  assert(portableOutput && claudeOutput, 'Plugin output definitions are incomplete');
  const portable = packages.get(portableOutput);
  const claude = packages.get(claudeOutput);
  assert(portable && claude, 'Plugin source files could not be loaded');
  const portableManifest = parseMapJson(
    requiredFile(portable, 'plugin.json', 'Portable plugin manifest'),
    'portable plugin.json',
  );
  const portableMcp = parseMapJson(requiredFile(portable, 'mcp.json', 'Portable MCP configuration'), 'portable mcp.json');
  const claudeManifest = parseMapJson(
    requiredFile(claude, '.claude-plugin/plugin.json', 'Claude plugin manifest'),
    'Claude plugin.json',
  );
  const claudeMcp = parseMapJson(requiredFile(claude, '.mcp.json', 'Claude MCP configuration'), 'Claude .mcp.json');
  const coreWorkspace = await readJson(path.join(ROOT, 'packages/agent-core/package.json'), 'packages/agent-core/package.json');
  const claudeWorkspace = await readJson(
    path.join(ROOT, 'packages/agent-claude/package.json'),
    'packages/agent-claude/package.json',
  );

  validatePortableManifest(portableManifest, 'portable plugin.json');
  validatePortableMcp(portableMcp, 'portable mcp.json');
  validateClaudeManifest(claudeManifest, 'Claude plugin.json');
  validateClaudeMcp(claudeMcp, 'Claude .mcp.json');
  assert(portableManifest.version === claudeManifest.version, 'Portable and Claude plugin versions must match');
  assert(portableManifest.version === coreWorkspace.version, 'Portable plugin and agent-core workspace versions must match');
  assert(portableManifest.version === claudeWorkspace.version, 'Portable plugin and agent-claude workspace versions must match');
  assert(portableManifest.name === 'bulkgrid', 'The portable plugin name must remain bulkgrid');

  await validateSourceAllowlist();
  return packages;
}

function parseMapJson(contents: Buffer, label: string): Record<string, unknown> {
  try {
    const value: unknown = JSON.parse(contents.toString('utf8'));
    assert(isRecord(value), `${label} must contain a JSON object`);
    return value;
  } catch (error) {
    throw new Error(`Invalid JSON in ${label}: ${errorMessage(error)}`, { cause: error });
  }
}

async function validateSourceAllowlist() {
  const assets = await walkFiles(path.join(ROOT, 'packages/agent-core/assets'));
  assert(assets.directories.length === 0, 'Only a root-level package icon is allowed in agent-core assets');
  const [assetFile] = assets.files;
  assert(
    assets.files.length === 1 && assetFile && relative(path.join(ROOT, 'packages/agent-core/assets'), assetFile) === 'icon.png',
    'agent-core assets may contain only icon.png',
  );

  const templates = await walkFiles(path.join(ROOT, 'packages/agent-claude/templates'));
  const templateFiles = new Set(
    templates.files.map((file) => relative(path.join(ROOT, 'packages/agent-claude/templates'), file)),
  );
  const templateDirectories = new Set(
    templates.directories.map((directory) => relative(path.join(ROOT, 'packages/agent-claude/templates'), directory)),
  );
  assertSetEqual(templateFiles, new Set(['.claude-plugin/plugin.json', '.mcp.json']), 'Claude template files');
  assertSetEqual(templateDirectories, new Set(['.claude-plugin']), 'Claude template directories');
}

export async function validatePackageDirectory(packageRoot: string, output: PluginOutput, expectedFiles?: ExpectedPackageFiles) {
  expectedFiles ??= (await buildExpectedPackages()).get(output);
  assert(expectedFiles, `No expected package files are defined for ${output.id}`);
  const tree = await walkFiles(packageRoot);
  const actualFiles = new Set(tree.files.map((file) => relative(packageRoot, file)));
  const actualDirectories = new Set(tree.directories.map((directory) => relative(packageRoot, directory)));
  const expectedDirectories = parentDirectories(expectedFiles.keys());
  assertSetEqual(actualFiles, new Set(expectedFiles.keys()), `${output.id} package file inventory`);
  assertSetEqual(actualDirectories, expectedDirectories, `${output.id} package directory inventory`);

  for (const file of actualFiles) {
    const content = await readFile(path.join(packageRoot, file), 'utf8');
    assert(!containsKnownCredential(content), `Credential-like value in ${output.id}/${file}`);
  }

  const manifest: Record<string, unknown> = await readJson(
    path.join(packageRoot, output.manifest),
    `${output.id}/${output.manifest}`,
  );
  const mcp: Record<string, unknown> = await readJson(path.join(packageRoot, output.mcp), `${output.id}/${output.mcp}`);
  if (output.id === 'bulkgrid') {
    validatePortableManifest(manifest, output.manifest);
    validatePortableAssetReferences({ manifest, packageRoot, files: actualFiles, label: output.manifest });
    validatePortableMcp(mcp, output.mcp);
  } else {
    validateClaudeManifest(manifest, output.manifest);
    validateClaudeMcp(mcp, output.mcp);
    await validateIconReference(manifest, packageRoot, output.manifest);
  }
  await validateMarkdownReferences(packageRoot, actualFiles, output.id);
  return { files: [...actualFiles].sort(), manifest, mcp };
}

function validatePortableManifest(value: Record<string, unknown>, label: string) {
  const allowed = new Set([
    '$schema',
    'name',
    'version',
    'description',
    'author',
    'homepage',
    'repository',
    'license',
    'keywords',
    'extensions',
  ]);
  assertOnlyKeys(value, allowed, label);
  assert(value.$schema === PORTABLE_SCHEMA, `${label} must use the canonical Agent Plugins 1.0.0 schema`);
  assert(
    typeof value.name === 'string' &&
      value.name.length <= 64 &&
      /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(value.name) &&
      !value.name.includes('--') &&
      !value.name.includes('..'),
    `${label}.name is invalid`,
  );
  validateVersion(value.version, label);
  for (const field of ['description', 'homepage', 'repository', 'license']) {
    if (field in value) {
      assert(typeof value[field] === 'string', `${label}.${field} must be a string`);
    }
  }
  if ('author' in value) {
    assert(isRecord(value.author), `${label}.author must be an object`);
    assertOnlyKeys(value.author, new Set(['name', 'email', 'url']), `${label}.author`);
    for (const [field, content] of Object.entries(value.author)) {
      assert(typeof content === 'string', `${label}.author.${field} must be a string`);
    }
  }
  if ('keywords' in value) {
    assert(
      Array.isArray(value.keywords) && value.keywords.every((item) => typeof item === 'string'),
      `${label}.keywords must contain strings`,
    );
  }
  if ('extensions' in value) {
    assert(isRecord(value.extensions), `${label}.extensions must be an object`);
    for (const [namespace, extension] of Object.entries(value.extensions)) {
      assert(
        /^(?:[a-z0-9]+\.)+[a-z0-9.-]+$/.test(namespace) && isRecord(extension),
        `${label}.extensions.${namespace} is invalid`,
      );
    }
  }
}

function validatePortableMcp(value: Record<string, unknown>, label: string) {
  assertOnlyKeys(value, new Set(['$schema', 'mcpServers']), label);
  assert(value.$schema === PORTABLE_MCP_SCHEMA, `${label} must use the canonical Agent Plugins 1.0.0 MCP schema`);
  assert(isRecord(value.mcpServers), `${label}.mcpServers must be an object`);
  for (const [name, server] of Object.entries(value.mcpServers)) {
    assert(name.length > 0 && isRecord(server), `${label}.mcpServers.${name} must be a named object`);
    assertOnlyKeys(server, new Set(['type', 'url', 'headers']), `${label}.mcpServers.${name}`);
    assert(server.type === 'streamable-http', `${label}.mcpServers.${name}.type must be streamable-http`);
    validateHttpsUrl(server.url, `${label}.mcpServers.${name}.url`);
    if ('headers' in server) {
      validateHeaders(server.headers, `${label}.mcpServers.${name}.headers`);
    }
  }
}

function validateClaudeManifest(value: Record<string, unknown>, label: string) {
  const allowed = new Set([
    '$schema',
    'name',
    'displayName',
    'version',
    'description',
    'author',
    'homepage',
    'repository',
    'license',
    'keywords',
    'metadata',
    'icon',
    'supportUrl',
    'privacyPolicyUrl',
    'termsOfServiceUrl',
  ]);
  assertOnlyKeys(value, allowed, label);
  assert(typeof value.name === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.name), `${label}.name must be kebab-case`);
  validateVersion(value.version, label);
  for (const field of [
    'displayName',
    'description',
    'homepage',
    'repository',
    'license',
    'icon',
    'supportUrl',
    'privacyPolicyUrl',
    'termsOfServiceUrl',
  ]) {
    if (field in value) {
      assert(typeof value[field] === 'string', `${label}.${field} must be a string`);
    }
  }
  if ('author' in value) {
    assert(
      isRecord(value.author) && typeof value.author.name === 'string' && value.author.name.length > 0,
      `${label}.author.name is required`,
    );
    assertOnlyKeys(value.author, new Set(['name', 'email', 'url']), `${label}.author`);
    for (const content of Object.values(value.author)) {
      assert(typeof content === 'string', `${label}.author values must be strings`);
    }
  }
  if ('keywords' in value) {
    assert(
      Array.isArray(value.keywords) && value.keywords.every((item) => typeof item === 'string'),
      `${label}.keywords must contain strings`,
    );
  }
  if ('metadata' in value) {
    assert(isRecord(value.metadata), `${label}.metadata must be an object`);
  }
}

function validateClaudeMcp(value: Record<string, unknown>, label: string) {
  assertOnlyKeys(value, new Set(['mcpServers']), label);
  assert(isRecord(value.mcpServers), `${label}.mcpServers must be an object`);
  for (const [name, server] of Object.entries(value.mcpServers)) {
    assert(name.length > 0 && isRecord(server), `${label}.mcpServers.${name} must be a named object`);
    assertOnlyKeys(server, new Set(['type', 'url', 'headers']), `${label}.mcpServers.${name}`);
    assert(server.type === 'http', `${label}.mcpServers.${name}.type must be http`);
    validateHttpsUrl(server.url, `${label}.mcpServers.${name}.url`);
    if ('headers' in server) {
      validateHeaders(server.headers, `${label}.mcpServers.${name}.headers`);
    }
  }
}

function validateVersion(value: unknown, label: string) {
  assert(
    typeof value === 'string' &&
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(value),
    `${label}.version must be semantic versioning`,
  );
}

function validateHttpsUrl(value: unknown, label: string) {
  assert(typeof value === 'string' && value.length > 0, `${label} must be a URL`);
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be an absolute URL`);
  }
  assert(url.protocol === 'https:' && url.hostname && !url.username && !url.password, `${label} must be credential-free HTTPS`);
}

function validateHeaders(value: unknown, label: string) {
  assert(isRecord(value), `${label} must be an object`);
  for (const [name, content] of Object.entries(value)) {
    assert(typeof content === 'string', `${label}.${name} must be a string`);
    assert(
      !/authorization|api[-_]?key|token|secret|password|credential/i.test(name),
      `${label}.${name} cannot carry credentials`,
    );
    assert(!containsKnownCredential(content), `Credential-like value in ${label}.${name}`);
  }
}

function validatePortableAssetReferences({ manifest, packageRoot, files, label }: PortableAssetReferenceOptions) {
  const extensions = manifest.extensions;
  if (!isRecord(extensions)) {
    return;
  }
  const openAi = extensions['com.openai'];
  if (!openAi) {
    return;
  }
  assert(isRecord(openAi), `${label}.extensions.com.openai must be an object`);
  assert(isRecord(openAi.interface), `${label}.extensions.com.openai.interface must be an object`);
  const pluginInterface = openAi.interface;
  for (const field of ['logo', 'composerIcon']) {
    const reference = pluginInterface[field];
    assert(
      typeof reference === 'string' && reference.startsWith('./'),
      `${label}.extensions.com.openai.interface.${field} must be a package-relative asset`,
    );
    const resolved = path.resolve(packageRoot, reference.slice(2));
    assert(isWithin(packageRoot, resolved), `${label}.extensions.com.openai.interface.${field} escapes the package`);
    assert(
      files.has(relative(packageRoot, resolved)),
      `${label}.extensions.com.openai.interface.${field} references a missing asset`,
    );
  }
}

async function validateIconReference(manifest: Record<string, unknown>, packageRoot: string, label: string) {
  const icon = manifest.icon;
  if (typeof icon !== 'string' || !icon.startsWith('./')) {
    return;
  }
  const iconPath = path.resolve(packageRoot, icon.slice(2));
  assert(isWithin(packageRoot, iconPath), `${label}.icon escapes the plugin directory`);
  const info = await lstat(iconPath).catch((error: unknown) => {
    if (isMissingPath(error)) {
      return null;
    }
    throw error;
  });
  assert(info && info.isFile() && !info.isSymbolicLink(), `${label}.icon references a missing package asset`);
}

async function validateMarkdownReferences(packageRoot: string, files: ReadonlySet<string>, outputId: string) {
  for (const file of files) {
    if (!file.endsWith('.md')) {
      continue;
    }
    const markdown = await readFile(path.join(packageRoot, file), 'utf8');
    for (const target of markdownTargets(markdown)) {
      const local = target.split(/[?#]/, 1)[0];
      if (!local || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(local)) {
        continue;
      }
      let decoded;
      try {
        decoded = decodeURIComponent(local);
      } catch {
        throw new Error(`${outputId}/${file} has an invalid asset reference: ${target}`);
      }
      assert(
        !path.posix.isAbsolute(decoded) && !decoded.includes('\\'),
        `${outputId}/${file} has an absolute asset reference: ${target}`,
      );
      const resolved = path.resolve(packageRoot, path.dirname(file), decoded);
      assert(isWithin(packageRoot, resolved), `${outputId}/${file} references outside the package: ${target}`);
      const info = await lstat(resolved).catch((error: unknown) => {
        if (isMissingPath(error)) {
          return null;
        }
        throw error;
      });
      assert(info && info.isFile() && !info.isSymbolicLink(), `${outputId}/${file} references a missing asset: ${target}`);
    }
  }
}

function markdownTargets(markdown: string): string[] {
  const targets: string[] = [];
  const inline = /!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)/g;
  const references = /^\s*\[[^\]]+\]:\s*(?:<([^>]+)>|(\S+))/gm;
  for (const match of markdown.matchAll(inline)) {
    const target = match[1] ?? match[2];
    assert(target, 'Markdown link target is missing');
    targets.push(target);
  }
  for (const match of markdown.matchAll(references)) {
    const target = match[1] ?? match[2];
    assert(target, 'Markdown reference target is missing');
    targets.push(target);
  }
  return targets;
}

function parentDirectories(filePaths: Iterable<string>): Set<string> {
  const directories = new Set<string>();
  for (const file of filePaths) {
    let current = path.posix.dirname(file);
    while (current !== '.') {
      directories.add(current);
      current = path.posix.dirname(current);
    }
  }
  return directories;
}

function assertOnlyKeys(value: unknown, allowed: ReadonlySet<string>, label: string) {
  assert(isRecord(value), `${label} must be an object`);
  for (const key of Object.keys(value)) {
    assert(allowed.has(key), `${label} contains unsupported field: ${key}`);
  }
}

function assertSetEqual(actual: ReadonlySet<string>, expected: ReadonlySet<string>, label: string) {
  const missing = [...expected].filter((item) => !actual.has(item));
  const unexpected = [...actual].filter((item) => !expected.has(item));
  assert(
    missing.length === 0 && unexpected.length === 0,
    `${label} differs (missing: ${missing.join(', ') || 'none'}; unexpected: ${unexpected.join(', ') || 'none'})`,
  );
}

function isWithin(root: string, candidate: string) {
  const relativePath = path.relative(root, candidate);
  return (
    relativePath === '' || (!relativePath.startsWith(`..${path.sep}`) && relativePath !== '..' && !path.isAbsolute(relativePath))
  );
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
    assert(!info?.isSymbolicLink(), `Symbolic link in generated path: ${current}`);
    if (info && current !== absolute) {
      assert(info.isDirectory(), `Non-directory generated path parent: ${current}`);
    }
  }
}

function containsKnownCredential(text: string) {
  return (
    /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/.test(text) ||
    /\bAKIA[0-9A-Z]{16}\b/.test(text) ||
    /\bbg_live_[A-Za-z0-9_-]{12,}\b/.test(text) ||
    /\bgh[pousr]_[A-Za-z0-9_]{30,}\b/.test(text) ||
    /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/.test(text) ||
    /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/.test(text)
  );
}

export async function compareGeneratedOutput(output: PluginOutput, expectedFiles: ExpectedPackageFiles) {
  const packageRoot = path.join(ROOT, output.directory);
  const tree = await walkFiles(packageRoot);
  const actualFiles = new Set(tree.files.map((file) => relative(packageRoot, file)));
  const actualDirectories = new Set(tree.directories.map((directory) => relative(packageRoot, directory)));
  assertSetEqual(actualFiles, new Set(expectedFiles.keys()), `${output.directory} generated files`);
  assertSetEqual(actualDirectories, parentDirectories(expectedFiles.keys()), `${output.directory} generated directories`);
  for (const [file, expected] of expectedFiles) {
    assert(
      (await readFile(path.join(packageRoot, file))).equals(expected),
      `Generated output is stale: ${output.directory}/${file}`,
    );
  }
  await validatePackageDirectory(packageRoot, output, expectedFiles);
}

export async function checkGeneratedOutputs(): Promise<ExpectedPackages> {
  const expected = await buildExpectedPackages();
  for (const [output, files] of expected) {
    await assertNoSymlinkAncestors(path.join(ROOT, output.directory));
    await compareGeneratedOutput(output, files);
  }
  await validateCatalogReferences();
  return expected;
}

export async function validateCatalogReferences() {
  for (const catalog of CATALOGS) {
    const catalogPath = path.join(ROOT, catalog.file);
    const manifest = await readJson(catalogPath, catalog.file);
    assert(Array.isArray(manifest.plugins), `${catalog.file}.plugins must be an array`);
    const entries = manifest.plugins.filter(
      (entry): entry is Record<string, unknown> => isRecord(entry) && entry.name === catalog.name,
    );
    assert(entries.length === 1, `${catalog.file} must contain exactly one ${catalog.name} entry`);
    const entry = entries[0];
    assert(entry, `${catalog.file} plugin entry is missing`);
    assert(!Object.hasOwn(entry, 'version'), `${catalog.file} must leave plugin versions unpinned`);

    let location;
    if (catalog.shape === 'openai') {
      const source = entry.source;
      assert(isRecord(source) && source.source === 'local', `${catalog.file} must use a local plugin source`);
      location = source.path;
    } else {
      location = entry.source;
    }
    assert(typeof location === 'string', `${catalog.file} plugin location must be a string`);
    assert(location === catalog.location, `${catalog.file} must point to ${catalog.location}`);
    const target = path.resolve(ROOT, location.slice(2));
    assert(isWithin(ROOT, target), `${catalog.file} points outside the repository`);
    await assertNoSymlinkAncestors(target);
    const info = await lstat(target).catch((error: unknown) => {
      if (isMissingPath(error)) {
        return null;
      }
      throw error;
    });
    assert(info && info.isDirectory(), `${catalog.file} points to a missing plugin package`);
  }
}

export async function inventoryPackage(packageRoot: string): Promise<PackageInventoryEntry[]> {
  const tree = await walkFiles(packageRoot);
  const paths = tree.files.map((file) => relative(packageRoot, file)).sort();
  const inventory = [];
  for (const file of paths) {
    const contents = await readFile(path.join(packageRoot, file));
    inventory.push({ path: file, sizeBytes: contents.length, sha256: createHash('sha256').update(contents).digest('hex') });
  }
  return inventory;
}

export function packageRootFor(output: PluginOutput, baseDirectory = path.join(ROOT, 'plugins')) {
  return path.join(baseDirectory, output.id);
}

export async function packageVersion(packageRoot: string, output: PluginOutput): Promise<string> {
  const manifest = await readJson(path.join(packageRoot, output.manifest), `${output.id}/${output.manifest}`);
  assert(typeof manifest.version === 'string', `${output.id}/${output.manifest}.version must be a string`);
  return manifest.version;
}
