import { afterEach, describe, expect, it, vi } from 'vitest';
import { Command } from 'commander';
import { BulkgridClient } from '@bulkgrid/sdk';
import { createSourceClient, registerSourceCommands } from './sources.js';

describe('source commands', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });
  it('requires a separate API key even when a user has CLI OAuth login', () => {
    vi.stubEnv('BULKGRID_API_KEY', '');
    expect(() => createSourceClient({})).toThrow('OAuth login remains search-only');
  });
  it('rejects remote HTTP and credential-bearing origins', () => {
    vi.stubEnv('BULKGRID_API_KEY', 'test-key');
    expect(() => createSourceClient({ url: 'http://example.com' })).toThrow('HTTPS');
    expect(() => createSourceClient({ url: 'https://user:password@example.com' })).toThrow('without credentials');
  });
  it('forwards a private GitHub connection and keeps the repository URL as a string', async () => {
    const client = new BulkgridClient({ apiKey: 'test-key', baseUrl: 'https://bulkgrid.com' });
    const create = vi.spyOn(client.index.sources, 'createGithub').mockRejectedValue(new Error('Connection revoked'));
    const program = new Command().exitOverride();
    registerSourceCommands(program, () => client);
    const input = {
      repositoryUrl: 'https://github.com/org/private',
      visibility: 'private',
      connection_id: '11111111-1111-4111-8111-111111111111',
    };
    await expect(
      program.parseAsync(['sources', 'add-github', '--input', JSON.stringify(input)], { from: 'user' }),
    ).rejects.toThrow('Connection revoked');
    expect(create).toHaveBeenCalledExactlyOnceWith({ ...input, includePaths: [], excludePaths: [], crawl_interval: 'weekly' });
  });
  it('parses an explicit add request and sends it once without analysis or recrawl', async () => {
    const print = vi.spyOn(console, 'log').mockImplementation(() => {});
    const client = new BulkgridClient({ apiKey: 'test-key', baseUrl: 'https://bulkgrid.com' });
    const create = vi.spyOn(client.index.sources, 'create').mockRejectedValue(new Error('Plan limit'));
    const analyze = vi.spyOn(client.index.sources, 'analyze');
    const recrawl = vi.spyOn(client.index.sources, 'recrawl');
    const program = new Command().exitOverride();
    registerSourceCommands(program, () => client);
    const input = { type: 'domain', identifier: 'https://example.com', visibility: 'private', crawl_config: { maxPages: 20 } };
    await expect(program.parseAsync(['sources', 'add', '--input', JSON.stringify(input)], { from: 'user' })).rejects.toThrow(
      'Plan limit',
    );
    expect(create).toHaveBeenCalledExactlyOnceWith(input);
    expect(analyze).not.toHaveBeenCalled();
    expect(recrawl).not.toHaveBeenCalled();
    expect(print).not.toHaveBeenCalled();
  });
});
