import { vi, describe, expect, it } from 'vitest';

const fileSystem = vi.hoisted(() => ({
  access: vi.fn(),
  readFile: vi.fn(),
  readdir: vi.fn(),
}));

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  return { ...actual, ...fileSystem };
});

describe('checkDocs module', () => {
  it('does not inspect files when imported', async () => {
    await import('./checkDocs.js');

    expect(fileSystem.access).not.toHaveBeenCalled();
    expect(fileSystem.readFile).not.toHaveBeenCalled();
    expect(fileSystem.readdir).not.toHaveBeenCalled();
  });
});
