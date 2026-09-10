import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  fixedExtension: false,
  dts: {
    eager: true,
    resolve: true,
  },
  deps: {
    alwaysBundle: ['@bulkgrid/contracts'],
  },
});
