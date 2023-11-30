import { Config } from '@stencil/core';
import tailwind, {
  PluginOpts,
  setPluginConfigurationDefaults,
  tailwindHMR,
} from 'stencil-tailwind-plugin';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import rename from 'postcss-rename';

import tailwindConf from './tailwind.config.ts';

setPluginConfigurationDefaults({
  ...PluginOpts.DEFAULT,
  enableDebug: true,
  stripComments: true,
  tailwindConf,
  postcss: {
    plugins: [
      tailwindcss(),
      autoprefixer(),
      rename({
        strategy: 'minimal'
      })
    ]
  }
});

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
  plugins: [tailwind(), tailwindHMR()],
  extras: {
    experimentalImportInjection: true,
  },
};
