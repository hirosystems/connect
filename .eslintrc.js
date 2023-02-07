module.exports = {
  extends: ['plugin:@stencil-community/recommended', '@stacks/eslint-config'],
  plugins: ['react', 'react-hooks'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  root: true,
  rules: {
    // todo: remove these rules if fixed
    '@stencil-community/own-methods-must-be-private': 'off',
    '@stencil-community/required-jsdoc': 'off',
    '@stencil-community/strict-boolean-conditions': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'react/jsx-no-bind': 'off',
  },
};
