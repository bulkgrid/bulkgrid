import { mkdtemp, mkdir, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { installSkills } from './skills.js';

const temporary: string[] = [];
const sourceRoot = fileURLToPath(new URL('../skills/', import.meta.url));
async function fixture() {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'bulkgrid-skills-')));
  temporary.push(root);
  return { sourceRoot, cwd: root, home: join(root, 'home') };
}
afterEach(async () => {
  for (const path of temporary.splice(0)) await rm(path, { recursive: true, force: true });
});

describe('bundled skill installation', () => {
  it('installs all six canonical skills and their metadata and license without a network request', async () => {
    const context = await fixture();
    const result = await installSkills({}, context);
    expect(result.skills.map(skill => skill.name)).toEqual([
      'bulkgrid-crawl',
      'bulkgrid-extract',
      'bulkgrid-index',
      'bulkgrid-parse',
      'bulkgrid-search',
      'bulkgrid-sources',
    ]);
    expect(result.skills.every(skill => skill.status === 'installed')).toBe(true);
    for (const { name } of result.skills) {
      expect(await readFile(join(result.directory, name, 'SKILL.md'))).toEqual(
        await readFile(join(sourceRoot, name, 'SKILL.md')),
      );
      expect(await readFile(join(result.directory, name, 'agents/openai.yaml'))).toEqual(
        await readFile(join(sourceRoot, name, 'agents/openai.yaml')),
      );
      expect(await readFile(join(result.directory, name, 'LICENSE'), 'utf8')).toContain('Apache License');
    }
    expect((await installSkills({}, context)).skills.every(skill => skill.status === 'unchanged')).toBe(true);
  });

  it('previews or lists without creating destination files', async () => {
    const context = await fixture();
    const preview = await installSkills({ global: true, dryRun: true }, context);
    expect(preview.directory).toBe(join(context.home, '.agents/skills'));
    expect(preview.skills.every(skill => skill.status === 'would-install')).toBe(true);
    expect((await installSkills({ list: true }, context)).skills.every(skill => skill.status === 'available')).toBe(
      true,
    );
    await expect(readFile(join(preview.directory, 'bulkgrid-search/SKILL.md'))).rejects.toMatchObject({
      code: 'ENOENT',
    });
  });

  it('preserves local edits and unrelated skills; force replaces only selected skills', async () => {
    const context = await fixture();
    const result = await installSkills({ directory: '.claude/skills', skill: ['bulkgrid-search'] }, context);
    const skillFile = join(result.directory, 'bulkgrid-search/SKILL.md');
    await writeFile(skillFile, 'local changes');
    await mkdir(join(result.directory, 'other-skill'));
    await writeFile(join(result.directory, 'other-skill/SKILL.md'), 'unrelated');
    expect(
      (await installSkills({ directory: '.claude/skills', skill: ['bulkgrid-search'] }, context)).skills[0]?.status,
    ).toBe('skipped');
    expect(await readFile(skillFile, 'utf8')).toBe('local changes');
    await installSkills({ directory: '.claude/skills', skill: ['bulkgrid-search'], force: true }, context);
    expect(await readFile(skillFile)).toEqual(await readFile(join(sourceRoot, 'bulkgrid-search/SKILL.md')));
    expect(await readFile(join(result.directory, 'other-skill/SKILL.md'), 'utf8')).toBe('unrelated');
  });

  it('rejects unknown names and conflicting destinations before writes', async () => {
    const context = await fixture();
    await expect(installSkills({ skill: ['../../outside'] }, context)).rejects.toThrow('Unknown skill');
    await expect(installSkills({ global: true, directory: '.claude/skills' }, context)).rejects.toThrow(
      'either --global or --directory',
    );
  });

  it('does not follow destination or installed-file symlinks, even with force', async () => {
    const context = await fixture();
    await mkdir(join(context.cwd, 'outside'));
    await symlink(join(context.cwd, 'outside'), join(context.cwd, 'linked'));
    await expect(installSkills({ directory: 'linked/skills', force: true }, context)).rejects.toThrow(
      'regular directories',
    );
    const result = await installSkills({ skill: ['bulkgrid-search'] }, context);
    await symlink(join(context.cwd, 'outside'), join(result.directory, 'bulkgrid-search/linked'));
    await expect(installSkills({ skill: ['bulkgrid-search'], force: true }, context)).rejects.toThrow('symbolic link');
  });
});
