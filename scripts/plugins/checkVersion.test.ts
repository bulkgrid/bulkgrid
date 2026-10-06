import { describe, expect, it } from 'vitest';
import { assertPluginTagMatchesVersion } from './checkVersion.js';

describe('assertPluginTagMatchesVersion', () => {
  it('accepts a tag matching the plugin manifest version', () => {
    expect(() => assertPluginTagMatchesVersion('plugin-v1.2.3', { version: '1.2.3' })).not.toThrow();
  });

  it('rejects mismatched tags and malformed manifest data', () => {
    expect(() => assertPluginTagMatchesVersion('plugin-v1.2.4', { version: '1.2.3' })).toThrow(
      'Tag does not match plugin version',
    );
    expect(() => assertPluginTagMatchesVersion(undefined, { version: '1.2.3' })).toThrow('Tag does not match plugin version');
    expect(() => assertPluginTagMatchesVersion('plugin-v1.2.3', { version: 123 })).toThrow('Tag does not match plugin version');
  });
});
