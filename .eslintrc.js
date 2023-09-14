module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@stencil-community/recommended',
    '@stacks/eslint-config',
  ],
  plugins: ['react', 'react-hooks'],
  root: true,
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  rules: {
    // todo: remove these rules if fixed
    '@stencil-community/ban-exported-const-enums': 'off',
    '@stencil-community/own-methods-must-be-private': 'off',
    '@stencil-community/required-jsdoc': 'off',
    '@stencil-community/strict-boolean-conditions': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-redundant-type-constituents': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'react/jsx-no-bind': 'off',
  },
};
