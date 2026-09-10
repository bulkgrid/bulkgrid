import { describe, expect, it } from 'vitest';

import { mergeCursorConfig, mergeVsCodeConfig, type JsonObject } from './init.js';

const context = {
  mcpUrl: 'https://api.bulkgrid.com/api/v1/mcp',
  writeApiKey: false,
};

describe('MCP config merging', () => {
  describe('mergeCursorConfig', () => {
    it('adds Bulkgrid without removing existing Cursor MCP servers or root settings', () => {
      const existing: JsonObject = {
        version: 1,
        mcpServers: {
          existing: {
            command: 'node',
            args: ['server.js'],
          },
        },
      };

      expect(mergeCursorConfig(existing, context)).toEqual({
        version: 1,
        mcpServers: {
          existing: {
            command: 'node',
            args: ['server.js'],
          },
          bulkgrid: {
            url: 'https://api.bulkgrid.com/api/v1/mcp',
            headers: {
              Authorization: 'Bearer ${env:BULKGRID_API_KEY}',
            },
          },
        },
      });
    });

    it('updates only the Bulkgrid Cursor server when it already exists', () => {
      const existing: JsonObject = {
        mcpServers: {
          bulkgrid: {
            url: 'https://old.example.com/api/v1/mcp',
            headers: {
              Authorization: 'Bearer old-key',
            },
          },
          other: {
            url: 'https://other.example.com/mcp',
          },
        },
      };

      expect(
        mergeCursorConfig(existing, {
          ...context,
          apiKey: 'bg_live_new_key',
          writeApiKey: true,
        }),
      ).toEqual({
        mcpServers: {
          bulkgrid: {
            url: 'https://api.bulkgrid.com/api/v1/mcp',
            headers: {
              Authorization: 'Bearer bg_live_new_key',
            },
          },
          other: {
            url: 'https://other.example.com/mcp',
          },
        },
      });
    });
  });

  describe('mergeVsCodeConfig', () => {
    it('adds Bulkgrid without removing existing VS Code servers, inputs, or root settings', () => {
      const existing: JsonObject = {
        inputs: [
          {
            type: 'promptString',
            id: 'existing-token',
            description: 'Existing token',
            password: true,
          },
        ],
        servers: {
          existing: {
            type: 'stdio',
            command: 'node',
            args: ['server.js'],
          },
        },
        customSetting: true,
      };

      expect(mergeVsCodeConfig(existing, context)).toEqual({
        inputs: [
          {
            type: 'promptString',
            id: 'existing-token',
            description: 'Existing token',
            password: true,
          },
          {
            type: 'promptString',
            id: 'bulkgrid-api-key',
            description: 'Bulkgrid API Key',
            password: true,
          },
        ],
        servers: {
          existing: {
            type: 'stdio',
            command: 'node',
            args: ['server.js'],
          },
          bulkgrid: {
            type: 'http',
            url: 'https://api.bulkgrid.com/api/v1/mcp',
            headers: {
              Authorization: 'Bearer ${input:bulkgrid-api-key}',
            },
          },
        },
        customSetting: true,
      });
    });

    it('does not duplicate the Bulkgrid VS Code input when it already exists', () => {
      const existing: JsonObject = {
        inputs: [
          {
            type: 'promptString',
            id: 'bulkgrid-api-key',
            description: 'Bulkgrid API Key',
            password: true,
          },
        ],
        servers: {
          old: {
            url: 'https://old.example.com/mcp',
          },
        },
      };

      expect(mergeVsCodeConfig(existing, context)).toEqual({
        inputs: [
          {
            type: 'promptString',
            id: 'bulkgrid-api-key',
            description: 'Bulkgrid API Key',
            password: true,
          },
        ],
        servers: {
          old: {
            url: 'https://old.example.com/mcp',
          },
          bulkgrid: {
            type: 'http',
            url: 'https://api.bulkgrid.com/api/v1/mcp',
            headers: {
              Authorization: 'Bearer ${input:bulkgrid-api-key}',
            },
          },
        },
      });
    });
  });
});
