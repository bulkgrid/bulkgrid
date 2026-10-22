import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  fixedExtension: false,
  dts: { resolver: 'tsc' },
  deps: {
    alwaysBundle: ['@bulkgrid/contracts'],
    dts: {
      // Unused UI types are removed during declaration tree shaking.
      neverBundle: ['react'],
    },
  },
});
