/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const Webpackbar = require('webpackbar');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const { version } = require('./package.json');

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'esnext',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'esnext',
        loader: 'tsx',
      }),
    ],
    flagIncludedChunks: false,
    concatenateModules: false,
    moduleIds: 'deterministic',
    splitChunks: false,
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      'bn.js': require.resolve('bn.js'),
      buffer: require.resolve('buffer'),
    },
    fallback: {
      url: require.resolve('url'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      assert: require.resolve('assert'),
    },
  },
  devtool: false,
  plugins: [
    new Webpackbar({}),
    // BIP39 includes ~240KB of non-english json that we don't currently use.
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/wordlists\/(?!english)/,
      contextRegExp: /bip39\/src$/,
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      __VERSION__: JSON.stringify(version),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      fetch: 'cross-fetch',
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'stacksConnect',
    libraryTarget: 'var',
  },
};
