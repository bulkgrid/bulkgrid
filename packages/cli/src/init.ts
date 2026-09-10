import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { checkbox, confirm, input, password, select } from '@inquirer/prompts';

const DEFAULT_SERVER_NAME = 'bulkgrid';
const API_KEY_ENV_VAR = 'BULKGRID_API_KEY';
const MCP_URL_ENV_VAR = 'BULKGRID_MCP_URL';
const DASHBOARD_API_KEYS_URL = 'https://bulkgrid.com/dashboard/settings/api-keys';

type AgentName = 'cursor' | 'vscode' | 'claude' | 'codex';
type AuthMode = 'browser' | 'manual' | 'skip';

const AGENT_CHOICES: readonly { label: string; value: AgentName }[] = [
  { label: 'Cursor', value: 'cursor' },
  { label: 'VS Code', value: 'vscode' },
  { label: 'Claude Code', value: 'claude' },
  { label: 'Codex', value: 'codex' },
];

interface InitFlags {
  readonly all?: boolean;
  readonly cursor?: boolean;
  readonly vscode?: boolean;
  readonly claude?: boolean;
  readonly codex?: boolean;
}

export interface InitCommandOptions extends InitFlags {
  readonly mcpUrl?: string;
  readonly apiKey?: string;
  readonly global?: boolean;
  readonly project?: boolean;
  readonly yes?: boolean;
  readonly writeApiKey?: boolean;
  readonly installGlobal?: boolean;
  readonly auth?: AuthMode;
}

interface InitContext {
  readonly agents: readonly AgentName[];
  readonly mcpUrl: string;
  readonly apiKey?: string;
  readonly scope: 'project' | 'global';
  readonly writeApiKey: boolean;
}

type McpConfigContext = Pick<InitContext, 'apiKey' | 'mcpUrl' | 'writeApiKey'>;
export type JsonObject = { [key: string]: JsonValue };
type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

interface SetupResult {
  readonly agent: AgentName;
  readonly status: 'configured' | 'skipped';
  readonly message: string;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJsonObject(filePath: string): JsonObject {
  if (!existsSync(filePath)) {
    return {};
  }

  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  if (!isJsonObject(parsed)) {
    throw new Error(`${filePath} must contain a JSON object`);
  }

  return parsed;
}

function writeJsonFile(filePath: string, data: JsonObject): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function getObjectProperty(parent: JsonObject, key: string): JsonObject {
  const current = parent[key];
  if (isJsonObject(current)) {
    return current;
  }

  const next: JsonObject = {};
  parent[key] = next;
  return next;
}

function buildAuthorizationHeader(context: McpConfigContext, inputExpression: string): string {
  if (context.writeApiKey && context.apiKey) {
    return `Bearer ${context.apiKey}`;
  }

  return `Bearer ${inputExpression}`;
}

function buildCursorServer(context: McpConfigContext): JsonObject {
  return {
    url: context.mcpUrl,
    headers: {
      Authorization: buildAuthorizationHeader(context, `\${env:${API_KEY_ENV_VAR}}`),
    },
  };
}

export function mergeCursorConfig(existing: JsonObject, context: McpConfigContext): JsonObject {
  const next = { ...existing };
  const servers = getObjectProperty(next, 'mcpServers');
  servers[DEFAULT_SERVER_NAME] = buildCursorServer(context);
  return next;
}

function buildVsCodeConfig(context: McpConfigContext): JsonObject {
  return {
    inputs: [
      {
        type: 'promptString',
        id: 'bulkgrid-api-key',
        description: 'Bulkgrid API Key',
        password: true,
      },
    ],
    servers: {
      [DEFAULT_SERVER_NAME]: {
        type: 'http',
        url: context.mcpUrl,
        headers: {
          Authorization: buildAuthorizationHeader(context, '${input:bulkgrid-api-key}'),
        },
      },
    },
  };
}

export function mergeVsCodeConfig(existing: JsonObject, context: McpConfigContext): JsonObject {
  const next = { ...existing };
  const config = buildVsCodeConfig(context);
  const existingServers = getObjectProperty(next, 'servers');
  const configServers = getObjectProperty(config, 'servers');
  existingServers[DEFAULT_SERVER_NAME] = configServers[DEFAULT_SERVER_NAME] ?? {};

  if (!Array.isArray(next.inputs)) {
    next.inputs = config.inputs ?? [];
    return next;
  }

  const hasInput = next.inputs.some(item => isJsonObject(item) && item.id === 'bulkgrid-api-key');
  if (!hasInput && Array.isArray(config.inputs)) {
    next.inputs = [...next.inputs, ...config.inputs];
  }

  return next;
}

function resolveCursorPath(scope: InitContext['scope']): string {
  if (scope === 'global') {
    return join(homedir(), '.cursor', 'mcp.json');
  }

  return join(process.cwd(), '.cursor', 'mcp.json');
}

function resolveVsCodePath(scope: InitContext['scope']): string {
  if (scope === 'global') {
    if (process.platform === 'darwin') {
      return join(homedir(), 'Library', 'Application Support', 'Code', 'User', 'mcp.json');
    }
    if (process.platform === 'win32') {
      return join(homedir(), 'AppData', 'Roaming', 'Code', 'User', 'mcp.json');
    }

    return join(homedir(), '.config', 'Code', 'User', 'mcp.json');
  }

  return join(process.cwd(), '.vscode', 'mcp.json');
}

function setupCursor(context: InitContext): SetupResult {
  const filePath = resolveCursorPath(context.scope);
  const config = mergeCursorConfig(parseJsonObject(filePath), context);
  writeJsonFile(filePath, config);

  return {
    agent: 'cursor',
    status: 'configured',
    message: `Wrote ${filePath}`,
  };
}

function setupVsCode(context: InitContext): SetupResult {
  const filePath = resolveVsCodePath(context.scope);
  const config = mergeVsCodeConfig(parseJsonObject(filePath), context);
  writeJsonFile(filePath, config);

  return {
    agent: 'vscode',
    status: 'configured',
    message: `Wrote ${filePath}`,
  };
}

function commandExists(command: string): boolean {
  const result = spawnSync(command, ['--version'], { encoding: 'utf8', stdio: 'ignore' });
  return result.status === 0;
}

function runCommand(command: string, args: readonly string[]): void {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: 'inherit' });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status ?? 'unknown'}`);
  }
}

function printInitBanner(): void {
  console.log('');
  console.log('  ▦ Bulkgrid init');
  console.log('');
}

async function promptForConfirmation(message: string, defaultValue: boolean): Promise<boolean> {
  return confirm({
    message,
    default: defaultValue,
  });
}

async function promptForSelect<TValue extends string>(
  message: string,
  choices: readonly { label: string; value: TValue }[],
): Promise<TValue> {
  return select({
    message,
    choices: choices.map(choice => ({
      name: choice.label,
      value: choice.value,
    })),
  });
}

async function promptForMultiSelect<TValue extends string>(
  message: string,
  choices: readonly { label: string; value: TValue }[],
): Promise<readonly TValue[]> {
  return checkbox({
    message,
    choices: choices.map(choice => ({
      name: choice.label,
      value: choice.value,
      checked: true,
    })),
    required: true,
    pageSize: choices.length,
  });
}

async function maybeInstallGlobally(options: InitCommandOptions): Promise<void> {
  if (options.installGlobal) {
    runCommand('npm', ['install', '-g', '@bulkgrid/cli']);
    return;
  }

  if (options.yes) {
    return;
  }

  const shouldInstall = await promptForConfirmation('Install @bulkgrid/cli globally?', false);
  if (shouldInstall) {
    runCommand('npm', ['install', '-g', '@bulkgrid/cli']);
  }
}

function openBrowser(url: string): void {
  let command: string;
  let args: string[];

  if (process.platform === 'darwin') {
    command = 'open';
    args = [url];
  } else if (process.platform === 'win32') {
    command = 'cmd';
    args = ['/c', 'start', '', url];
  } else {
    command = 'xdg-open';
    args = [url];
  }

  const result = spawnSync(command, args, { encoding: 'utf8', stdio: 'ignore' });
  if (result.status !== 0) {
    console.log(`Open ${url} to create a Bulkgrid API key.`);
  }
}

async function resolveApiKey(options: InitCommandOptions): Promise<string | undefined> {
  const configuredApiKey = options.apiKey ?? process.env[API_KEY_ENV_VAR];
  if (configuredApiKey || options.yes) {
    return configuredApiKey;
  }

  const authMode =
    options.auth ??
    (await promptForSelect('Authenticate to Bulkgrid', [
      { label: 'Open the dashboard and paste a new API key', value: 'browser' },
      { label: 'Enter an existing API key', value: 'manual' },
      { label: 'Skip this step', value: 'skip' },
    ]));

  if (authMode === 'skip') {
    console.log(`Skipped. Set ${API_KEY_ENV_VAR} later or use client-side prompts.`);
    return undefined;
  }

  if (authMode === 'browser') {
    openBrowser(DASHBOARD_API_KEYS_URL);
    console.log('Create an API key with mcp:use and search:query scopes.');
  }

  const apiKey = await password({
    message: 'Bulkgrid API key',
    mask: '*',
    validate: value => value.trim().length > 0 || 'Enter a Bulkgrid API key.',
  });
  return apiKey || undefined;
}

function setupCodex(context: InitContext): SetupResult {
  if (!commandExists('codex')) {
    return {
      agent: 'codex',
      status: 'skipped',
      message: 'codex command was not found',
    };
  }

  runCommand('codex', ['mcp', 'add', DEFAULT_SERVER_NAME, '--url', context.mcpUrl, '--bearer-token-env-var', API_KEY_ENV_VAR]);

  return {
    agent: 'codex',
    status: 'configured',
    message: `Registered ${DEFAULT_SERVER_NAME} with codex mcp add`,
  };
}

function setupClaude(context: InitContext): SetupResult {
  if (!commandExists('claude')) {
    return {
      agent: 'claude',
      status: 'skipped',
      message: 'claude command was not found',
    };
  }

  if (!context.apiKey) {
    return {
      agent: 'claude',
      status: 'skipped',
      message: `Set ${API_KEY_ENV_VAR} or pass --api-key to configure Claude Code`,
    };
  }

  const args = ['mcp', 'add', '--transport', 'http'];
  if (context.scope === 'global') {
    args.push('--scope', 'user');
  }
  args.push(DEFAULT_SERVER_NAME, context.mcpUrl, '--header', `Authorization: Bearer ${context.apiKey}`);
  runCommand('claude', args);

  return {
    agent: 'claude',
    status: 'configured',
    message: `Registered ${DEFAULT_SERVER_NAME} with claude mcp add`,
  };
}

async function resolveAgents(options: InitCommandOptions): Promise<readonly AgentName[]> {
  if (options.all || (!options.cursor && !options.vscode && !options.claude && !options.codex)) {
    if (!options.all && !options.yes) {
      const shouldConfigure = await promptForConfirmation('Configure the Bulkgrid MCP server for clients?', true);
      if (!shouldConfigure) {
        return [];
      }

      return promptForMultiSelect('Choose MCP clients to configure:', AGENT_CHOICES);
    }

    return ['cursor', 'vscode', 'claude', 'codex'];
  }

  const agents: AgentName[] = [];
  if (options.cursor) {
    agents.push('cursor');
  }
  if (options.vscode) {
    agents.push('vscode');
  }
  if (options.claude) {
    agents.push('claude');
  }
  if (options.codex) {
    agents.push('codex');
  }

  return agents;
}

async function promptForValue(message: string): Promise<string> {
  return input({
    message,
    validate: value => value.trim().length > 0 || 'Enter a value.',
  });
}

async function buildContext(options: InitCommandOptions): Promise<InitContext> {
  const configuredUrl = options.mcpUrl ?? process.env[MCP_URL_ENV_VAR];
  const mcpUrl = configuredUrl ?? (options.yes ? undefined : await promptForValue('Bulkgrid MCP URL: '));
  if (!mcpUrl) {
    throw new Error(`Missing MCP URL. Pass --mcp-url or set ${MCP_URL_ENV_VAR}.`);
  }

  const apiKey = await resolveApiKey(options);
  const agents = await resolveAgents(options);

  return {
    agents,
    mcpUrl,
    apiKey,
    scope: options.global ? 'global' : 'project',
    writeApiKey: options.writeApiKey ?? false,
  };
}

export async function runInitCommand(options: InitCommandOptions): Promise<readonly SetupResult[]> {
  printInitBanner();
  await maybeInstallGlobally(options);

  const context = await buildContext(options);
  const results: SetupResult[] = [];

  for (const agent of context.agents) {
    if (agent === 'cursor') {
      results.push(setupCursor(context));
    } else if (agent === 'vscode') {
      results.push(setupVsCode(context));
    } else if (agent === 'claude') {
      results.push(setupClaude(context));
    } else if (agent === 'codex') {
      results.push(setupCodex(context));
    }
  }

  return results;
}
