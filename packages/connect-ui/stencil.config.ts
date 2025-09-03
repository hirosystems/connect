import { Config } from '@stencil/core';
import tailwind from 'stencil-tailwind-plugin';

export const config: Config = {
  namespace: 'connect-ui',
  taskQueue: 'async',
  tsconfig: './tsconfig.json',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'docs-readme' },
    { type: 'www', serviceWorker: null },
  ],
  plugins: [tailwind({ minify: true })],
  extras: { enableImportInjection: true },
};
