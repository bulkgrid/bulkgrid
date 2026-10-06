import { vi, describe, expect, it } from 'vitest';

const fileSystem = vi.hoisted(() => ({
  readFile: vi.fn(),
}));

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  return { ...actual, ...fileSystem };
});

describe('checkVersion module', () => {
  it('does not read the plugin manifest when imported', async () => {
    await import('./checkVersion.js');

    expect(fileSystem.readFile).not.toHaveBeenCalled();
  });
});
