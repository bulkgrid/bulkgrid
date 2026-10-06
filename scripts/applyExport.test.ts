import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { watch } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { applyExportPlan, createExportPlan, formatExportPlan } from './applyExport.js';

const REPOSITORY_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TSX_CLI_PATH = resolve(REPOSITORY_ROOT, 'node_modules/.bin/tsx');
const APPLY_SCRIPT_PATH = resolve(REPOSITORY_ROOT, 'scripts/applyExport.ts');
const CHECK_SCRIPT_PATH = resolve(REPOSITORY_ROOT, 'scripts/checkExport.ts');
const fixtures: string[] = [];
const requiredTrees = ['packages/sdk', 'packages/cli', 'packages/contracts', 'docs', 'examples', 'openapi'];
const requiredFiles = ['export-manifest.json'];
const stagedPublicOwnedPaths = [
  '.github/workflows/ci.yml',
  'eslint.config.js',
  'tsconfig.base.json',
  'tsconfig.scripts.json',
  'vitest.config.ts',
  'scripts/applyExport.mjs',
  'scripts/applyExport.test.mjs',
  'scripts/applyExport.ts',
  'scripts/checkExport.mjs',
  'scripts/checkExport.ts',
  'scripts/generateOpenApi.mjs',
  'scripts/generateOpenApi.ts',
  'scripts/plugins/build.mjs',
  'scripts/plugins/build.ts',
  'docs/scripts/checkDocs.mjs',
  'docs/scripts/checkDocs.ts',
];
const preservedFiles = [
  'README.md',
  'AGENT_PLUGINS.md',
  'PLUGIN_RELEASE.md',
  'MAINTAINERS.md',
  'CONTRIBUTING.md',
  'package-lock.json',
  'skills/bulkgrid-search/SKILL.md',
  'skills/bulkgrid-sources/SKILL.md',
  'plugins/bulkgrid/plugin.json',
  'packages/agent-core/metadata.json',
  'packages/agent-claude/package.json',
  '.claude-plugin/marketplace.json',
  '.cursor-plugin/marketplace.json',
  '.agents/plugins/marketplace.json',
  'marketplace.json',
  '.github/workflows/ci.yml',
  '.github/workflows/plugin-release.yml',
  '.github/workflows/publish-python-sdk.yml',
  'eslint.config.js',
  'tsconfig.base.json',
  'tsconfig.scripts.json',
  'vitest.config.ts',
  'scripts/applyExport.ts',
  'scripts/applyExport.test.ts',
  'scripts/checkExport.ts',
  'scripts/generateOpenApi.ts',
  'scripts/plugins/build.ts',
  'docs/scripts/checkDocs.ts',
];

interface FixtureOptions {
  readonly includePython?: boolean;
}

interface Fixture {
  readonly fixtureRoot: string;
  readonly staging: string;
  readonly publicRoot: string;
}

afterEach(async () => {
  await Promise.all(fixtures.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

async function put(root: string, relativePath: string, content: string): Promise<void> {
  const path = join(root, relativePath);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function setRootScript(manifestPath: string, name: string, command: string): Promise<void> {
  const manifest: unknown = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (!isRecord(manifest) || !isRecord(manifest.scripts)) {
    throw new Error('Fixture package scripts are missing or invalid.');
  }
  manifest.scripts[name] = command;
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}

async function makeFixture({ includePython = true }: FixtureOptions = {}): Promise<Fixture> {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'bulkgrid-export-apply-'));
  fixtures.push(fixtureRoot);
  const staging = join(fixtureRoot, 'staging');
  const publicRoot = join(fixtureRoot, 'public');
  await mkdir(staging);
  await mkdir(publicRoot);

  for (const tree of requiredTrees) {
    await mkdir(join(staging, tree), { recursive: true });
    await put(staging, `${tree}/exported.txt`, `staged ${tree}\n`);
  }
  await put(staging, 'examples/run.js', 'export default true;\n');
  await put(staging, 'examples/scripts/run.js', 'export default true;\n');
  if (includePython) {
    await put(staging, 'packages/sdk-python/exported.txt', 'staged Python SDK\n');
    await put(staging, 'packages/sdk-python/.gitignore', '__pycache__/\n');
    await put(staging, '.github/workflows/check-python-sdk.yml', 'staged Python SDK check workflow\n');
    await put(staging, '.github/workflows/publish-python-sdk.yml', 'staged Python SDK publisher must be ignored\n');
  }
  for (const path of requiredFiles) {
    await put(staging, path, `staged ${path}\n`);
  }
  for (const path of stagedPublicOwnedPaths) {
    await put(staging, path, `staged attempt to replace ${path}\n`);
  }
  await put(staging, '.gitignore', 'node_modules/\nstage-only.log\n');
  await put(
    staging,
    'package.json',
    JSON.stringify(
      {
        name: 'bulkgrid',
        workspaces: ['packages/*'],
        scripts: {
          build: 'npm run build -w @bulkgrid/sdk',
          check: 'npm run build && npm test',
          'docs:check': 'node docs/scripts/checkDocs.mjs',
          'export:apply': 'node scripts/applyExport.mjs',
          'export:check': 'node scripts/checkExport.mjs',
          'openapi:generate': 'node scripts/generateOpenApi.mjs',
          'example:run': 'node examples/run.js',
          'example:nested': 'node examples/scripts/run.js',
        },
        devDependencies: { typescript: '5.9.3', tsdown: '0.22.14' },
      },
      null,
      2,
    ),
  );
  await put(staging, 'package-lock.json', 'staged lockfile must be ignored\n');
  for (const path of preservedFiles) {
    await put(staging, path, `staged attempt to replace ${path}\n`);
    await put(publicRoot, path, `public ${path}\n`);
  }

  await put(publicRoot, '.gitignore', 'node_modules/\ncoverage/\npublic-plugin-output/\n');
  await put(
    publicRoot,
    'package.json',
    JSON.stringify(
      {
        name: 'bulkgrid',
        workspaces: ['packages/*', 'plugins/*'],
        scripts: {
          build: 'npm run build:plugins && npm run build -w @bulkgrid/sdk',
          check: 'npm run check:plugins && npm run build && npm test',
          'docs:check': 'tsx docs/scripts/checkDocs.ts',
          'export:apply': 'tsx scripts/applyExport.ts',
          'export:check': 'tsx scripts/checkExport.ts',
          'openapi:generate': 'tsx scripts/generateOpenApi.ts',
          'agent:check': 'node scripts/plugins/check.mjs',
        },
        devDependencies: { typescript: '5.8.0', vitest: '4.1.10' },
      },
      null,
      2,
    ),
  );
  await put(publicRoot, 'packages/sdk/src/index.ts', 'public SDK source\n');
  await put(publicRoot, '.github/workflows/check-python-sdk.yml', 'public Python SDK workflow\n');

  return { fixtureRoot, staging, publicRoot };
}

function runTsx(scriptPath: string, args: readonly string[], cwd = REPOSITORY_ROOT) {
  return spawnSync(process.execPath, [TSX_CLI_PATH, scriptPath, ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function runTsxEval(program: string, cwd: string) {
  return spawnSync(process.execPath, [TSX_CLI_PATH, '--eval', program], {
    cwd,
    encoding: 'utf8',
  });
}

describe('applyExport', () => {
  it('preserves public-owned paths, filters docs scripts, and merges the root manifest', async () => {
    const { staging, publicRoot } = await makeFixture();
    const plan = await createExportPlan(staging, publicRoot);
    const preview = formatExportPlan(plan);
    const plannedPaths = plan.entries.map((entry) => entry.relativePath);

    expect(preview).toMatch(/Root package\.json collisions \(public values are retained\):/);
    expect(preview).toMatch(/scripts: build, check/);
    expect(preview).toMatch(/package-lock\.json is not copied/);
    expect(preview).toMatch(/AGENT_PLUGINS\.md/);
    expect(preview).toMatch(/scripts\/\*\*/);
    expect(preview).toMatch(/docs\/scripts\/\*\*/);
    expect(plannedPaths).toContain('export-manifest.json');
    expect(plannedPaths).toContain('examples/run.js');
    expect(plannedPaths).toContain('examples/scripts/run.js');
    expect(plannedPaths).not.toContain('.github/workflows/ci.yml');
    expect(plannedPaths).not.toContain('eslint.config.js');
    expect(plannedPaths).not.toContain('tsconfig.base.json');
    expect(plannedPaths.some((path) => path.startsWith('docs/scripts/'))).toBe(false);
    expect(await readFile(join(publicRoot, 'packages/sdk/src/index.ts'), 'utf8')).toBe('public SDK source\n');

    await applyExportPlan(plan);

    for (const path of preservedFiles) {
      expect(await readFile(join(publicRoot, path), 'utf8'), `${path} must remain public-owned`).toBe(`public ${path}\n`);
    }
    expect(await readFile(join(publicRoot, 'packages/sdk/exported.txt'), 'utf8')).toBe('staged packages/sdk\n');
    expect(await readFile(join(publicRoot, 'examples/run.js'), 'utf8')).toBe('export default true;\n');
    expect(await readFile(join(publicRoot, 'examples/scripts/run.js'), 'utf8')).toBe('export default true;\n');
    expect(await readFile(join(publicRoot, 'packages/sdk-python/exported.txt'), 'utf8')).toBe('staged Python SDK\n');
    expect(await readFile(join(publicRoot, 'packages/sdk-python/.gitignore'), 'utf8')).toBe('__pycache__/\n');
    expect(await readFile(join(publicRoot, '.github/workflows/check-python-sdk.yml'), 'utf8')).toBe(
      'staged Python SDK check workflow\n',
    );
    expect(await readFile(join(publicRoot, '.github/workflows/ci.yml'), 'utf8')).toBe('public .github/workflows/ci.yml\n');
    expect(existsSync(join(publicRoot, 'scripts/checkExport.mjs'))).toBe(false);
    expect(existsSync(join(publicRoot, 'docs/scripts/checkDocs.mjs'))).toBe(false);

    const packageJson: unknown = JSON.parse(await readFile(join(publicRoot, 'package.json'), 'utf8'));
    expect(packageJson).toMatchObject({
      scripts: {
        build: 'npm run build:plugins && npm run build -w @bulkgrid/sdk',
        check: 'npm run check:plugins && npm run build && npm test',
        'docs:check': 'tsx docs/scripts/checkDocs.ts',
        'export:apply': 'tsx scripts/applyExport.ts',
        'export:check': 'tsx scripts/checkExport.ts',
        'openapi:generate': 'tsx scripts/generateOpenApi.ts',
        'example:run': 'node examples/run.js',
        'example:nested': 'node examples/scripts/run.js',
        'agent:check': 'node scripts/plugins/check.mjs',
      },
      workspaces: ['packages/*', 'plugins/*'],
      devDependencies: { typescript: '5.8.0', tsdown: '0.22.14', vitest: '4.1.10' },
    });
    expect(await readFile(join(publicRoot, 'package-lock.json'), 'utf8')).toBe('public package-lock.json\n');
    expect(await readFile(join(publicRoot, '.gitignore'), 'utf8')).toContain('public-plugin-output/');
    expect(await readFile(join(publicRoot, '.gitignore'), 'utf8')).toContain('stage-only.log');
  });

  it('does not require public-owned scripts, configs, or CI files in the staging export', async () => {
    const { staging, publicRoot } = await makeFixture();
    await Promise.all(stagedPublicOwnedPaths.map((path) => rm(join(staging, path), { force: true })));

    const plan = await createExportPlan(staging, publicRoot);

    expect(plan.entries.map((entry) => entry.relativePath)).toContain('export-manifest.json');
    expect(plan.entries.map((entry) => entry.relativePath)).not.toContain('.github/workflows/ci.yml');
  });

  it.each([
    'node scripts/plugins/check.mjs',
    'node scripts/plugins/check.mjs; echo done',
    'node scripts/plugins/check.mjs&&echo done',
    'node scripts/checkExport.mjs>export.log',
    'node --import=./scripts/checkExport.mjs -e ""',
    'node scripts/checkExport.mjs<input.txt',
    'node --test scripts/plugins/*.test.mjs',
    'node docs/scripts/checkDocs.mjs | cat',
  ])('rejects newly imported commands that reference retired tooling: %s', async (command) => {
    const { staging, publicRoot } = await makeFixture();
    const manifestPath = join(staging, 'package.json');
    await setRootScript(manifestPath, 'legacy:tools', command);

    await expect(createExportPlan(staging, publicRoot)).rejects.toThrow(
      /New root package\.json script references public-owned JavaScript tooling: legacy:tools/,
    );
  });

  it('rejects symlinks in staged export trees', async () => {
    const { fixtureRoot, staging, publicRoot } = await makeFixture();
    const outside = join(fixtureRoot, 'outside.txt');
    await writeFile(outside, 'outside\n');
    await symlink(outside, join(staging, 'docs', 'linked.txt'));

    await expect(createExportPlan(staging, publicRoot)).rejects.toThrow(/Symbolic links are not allowed in an export/);
  });

  it('rejects symlinks in staged parent paths', async () => {
    const { fixtureRoot, staging, publicRoot } = await makeFixture();
    const outside = join(fixtureRoot, 'outside-packages');
    for (const directory of ['sdk', 'cli', 'contracts']) {
      await put(outside, `${directory}/exported.txt`, `outside ${directory}\n`);
    }
    await rm(join(staging, 'packages'), { recursive: true, force: true });
    await symlink(outside, join(staging, 'packages'));

    await expect(createExportPlan(staging, publicRoot)).rejects.toThrow(/Symbolic links are not allowed in an export/);
  });

  it('applies successfully when the optional Python SDK export is absent', async () => {
    const { staging, publicRoot } = await makeFixture({ includePython: false });
    const plan = await createExportPlan(staging, publicRoot);

    await applyExportPlan(plan);

    await expect(readFile(join(publicRoot, 'packages/sdk-python/exported.txt'))).rejects.toMatchObject({ code: 'ENOENT' });
    expect(await readFile(join(publicRoot, '.github/workflows/check-python-sdk.yml'), 'utf8')).toBe(
      'public Python SDK workflow\n',
    );
  });

  it('rejects symlinks in public export destinations', async () => {
    const { fixtureRoot, staging, publicRoot } = await makeFixture();
    const outside = join(fixtureRoot, 'outside-docs');
    await mkdir(outside);
    await rm(join(publicRoot, 'docs'), { recursive: true, force: true });
    await symlink(outside, join(publicRoot, 'docs'));

    await expect(createExportPlan(staging, publicRoot)).rejects.toThrow(/Symbolic links are not allowed in the public checkout/);
  });

  it('requires the public checkout to match the preview before applying', async () => {
    const { staging, publicRoot } = await makeFixture();
    const plan = await createExportPlan(staging, publicRoot);
    await put(publicRoot, 'packages/sdk/exported.txt', 'concurrent public edit\n');

    await expect(applyExportPlan(plan)).rejects.toThrow(/The public checkout changed after preview/);
    expect(await readFile(join(publicRoot, '.github/workflows/ci.yml'), 'utf8')).toBe('public .github/workflows/ci.yml\n');
  });

  it('preserves concurrent edits to an export-owned file after application starts writing', async () => {
    const { staging, publicRoot } = await makeFixture();
    await put(publicRoot, 'docs/exported.txt', 'public docs before export\n');
    const plan = await createExportPlan(staging, publicRoot);
    const target = join(publicRoot, 'packages/sdk/exported.txt');
    const watchedPath = join(publicRoot, 'docs/exported.txt');
    let concurrentEdit: Promise<void> | undefined;
    const watcher = watch(watchedPath, { persistent: false }, () => {
      concurrentEdit ??= writeFile(target, 'concurrent user edit\n');
    });
    try {
      await expect(applyExportPlan(plan)).rejects.toThrow(
        /The public checkout changed during apply: packages\/sdk\/exported\.txt/,
      );
      if (concurrentEdit === undefined) {
        throw new Error('The concurrent edit watcher did not observe the first exported file write.');
      }
      await concurrentEdit;
      expect(await readFile(target, 'utf8')).toBe('concurrent user edit\n');
    } finally {
      watcher.close();
    }
  });

  it('runs preview from the CLI without changing public files', async () => {
    const { staging, publicRoot } = await makeFixture();
    const packageBefore = await readFile(join(publicRoot, 'package.json'), 'utf8');
    const ignoreBefore = await readFile(join(publicRoot, '.gitignore'), 'utf8');
    const result = runTsx(APPLY_SCRIPT_PATH, ['--preview', staging]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Preview only.');
    expect(await readFile(join(publicRoot, 'package.json'), 'utf8')).toBe(packageBefore);
    expect(await readFile(join(publicRoot, '.gitignore'), 'utf8')).toBe(ignoreBefore);
    await expect(readFile(join(publicRoot, 'packages/sdk/exported.txt'))).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('shows help and rejects invalid CLI arguments', async () => {
    const help = runTsx(APPLY_SCRIPT_PATH, ['--help']);
    expect(help.status).toBe(0);
    expect(help.stdout).toContain('Usage: tsx scripts/applyExport.ts');

    const { staging } = await makeFixture();
    const invalid = runTsx(APPLY_SCRIPT_PATH, ['--apply', '--preview', staging]);
    expect(invalid.status).toBe(1);
    expect(invalid.stderr).toContain('Usage: tsx scripts/applyExport.ts');
  });

  it('imports the CLI modules without running their commands', async () => {
    const importRoot = await mkdtemp(join(tmpdir(), 'bulkgrid-export-import-'));
    fixtures.push(importRoot);
    await writeFile(join(importRoot, '.env'), '');
    const program = `import(${JSON.stringify(pathToFileURL(APPLY_SCRIPT_PATH).href)}).then(() => import(${JSON.stringify(pathToFileURL(CHECK_SCRIPT_PATH).href)})).then(() => process.stdout.write('imported\\n'));`;
    const result = runTsxEval(program, importRoot);

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('imported\n');
    expect(result.stderr).toBe('');
  });

  it('rejects invalid check CLI arguments without scanning files', async () => {
    const { publicRoot } = await makeFixture();
    const result = runTsx(CHECK_SCRIPT_PATH, ['--unexpected'], publicRoot);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Usage: tsx scripts/checkExport.ts');
  });
});
