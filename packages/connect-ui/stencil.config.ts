import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import tailwind, { tailwindHMR, PluginOpts } from 'stencil-tailwind-plugin';

import tailwindConf from './tailwind.config.ts';

export const config: Config = {
  namespace: 'connect-ui',
  taskQueue: 'async',
  tsconfig: './tsconfig.json',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  plugins: [
    sass(),
    tailwind({
      ...PluginOpts.DEFAULT,
      tailwindConf,
    }),
    tailwindHMR(),
  ],
  extras: {
    experimentalImportInjection: true,
  },
};
