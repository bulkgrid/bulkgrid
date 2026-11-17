import { describe, expect, it } from 'vitest';
import { checkCliSkills, expectedCliSkills } from './cliSkills.js';

describe('CLI skill distribution', () => {
  it('ships the same canonical skills and UI metadata as the plugins, with a standalone license', async () => {
    await checkCliSkills();
    const files = await expectedCliSkills();
    expect([...files.keys()].filter(path => path.endsWith('/SKILL.md')).sort()).toEqual([
      'bulkgrid-crawl/SKILL.md',
      'bulkgrid-extract/SKILL.md',
      'bulkgrid-index/SKILL.md',
      'bulkgrid-parse/SKILL.md',
      'bulkgrid-search/SKILL.md',
      'bulkgrid-sources/SKILL.md',
    ]);
    expect([...files.keys()].filter(path => path.endsWith('/agents/openai.yaml'))).toHaveLength(6);
    expect(files.get('LICENSE')?.toString()).toContain('Apache License');
  });
});
