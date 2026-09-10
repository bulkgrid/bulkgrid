#!/usr/bin/env node
import { Command } from 'commander';

import { CliAuth } from './auth.js';

import { runInitCommand } from './init.js';

const program = new Command();

program.name('bulkgrid').description('Bulkgrid developer tooling').version('0.1.0');

const auth = new CliAuth();

program
  .command('login')
  .description('Sign in to Bulkgrid in your browser')
  .option('--url <url>', 'Bulkgrid base URL; defaults to BULKGRID_URL or https://bulkgrid.com')
  .option('--no-browser', 'print the login URL without opening a browser')
  .action(async options => {
    const session = await auth.login(options);
    console.log(`Logged in to workspace ${session.workspaceId}. Manage access in Settings → Connected Apps.`);
  });

program
  .command('status')
  .description('Verify the saved CLI connection and show its access')
  .option('--url <url>', 'Bulkgrid base URL; defaults to BULKGRID_URL or https://bulkgrid.com')
  .action(async options => {
    const session = await auth.status(options.url);
    console.log(`Connected as ${session.userId} to workspace ${session.workspaceId}.`);
    console.log(`Permissions: ${session.scopes.join(', ')}; collections: ${session.collectionScope}.`);
  });

program
  .command('logout')
  .description('Revoke this CLI connection and remove its saved tokens')
  .option('--url <url>', 'Bulkgrid base URL; defaults to BULKGRID_URL or https://bulkgrid.com')
  .option('--local', 'only remove local tokens; revoke access separately in Connected Apps')
  .action(async options => {
    await auth.logout(options);
    console.log(options.local ? 'Local credentials removed. Server access was not revoked.' : 'Logged out.');
  });

program
  .command('init')
  .description('Configure the Bulkgrid MCP server')
  .option('--all', 'configure all supported agents')
  .option('--cursor', 'configure Cursor')
  .option('--vscode', 'configure VS Code')
  .option('--claude', 'configure Claude Code')
  .option('--codex', 'configure Codex')
  .option('--mcp-url <url>', 'Bulkgrid MCP server URL')
  .option('--api-key <key>', 'Bulkgrid API key; defaults to BULKGRID_API_KEY')
  .option('--global', 'write global user configuration where supported')
  .option('--project', 'write project configuration where supported')
  .option('--yes', 'do not prompt for missing values')
  .option('--write-api-key', 'write the API key into generated JSON config files')
  .option('--install-global', 'install @bulkgrid/cli globally before configuring agents')
  .option('--auth <mode>', 'authentication mode: browser, manual, or skip')
  .action(async options => {
    try {
      const results = await runInitCommand(options);
      if (results.length === 0) {
        console.log('No MCP clients configured.');
        return;
      }
      for (const result of results) {
        const marker = result.status === 'configured' ? 'configured' : 'skipped';
        console.log(`${result.agent}: ${marker} - ${result.message}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`bulkgrid init failed: ${message}`);
      process.exitCode = 1;
    }
  });

program.parseAsync().catch(error => {
  console.error(`bulkgrid: ${error instanceof Error ? error.message : 'Command failed'}`);
  process.exitCode = 1;
});
