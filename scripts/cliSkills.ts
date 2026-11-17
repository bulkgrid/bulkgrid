import { randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OUTPUTS, ROOT, sourceFiles, walkFiles, relative } from './plugins/shared.js';

const destination = join(ROOT, 'packages/cli/skills');

export async function expectedCliSkills(): Promise<Map<string, Buffer>> {
  const output = OUTPUTS[0];
  if (!output) throw new Error('Missing canonical plugin sources');
  const files = await sourceFiles(output);
  const skills = new Map(
    [...files].filter(([file]) => file.startsWith('skills/')).map(([file, content]) => [file.slice(7), content]),
  );
  skills.set('LICENSE', await readFile(join(ROOT, 'packages/agent-core/LICENSE')));
  return skills;
}

export async function checkCliSkills(): Promise<void> {
  const expected = await expectedCliSkills();
  const actual = (await walkFiles(destination)).files.map(file => relative(destination, file));
  if (actual.length !== expected.size) throw new Error('CLI skills are stale; run npm run skills:build');
  for (const file of actual) {
    if (!expected.get(file)?.equals(await readFile(join(destination, file)))) {
      throw new Error(`CLI skill is stale: ${file}; run npm run skills:build`);
    }
  }
}

export async function buildCliSkills(): Promise<void> {
  const expected = await expectedCliSkills();
  const existing = await lstat(destination).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  });
  if (existing && (!existing.isDirectory() || existing.isSymbolicLink()))
    throw new Error('CLI skills output must be a regular directory');
  const staging = `${destination}.staging-${randomUUID()}`;
  const backup = `${destination}.backup-${randomUUID()}`;
  try {
    for (const [file, content] of expected) {
      const path = join(staging, file);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content);
    }
    if (existing) await rename(destination, backup);
    try {
      await rename(staging, destination);
    } catch (error) {
      if (existing) await rename(backup, destination);
      throw error;
    }
    if (existing) await rm(backup, { recursive: true });
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  try {
    if (process.argv.length !== 3 || !['--build', '--check'].includes(process.argv[2] ?? '')) {
      throw new Error('Usage: node --import tsx scripts/cliSkills.ts --build|--check');
    }
    if (process.argv[2] === '--build') await buildCliSkills();
    else await checkCliSkills();
    console.log('CLI skills match their canonical sources.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
