import stacks from '@stacks/eslint-config';
import stencil from '@stencil/eslint-plugin';
import react from 'eslint-plugin-react';

export default [
  ...stacks,

  stencil.configs.flat.recommended,

  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],

  {
    rules: {
      // Disabled due to `getTypeChecker` bug in plugin
      'stencil/strict-boolean-conditions': 'off',

      // Stencil
      'stencil/ban-side-effects': 'off',
      'stencil/ban-exported-const-enums': 'off',
      'stencil/own-methods-must-be-private': 'off',
      'stencil/required-jsdoc': 'off',

      // Rules from before flat config
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-case-declarations': 'off',
      'react/jsx-no-bind': 'off',
      'react/no-unknown-property': 'off',
    },
  },
];
