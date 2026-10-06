import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { appendFile, cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, it } from 'vitest';
import { createPluginArchives } from './archive.js';
import { buildPlugins } from './build.js';
import { checkPlugins } from './check.js';
import {
  OUTPUTS,
  ROOT,
  buildExpectedPackages,
  isRecord,
  inventoryPackage,
  packageRootFor,
  validatePackageDirectory,
} from './shared.js';
import type { ExpectedPackages, PluginOutput } from './shared.js';

const archiveHelper = path.join(ROOT, 'scripts/plugins/archive.py');
const TSX_CLI = fileURLToPath(import.meta.resolve('tsx/cli'));
const runArchiveHelper = (...args: string[]): string =>
  execFileSync('python3', [archiveHelper, ...args], { cwd: ROOT, encoding: 'utf8' }).trim();
const runTsx = (scriptPath: string, ...args: string[]): string =>
  execFileSync(process.execPath, [TSX_CLI, scriptPath, ...args], { cwd: ROOT, encoding: 'utf8' });

function runTsxResult(scriptPath: string, ...args: string[]) {
  return spawnSync(process.execPath, [TSX_CLI, scriptPath, ...args], { cwd: ROOT, encoding: 'utf8' });
}

function assertCliRejects(scriptPath: string, args: readonly string[], message: RegExp) {
  const result = runTsxResult(scriptPath, ...args);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, message);
}

function parseJsonObject(contents: string): Record<string, unknown> {
  const value: unknown = JSON.parse(contents);
  assert.ok(isRecord(value));
  return value;
}

function outputById(id: string): PluginOutput {
  const output = OUTPUTS.find((candidate) => candidate.id === id);
  assert.ok(output, `Missing plugin output definition: ${id}`);
  return output;
}

function expectedFilesFor(expected: ExpectedPackages, output: PluginOutput) {
  const files = expected.get(output);
  assert.ok(files, `Missing expected package files for ${output.id}`);
  return files;
}

type ArchiveBuild = Awaited<ReturnType<typeof createPluginArchives>>;

function archiveArtifactFor(build: ArchiveBuild, pluginId: string) {
  const artifact = build.record.artifacts.find((candidate) => candidate.plugin === pluginId);
  assert.ok(artifact, `Missing archive artifact for ${pluginId}`);
  return artifact;
}

async function copyPackage(source: string, destination: string): Promise<string> {
  await cp(source, destination, { recursive: true });
  return destination;
}

describe('plugin packaging', () => {
  let temporaryRoot = '';
  let expected: ExpectedPackages = new Map();
  let archiveBuildOne: ArchiveBuild | undefined;
  let archiveBuildTwo: ArchiveBuild | undefined;
  let canonicalVersion = '';
  const extracted = new Map<string, string>();

  function firstArchiveBuild(): ArchiveBuild {
    assert.ok(archiveBuildOne, 'First archive build was not initialized');
    return archiveBuildOne;
  }

  function secondArchiveBuild(): ArchiveBuild {
    assert.ok(archiveBuildTwo, 'Second archive build was not initialized');
    return archiveBuildTwo;
  }

  beforeAll(async () => {
    temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'bulkgrid-plugin-tests-'));
    await writeFile(path.join(temporaryRoot, 'package.json'), JSON.stringify({ type: 'module' }));
    expected = await buildExpectedPackages();
    const metadata = parseJsonObject(await readFile(path.join(ROOT, 'packages/agent-core/metadata/plugin.json'), 'utf8'));
    assert.ok(typeof metadata.version === 'string');
    canonicalVersion = metadata.version;
    await checkPlugins();

    const firstOutput = path.join(temporaryRoot, 'release-one');
    const secondOutput = path.join(temporaryRoot, 'release-two');
    const firstBuild = await createPluginArchives({ outputDirectory: firstOutput });
    archiveBuildOne = firstBuild;
    archiveBuildTwo = await createPluginArchives({ outputDirectory: secondOutput });

    for (const output of OUTPUTS) {
      const artifact = archiveArtifactFor(firstBuild, output.id);
      const packageDirectory = path.join(temporaryRoot, 'extracted', output.id);
      await mkdir(packageDirectory, { recursive: true });
      runArchiveHelper('extract', path.join(firstOutput, artifact.file), packageDirectory);
      extracted.set(output.id, packageDirectory);
    }
  });

  afterAll(async () => {
    if (temporaryRoot) {
      await rm(temporaryRoot, { recursive: true, force: true });
    }
  });

  it('validates and inspects the exact extracted release archives', async () => {
    const firstBuild = firstArchiveBuild();
    const record = firstBuild.record;
    assert.equal(record.pluginVersion, canonicalVersion);
    assert.equal(record.source.commit.length, 40);
    assert.equal(record.verification.generatedOutputDrift, 'passed');
    assert.equal(record.verification.archiveIntegrityAndExtraction, 'passed');
    assert.equal(record.verification.clientRuntimeAcceptance, 'pending');
    assert.deepEqual(Object.values(record.acceptedClientVersions), [null, null, null, null, null]);

    for (const output of OUTPUTS) {
      const packageDirectory = extracted.get(output.id);
      assert.ok(packageDirectory, `Missing extracted package for ${output.id}`);
      const checked = await validatePackageDirectory(packageDirectory, output, expectedFilesFor(expected, output));
      const artifact = archiveArtifactFor(firstBuild, output.id);
      assert.deepEqual(
        artifact.files.map(({ path: file }) => file),
        checked.files,
      );
      assert.deepEqual(artifact.files, await inventoryPackage(packageDirectory));
      assert.equal(artifact.file, `${output.id}-${canonicalVersion}.zip`);
      assert.equal(artifact.sha256.length, 64);
      assert(checked.files.includes(output.manifest), 'Manifest must be at the package root path');
      assert(
        !checked.files.some((file) => file.includes('bulkgrid-sources')),
        'Mutation skill must not ship in retrieval packages',
      );
    }
    assert(archiveArtifactFor(firstBuild, 'bulkgrid').files.some(({ path: file }) => file === 'plugin.json'));
    assert(
      archiveArtifactFor(firstBuild, 'bulkgrid-claude').files.some(({ path: file }) => file === '.claude-plugin/plugin.json'),
    );
  });

  it('rejects local skill references that escape the package root', async () => {
    const fixture = path.join(temporaryRoot, 'escape-fixture');
    const portablePackage = extracted.get('bulkgrid');
    assert.ok(portablePackage);
    await copyPackage(portablePackage, fixture);
    await appendFile(path.join(fixture, 'skills/bulkgrid-search/SKILL.md'), '\n[escape](../../../../outside.md)\n');
    const portableOutput = outputById('bulkgrid');
    await assert.rejects(
      validatePackageDirectory(fixture, portableOutput, expectedFilesFor(expected, portableOutput)),
      /outside the package/,
    );
  });

  it('rejects missing icon assets and missing referenced assets', async () => {
    const missingFile = path.join(temporaryRoot, 'missing-file-fixture');
    const portablePackage = extracted.get('bulkgrid');
    assert.ok(portablePackage);
    const portableOutput = outputById('bulkgrid');
    const portableFiles = expectedFilesFor(expected, portableOutput);
    await copyPackage(portablePackage, missingFile);
    await rm(path.join(missingFile, 'assets/icon.png'));
    await assert.rejects(validatePackageDirectory(missingFile, portableOutput, portableFiles), /inventory differs/);

    const missingReference = path.join(temporaryRoot, 'missing-reference-fixture');
    await copyPackage(portablePackage, missingReference);
    const manifestPath = path.join(missingReference, 'plugin.json');
    const manifest = parseJsonObject(await readFile(manifestPath, 'utf8'));
    const extensions = manifest.extensions;
    assert.ok(isRecord(extensions));
    const openAi = extensions['com.openai'];
    assert.ok(isRecord(openAi));
    const pluginInterface = openAi.interface;
    assert.ok(isRecord(pluginInterface));
    pluginInterface.logo = './assets/missing.png';
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    await assert.rejects(validatePackageDirectory(missingReference, portableOutput, portableFiles), /missing asset/);
  });

  it('rejects private files and symbolic links in package trees', async () => {
    const privateFile = path.join(temporaryRoot, 'private-file-fixture');
    const portablePackage = extracted.get('bulkgrid');
    assert.ok(portablePackage);
    const portableOutput = outputById('bulkgrid');
    const portableFiles = expectedFilesFor(expected, portableOutput);
    await copyPackage(portablePackage, privateFile);
    await writeFile(path.join(privateFile, '.env'), 'BULKGRID_API_KEY=example\n');
    await assert.rejects(validatePackageDirectory(privateFile, portableOutput, portableFiles), /inventory differs/);

    const credentialFile = path.join(temporaryRoot, 'credential-fixture');
    await copyPackage(portablePackage, credentialFile);
    await appendFile(path.join(credentialFile, 'skills/bulkgrid-search/SKILL.md'), '\nbg_live_12345678901234567890\n');
    await assert.rejects(validatePackageDirectory(credentialFile, portableOutput, portableFiles), /Credential-like value/);

    const symlinkPackage = path.join(temporaryRoot, 'symlink-fixture');
    await copyPackage(portablePackage, symlinkPackage);
    const target = path.join(temporaryRoot, 'outside.txt');
    await writeFile(target, 'outside');
    await symlink(target, path.join(symlinkPackage, 'outside.txt'));
    await assert.rejects(validatePackageDirectory(symlinkPackage, portableOutput, portableFiles), /Symbolic links/);
  });

  it('rejects missing Claude HTTP transport declarations', async () => {
    const fixture = path.join(temporaryRoot, 'claude-transport-fixture');
    const claudePackage = extracted.get('bulkgrid-claude');
    assert.ok(claudePackage);
    const claudeOutput = outputById('bulkgrid-claude');
    const claudeFiles = expectedFilesFor(expected, claudeOutput);
    await copyPackage(claudePackage, fixture);
    const mcpPath = path.join(fixture, '.mcp.json');
    const mcp = parseJsonObject(await readFile(mcpPath, 'utf8'));
    const servers = mcp.mcpServers;
    assert.ok(isRecord(servers));
    const server = servers.bulkgrid;
    assert.ok(isRecord(server));
    delete server.type;
    await writeFile(mcpPath, `${JSON.stringify(mcp, null, 2)}\n`);
    await assert.rejects(validatePackageDirectory(fixture, claudeOutput, claudeFiles), /type must be http/);
  });

  it('rejects private files in canonical skill sources before generating a package', async () => {
    const fixtureRoot = path.join(temporaryRoot, 'private-source-fixture');
    await mkdir(fixtureRoot, { recursive: true });
    await writeFile(path.join(fixtureRoot, 'package.json'), JSON.stringify({ type: 'module' }));
    for (const directory of ['packages/agent-core', 'packages/agent-claude', 'skills', 'scripts/plugins']) {
      await cp(path.join(ROOT, directory), path.join(fixtureRoot, directory), { recursive: true });
    }
    const privateFile = path.join(fixtureRoot, 'skills/bulkgrid-search/private.pem');
    await writeFile(privateFile, '-----BEGIN PRIVATE KEY-----\nnot a real key\n');
    const fixtureBuild = path.join(fixtureRoot, 'scripts/plugins/build.ts');
    const failure = runTsxResult(fixtureBuild);
    assert.equal(failure.status, 1, failure.stderr);
    assert.match(failure.stderr, /Private or unsupported skill source file: private\.pem/);
    await assert.rejects(readFile(path.join(fixtureRoot, 'plugins/bulkgrid/skills/bulkgrid-search/private.pem')), {
      code: 'ENOENT',
    });
  });

  it('rejects invalid build and archive CLI arguments with usage errors', () => {
    assertCliRejects(path.join(ROOT, 'scripts/plugins/build.ts'), ['--unknown'], /Plugin build failed: Usage:/);
    assertCliRejects(path.join(ROOT, 'scripts/plugins/archive.ts'), ['--version'], /Plugin archive failed: Usage:/);
  });

  it('does not execute build, check, or archive commands when imported', async () => {
    const importer = path.join(temporaryRoot, 'import-entrypoint.ts');
    await writeFile(
      importer,
      [
        'const targetUrl = process.argv[2];',
        "if (!targetUrl) { throw new Error('An entrypoint URL is required'); }",
        'const forwardedArguments = process.argv.slice(3);',
        'process.argv.splice(2, process.argv.length - 2, ...forwardedArguments);',
        'await import(targetUrl);',
        "console.log('Imported without running the CLI.');",
        '',
      ].join('\n'),
    );

    const cases = [
      {
        script: path.join(ROOT, 'scripts/plugins/build.ts'),
        args: ['--output-dir', path.join(temporaryRoot, 'imported-build-output')],
      },
      {
        script: path.join(ROOT, 'scripts/plugins/check.ts'),
        args: [],
      },
      {
        script: path.join(ROOT, 'scripts/plugins/archive.ts'),
        args: ['--output-dir', path.join(temporaryRoot, 'imported-archive-output')],
      },
    ];

    for (const { script, args } of cases) {
      const stdout = runTsx(importer, pathToFileURL(script).href, ...args);
      assert.equal(stdout.trim(), 'Imported without running the CLI.');
    }
    await assert.rejects(readFile(path.join(temporaryRoot, 'imported-build-output/bulkgrid/plugin.json')), { code: 'ENOENT' });
    await assert.rejects(readFile(path.join(temporaryRoot, 'imported-archive-output/release-record.json')), { code: 'ENOENT' });
  });

  it('rejects ZIP archives with duplicate entries', async () => {
    const duplicateArchive = path.join(temporaryRoot, 'duplicate.zip');
    const script =
      'import sys, zipfile, stat; z = zipfile.ZipFile(sys.argv[1], "w"); make = lambda: zipfile.ZipInfo("plugin.json", date_time=(1980,1,1,0,0,0)); a = make(); a.create_system = 3; a.external_attr = (stat.S_IFREG | 0o644) << 16; z.writestr(a, b"{}"); b = make(); b.create_system = 3; b.external_attr = (stat.S_IFREG | 0o644) << 16; z.writestr(b, b"{}"); z.close()';
    execFileSync('python3', ['-c', script, duplicateArchive], { cwd: ROOT, stdio: 'ignore' });
    assert.throws(() => runArchiveHelper('verify', duplicateArchive), /Duplicate ZIP entry/);
  });

  it('rejects ZIP entries whose names escape the package root', async () => {
    const unsafeArchive = path.join(temporaryRoot, 'unsafe-path.zip');
    const script =
      'import sys, zipfile; z = zipfile.ZipFile(sys.argv[1], "w"); z.writestr("../outside.txt", b"outside"); z.close()';
    execFileSync('python3', ['-c', script, unsafeArchive], { cwd: ROOT, stdio: 'ignore' });
    assert.throws(() => runArchiveHelper('verify', unsafeArchive), /Unsafe ZIP member path/);
  });

  it('rejects symlink output parents and detects generated drift without rewriting it', async () => {
    const realDirectory = path.join(temporaryRoot, 'real-output');
    const linkedDirectory = path.join(temporaryRoot, 'linked-output');
    await mkdir(realDirectory);
    await symlink(realDirectory, linkedDirectory, 'dir');
    await assert.rejects(buildPlugins(path.join(linkedDirectory, 'plugins')), /symbolic link/);
    await assert.rejects(createPluginArchives({ outputDirectory: path.join(linkedDirectory, 'archives') }), /symbolic link/);

    const generatedManifest = path.join(ROOT, 'plugins/bulkgrid/plugin.json');
    const original = await readFile(generatedManifest);
    const modified = Buffer.concat([original, Buffer.from('\n')]);
    try {
      await writeFile(generatedManifest, modified);
      await assert.rejects(checkPlugins(), /Generated output is stale/);
      assert.deepEqual(await readFile(generatedManifest), modified, 'Check must not overwrite generated drift');
    } finally {
      await writeFile(generatedManifest, original);
    }
  });

  it('produces identical generated trees, archive bytes, and release records for repeated builds', async () => {
    const buildOne = path.join(temporaryRoot, 'build-one');
    const buildTwo = path.join(temporaryRoot, 'build-two');
    await buildPlugins(buildOne);
    await buildPlugins(buildTwo);

    for (const output of OUTPUTS) {
      assert.deepEqual(
        await inventoryPackage(packageRootFor(output, buildOne)),
        await inventoryPackage(packageRootFor(output, buildTwo)),
      );
    }
    const firstBuild = firstArchiveBuild();
    const secondBuild = secondArchiveBuild();
    for (const artifact of firstBuild.record.artifacts) {
      const firstBytes = await readFile(path.join(path.dirname(firstBuild.recordPath), artifact.file));
      const secondBytes = await readFile(path.join(path.dirname(secondBuild.recordPath), artifact.file));
      assert.deepEqual(firstBytes, secondBytes);
    }
    assert.deepEqual(await readFile(firstBuild.recordPath), await readFile(secondBuild.recordPath));
  });
});
