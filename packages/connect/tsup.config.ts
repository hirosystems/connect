import { defineConfig } from 'tsup';

import { version } from './package.json';

export default defineConfig({
  format: ['cjs', 'esm', 'iife'],
  outDir: 'dist',
  external: ['@stacks/connect-ui'],

  clean: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,

  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,

  metafile: !!process.env.ANALYZE,

  esbuildOptions(options) {
    options.define = {
      ...options.define,
      __VERSION__: JSON.stringify(version),
    };
  },
});
