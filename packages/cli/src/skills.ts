import { randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, parse, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';

interface SkillOptions {
  global?: boolean;
  directory?: string;
  skill?: string[];
  force?: boolean;
  dryRun?: boolean;
  list?: boolean;
}

interface InstallContext {
  sourceRoot: string;
  cwd: string;
  home: string;
}

type SkillFiles = Map<string, Buffer>;

async function stat(path: string) {
  return lstat(path).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  });
}

async function assertDirectories(path: string): Promise<void> {
  const absolute = resolve(path);
  let current = parse(absolute).root;
  for (const segment of absolute.slice(current.length).split(/[\\/]/).filter(Boolean)) {
    current = join(current, segment);
    const info = await stat(current);
    if (info && (info.isSymbolicLink() || !info.isDirectory())) {
      throw new Error(`Skill destination must use regular directories: ${current}`);
    }
  }
}

async function readTree(root: string, prefix = ''): Promise<SkillFiles> {
  const info = await lstat(root);
  if (!info.isDirectory() || info.isSymbolicLink()) throw new Error(`Expected a regular skill directory: ${root}`);
  const files: SkillFiles = new Map();
  for (const name of (await readdir(root)).sort()) {
    const path = join(root, name);
    const entry = await lstat(path);
    if (entry.isSymbolicLink()) throw new Error(`Refusing skill symbolic link: ${path}`);
    if (entry.isDirectory()) {
      for (const [key, value] of await readTree(path, `${prefix}${name}/`)) files.set(key, value);
    } else if (entry.isFile()) {
      files.set(`${prefix}${name}`, await readFile(path));
    } else throw new Error(`Unsupported skill file: ${path}`);
  }
  return files;
}

function sameFiles(left: SkillFiles, right: SkillFiles): boolean {
  return left.size === right.size && [...left].every(([key, value]) => right.get(key)?.equals(value));
}

async function writeSkill(destination: string, files: SkillFiles): Promise<void> {
  const staging = `${destination}.staging-${randomUUID()}`;
  const backup = `${destination}.backup-${randomUUID()}`;
  let backedUp = false;
  try {
    for (const [file, content] of files) {
      const path = join(staging, file);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, content);
    }
    if (await stat(destination)) {
      await rename(destination, backup);
      backedUp = true;
    }
    try {
      await rename(staging, destination);
    } catch (error) {
      if (backedUp) await rename(backup, destination);
      throw error;
    }
    if (backedUp) await rm(backup, { recursive: true });
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

export async function installSkills(
  options: SkillOptions,
  context: InstallContext = {
    sourceRoot: fileURLToPath(new URL('../skills/', import.meta.url)),
    cwd: process.cwd(),
    home: homedir(),
  },
) {
  if (options.global && options.directory) throw new Error('Use either --global or --directory, not both.');
  const directory = resolve(
    context.cwd,
    options.directory ?? join(options.global ? context.home : context.cwd, '.agents/skills'),
  );
  const names = (await readdir(context.sourceRoot)).filter(name => /^bulkgrid-[a-z0-9-]+$/.test(name)).sort();
  if (!names.length) throw new Error('This CLI package has no bundled skills. Rebuild or reinstall @bulkgrid/cli.');
  const selected = [...new Set(options.skill ?? names)];
  for (const name of selected) {
    if (!names.includes(name)) throw new Error(`Unknown skill: ${name}. Available skills: ${names.join(', ')}`);
  }
  if (options.list) return { directory, skills: selected.map(name => ({ name, status: 'available' })) };

  await assertDirectories(directory);
  const license = await readFile(join(context.sourceRoot, 'LICENSE'));
  const plan = [];
  for (const name of selected) {
    const files = await readTree(join(context.sourceRoot, name));
    const skill = files.get('SKILL.md')?.toString('utf8');
    if (!skill?.startsWith('---\n') || !skill.split('\n---\n')[0]?.split('\n').includes(`name: ${name}`)) {
      throw new Error(`Invalid bundled skill: ${name}`);
    }
    files.set('LICENSE', license);
    const destination = join(directory, name);
    const existing = await stat(destination);
    const current = existing ? await readTree(destination) : undefined;
    const status =
      current && sameFiles(current, files)
        ? 'unchanged'
        : current && !options.force
          ? 'skipped'
          : options.dryRun
            ? current
              ? 'would-replace'
              : 'would-install'
            : 'installed';
    plan.push({ name, files, destination, status });
  }
  // Validate the whole selection before writing anything; unrelated skills are never replaced.
  if (plan.some(item => item.status === 'installed')) {
    await mkdir(directory, { recursive: true });
    for (const item of plan) {
      if (item.status === 'installed') await writeSkill(item.destination, item.files);
    }
  }
  return { directory, skills: plan.map(({ name, status }) => ({ name, status })) };
}

export function registerSkillCommands(program: Command): void {
  program
    .command('setup')
    .description('Install agent skills')
    .command('skills')
    .description('Install bundled skills locally; existing changes are preserved unless --force is used')
    .option('--global', 'Install into ~/.agents/skills instead of the current project')
    .option('--directory <path>', 'Install into an explicit skills directory, such as .claude/skills')
    .option('--skill <names...>', 'Install only the named skills; default is all bundled skills')
    .option('--list', 'List available bundled skills without writing files')
    .option('--dry-run', 'Preview installation without writing files')
    .option('--force', 'Replace existing selected skill directories, including local edits')
    .action(async (options: SkillOptions) => console.log(JSON.stringify(await installSkills(options), null, 2)));
}
