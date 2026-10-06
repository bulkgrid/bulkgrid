import { vi, describe, expect, it } from 'vitest';

const fileSystem = vi.hoisted(() => ({
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock('node:fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs/promises')>();
  return {
    ...actual,
    mkdir: fileSystem.mkdir,
    writeFile: fileSystem.writeFile,
  };
});

describe('generateOpenApi module', () => {
  it('does not create or write files when imported', async () => {
    await import('./generateOpenApi.js');

    expect(fileSystem.mkdir).not.toHaveBeenCalled();
    expect(fileSystem.writeFile).not.toHaveBeenCalled();
  });
});
