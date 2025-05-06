import stacks from '@stacks/eslint-config';
import stencil from '@stencil/eslint-plugin';
import react from 'eslint-plugin-react';

export default [
  ...stacks,

  stencil.configs.flat.recommended,

  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'], // todo: do we need this?
];
