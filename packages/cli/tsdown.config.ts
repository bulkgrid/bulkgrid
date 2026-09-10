import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  format: 'esm',
  platform: 'node',
  target: 'es2022',
  fixedExtension: false,
  dts: true,
  deps: {
    neverBundle: true,
  },
});
