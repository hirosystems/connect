# Change Log

## 5.5.2

### Patch Changes

- [#248](https://github.com/hirosystems/connect/pull/248) [`3702aa0`](https://github.com/hirosystems/connect/commit/3702aa0c0d1d436a7eef09e5bc49331e81f33736) Thanks [@janniks](https://github.com/janniks)! - Revert adding a static showConnect alternative

## 5.5.1

### Patch Changes

- [#234](https://github.com/hirosystems/connect/pull/234) [`425e771`](https://github.com/hirosystems/connect/commit/425e771f2d07b45254a9c63387a07480a0dee2c1) Thanks [@janniks](https://github.com/janniks)! - Add static show method

## 5.5.0

### Minor Changes

- [#204](https://github.com/hirosystems/connect/pull/204) [`b03d98c`](https://github.com/hirosystems/connect/commit/b03d98c74e795dfd3f8f38e9b7dad6c283e91f58) Thanks [@janniks](https://github.com/janniks)! - Upgrade stacks.js dependencies to 3.3.0.

## 5.4.1

### Patch Changes

- [#207](https://github.com/hirosystems/connect/pull/207) [`25341ab`](https://github.com/hirosystems/connect/commit/25341ab52d8350cd2be6ec726157a3b9095682a2) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes broken png illustrations in the download modal.

## 5.4.0

### Minor Changes

- [#199](https://github.com/hirosystems/connect/pull/199) [`4073fee`](https://github.com/hirosystems/connect/commit/4073feedc39fc6223129787bd9dc122398ba0ab6) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This updates our old 'stacks-wallet' download paths to be 'hiro-wallet'.

## 5.3.0

### Minor Changes

- [#193](https://github.com/hirosystems/connect/pull/193) [`0cad6f1`](https://github.com/hirosystems/connect/commit/0cad6f169594ab3d6b66f829556221610c6538f3) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This updates the modal illustrations and adds the onCancel callback to closing the modal

## 5.2.0

### Minor Changes

- [#159](https://github.com/blockstack/connect/pull/159) [`a499f61`](https://github.com/blockstack/connect/commit/a499f6127b511bcb030b082d6c7d0c8643638b47) Thanks [@kyranjamie](https://github.com/kyranjamie)! - This updates all stacks.js packages.

## 5.1.6

### Patch Changes

- [#155](https://github.com/blockstack/connect/pull/155) [`3ec7fee`](https://github.com/blockstack/connect/commit/3ec7fee3b14aec048e4534bc2fbe804b7933454d) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This updates the wallet name in all places to Hiro Wallet.

## 5.1.5

### Patch Changes

- [#145](https://github.com/blockstack/connect/pull/145) [`f354a11`](https://github.com/blockstack/connect/commit/f354a11ae6771b6857a3413916587fe10bd2fa1e) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This adds handling unsupported browsers in the intro modal.

## 5.1.4

### Patch Changes

- [#140](https://github.com/blockstack/connect/pull/140) [`71fdcb4`](https://github.com/blockstack/connect/commit/71fdcb4bc182d1c4a9e21d8b084d132d9d715e21) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This implements new designs for the intro (install) modal.

## 5.1.3

### Patch Changes

- [#139](https://github.com/blockstack/connect/pull/139) [`8c0fc9a`](https://github.com/blockstack/connect/commit/8c0fc9acf068fa49e8dbb82652d5cfc54ceb182a) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This makes modifications to our stencil config so we can import our custom elements properly in connect.

## 5.1.2

### Patch Changes

- [#124](https://github.com/blockstack/connect/pull/124) [`f21e8fb`](https://github.com/blockstack/connect/commit/f21e8fbbb03d5057235d116aced914eaafc1a293) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This changes the path for downloading the firefox web wallet to be the firefox store

* [#125](https://github.com/blockstack/connect/pull/125) [`107908d`](https://github.com/blockstack/connect/commit/107908dd78faae2d92673ec6eb7c0963e1052f51) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes closing the modal that prompts users to install the stacks wallet.

## 5.1.1

### Patch Changes

- [#109](https://github.com/blockstack/connect/pull/109) [`b0ccf13`](https://github.com/blockstack/connect/commit/b0ccf13673f0d56c18c986469fce8e34c63cf177) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This changes the path for downloading the chrome web wallet to be the chrome store

## 5.1.0

### Minor Changes

- [#115](https://github.com/blockstack/connect/pull/115) [`b6e77d9`](https://github.com/blockstack/connect/commit/b6e77d94cb5496352c469e88af07e399066b40e7) Thanks [@aulneau](https://github.com/aulneau)! - Updates the main and module paths for cjs and esm builds

## 5.0.6

### Patch Changes

- [#93](https://github.com/blockstack/connect/pull/93) [`d8b58a5`](https://github.com/blockstack/connect/commit/d8b58a5c5ac525d6383eb1c62c23a16ad02a91b8) Thanks [@aulneau](https://github.com/aulneau)! - This update brings with it many of the changes that we've already added to the @stacks/ui and `stacks-wallet-web` repositories. Namely:
  - esbuild is used for both tsdx and webpack builds
  - the type declaration outputs for `@stacks/connect` and `@stacks/connect-react` have been cleaned up
  - we are now using changesets to version and document our changes in these projects
  - adds `patch-package` so that we can make a small patch to `tsdx` to enable better directory output of dist files

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.0.5 (2021-03-17)

### Bug Fixes

- promise handling in `authenticate` ([1075ee2](https://github.com/blockstack/connect/commit/1075ee2c8181f9130ed5e0f073359b4bd2f78daf))

## 3.0.3 (2021-03-08)

### Bug Fixes

- object-src replace ([5f54666](https://github.com/blockstack/ux/commit/5f54666f36a9b24362a09c5f03ebeeed28c12b33))

## 3.0.2 (2021-03-08)

### Bug Fixes

- deps ([86de1c1](https://github.com/blockstack/ux/commit/86de1c1a931ceaa141d4baf0c88612c180216f35))

## 3.0.1 (2021-03-08)

### Bug Fixes

- checkout main when publishing npm on main ([40446a0](https://github.com/blockstack/ux/commit/40446a0264ccdbcc4ddc556118517680e39b246f))

# [3.0.0](https://github.com/blockstack/ux/compare/@stacks/connect-ui@2.17.16...@stacks/connect-ui@3.0.0) (2021-03-05)

### Bug Fixes

- webpack 5, fast refresh :~) ([63d7d38](https://github.com/blockstack/ux/commit/63d7d383855ab46545bccea4302858960e806a5c))

### Features

- improved UX around wallet onboarding ([8ab3dd3](https://github.com/blockstack/ux/commit/8ab3dd397b16a6c46f225286826966b5ef5db250))
- stacks wallet for web ([6957c04](https://github.com/blockstack/ux/commit/6957c04bdcfb816fcf757815b9b2720e7a9209eb))
- use extension-native apis for app messaging ([663281a](https://github.com/blockstack/ux/commit/663281ad6e7a29e572ae6a6f24cf2bc6925a6a3b))

## 2.17.16 (2021-01-09)

**Note:** Version bump only for package @stacks/connect-ui

## 2.17.15 (2021-01-08)

### Bug Fixes

- broken tx signing with extension ([0235140](https://github.com/blockstack/ux/commit/023514021c64e06a80bc31125831d5c35ece3118))

## 2.17.14 (2021-01-06)

### Bug Fixes

- ignore exit code from FF addon publish ([ae05d36](https://github.com/blockstack/ux/commit/ae05d3608ac48cf3944d6d62ead2be65bc11bfde))

## 2.17.13 (2021-01-06)

### Bug Fixes

- use job conditionals instead of workflow conditional ([772b374](https://github.com/blockstack/ux/commit/772b3740def1b31fccf004630ef2d29d167210a4))

## 2.17.12 (2021-01-06)

### Bug Fixes

- ignore tags refs for version workflow ([d2a18fc](https://github.com/blockstack/ux/commit/d2a18fc45a4198a112e881552fbb6c502e557d90))

## 2.17.11 (2021-01-06)

### Bug Fixes

- better syntax for excluding tagged commits' ([4729d01](https://github.com/blockstack/ux/commit/4729d01a5afea316c55dade9143f83748b25071b))

## 2.17.10 (2021-01-06)

### Bug Fixes

- dont run publish on master commits without tag ([0b7cb3a](https://github.com/blockstack/ux/commit/0b7cb3ac50af92bd9ad993b70d48cd930fd31c29))

## 2.17.9 (2021-01-06)

**Note:** Version bump only for package @stacks/connect-ui

## 2.17.8 (2020-12-29)

### Bug Fixes

- build rpc pkg before deploying contracts ([c56d3f7](https://github.com/blockstack/ux/commit/c56d3f776494cd471aba77d35b7c5eba20ec245f))

## 2.17.7 (2020-12-29)

### Bug Fixes

- support ts paths in deploy-contracts script ([4bc3ce3](https://github.com/blockstack/ux/commit/4bc3ce3030e392f850cdeaea0e55c6bbaba7c15e))

## 2.17.6 (2020-12-29)

### Bug Fixes

- build packages before deploy-contracts script ([66f0857](https://github.com/blockstack/ux/commit/66f0857cde41d197c29682eedefd46bc16910096))

## 2.17.5 (2020-12-29)

### Bug Fixes

- auto-deploy testnet contracts with github actions ([b1b5c97](https://github.com/blockstack/ux/commit/b1b5c977bc90a9c47e08264d7e0aef665099696e))

## 2.17.4 (2020-12-14)

### Bug Fixes

- prod deploy apps job action ([b8ccc59](https://github.com/blockstack/ux/commit/b8ccc59d1c024705b80991ecb604030f8590e89d))

## 2.17.3 (2020-12-14)

### Bug Fixes

- change lerna publish to skip existing versions ([ac16572](https://github.com/blockstack/ux/commit/ac16572dba7e8d3e770bb4ba61d77094bcad02f9))

## 2.17.1 (2020-12-04)

### Bug Fixes

- export auth from connect ([d201aab](https://github.com/blockstack/ux/commit/d201aab14f2ced0b5f666be571035b7cbf76c602))

# 2.17.0 (2020-11-25)

### Features

- update extension build instructions ([4d55afa](https://github.com/blockstack/ux/commit/4d55afa51dbc3b4cedb81de679b16b91b2df007c))

## 2.16.4 (2020-11-18)

### Bug Fixes

- duplicate 'powered by' on sign in, fixes [#629](https://github.com/blockstack/ux/issues/629) ([6648517](https://github.com/blockstack/ux/commit/6648517e01cdd34a91225dfe08483055b418439c))

## 2.16.3 (2020-11-17)

### Bug Fixes

- update actions to fix set-path err ([0b4fd95](https://github.com/blockstack/ux/commit/0b4fd955f920d5c549690945a18673ea5f0462ae))

## 2.16.2 (2020-11-13)

**Note:** Version bump only for package @stacks/connect-ui

## 2.16.1 (2020-11-09)

### Bug Fixes

- build connect ui in build-ext.sh ([c0bd586](https://github.com/blockstack/ux/commit/c0bd586da2baace269144d8797555177882de76a))

# 2.16.0 (2020-11-07)

### Features

- more tests for url validation ([cad6e6a](https://github.com/blockstack/ux/commit/cad6e6a489bfd4de67ff8c20e480b3db99e97e4e))

## 2.15.4 (2020-11-06)

### Bug Fixes

- blockstack, react dep versions ([7f23d36](https://github.com/blockstack/ux/commit/7f23d36b0b6e4531027cd4b2c3cf5d76c7a274d2))

## 2.15.3 (2020-11-05)

### Bug Fixes

- valid-url package for url validation ([2d0664b](https://github.com/blockstack/ux/commit/2d0664b302dbf7464a9c9c5730e85675375b5a0e))

## 2.15.2 (2020-11-05)

### Bug Fixes

- add dep to app ([eade246](https://github.com/blockstack/ux/commit/eade246edadfb2963c543f3647ba348f77c170ec))

## 2.15.1 (2020-11-05)

### Bug Fixes

- add additional url validation ([1b67fbd](https://github.com/blockstack/ux/commit/1b67fbd91d0eb3cbfabfed297b9e18dfd7ab497b))

# 2.15.0 (2020-11-04)

### Features

- further simplify app instructions ([598827d](https://github.com/blockstack/ux/commit/598827d919fb62f9cc5308ebee5eac6acec4e982))

## 2.14.1 (2020-11-03)

### Bug Fixes

- proper glob for lerna packages ([5367055](https://github.com/blockstack/ux/commit/5367055e9c6622dd0a93f97275ab652a9af56bf9))

# 2.14.0 (2020-11-02)

### Bug Fixes

- remove debug logging around message pong ([c91581c](https://github.com/blockstack/ux/commit/c91581cac99ff0bcbb1f61fa0d09c92206d1fb2a))
- stencil publishing tweaks ([db45290](https://github.com/blockstack/ux/commit/db45290e6effbae8e91c9f0d2ab3c9d205cca0f0))

### Features

- refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
- rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))

## [2.13.1](https://github.com/blockstack/ux/compare/@stacks/connect-ui@2.13.0...@stacks/connect-ui@2.13.1) (2020-11-02)

### Bug Fixes

- esm loader setup for stencil ([10c2eef](https://github.com/blockstack/ux/commit/10c2eefb1a216b7e6f72bfab7959f9453202c55d))

# 2.13.0 (2020-11-02)

### Bug Fixes

- remove debug logging around message pong ([c91581c](https://github.com/blockstack/ux/commit/c91581cac99ff0bcbb1f61fa0d09c92206d1fb2a))

### Features

- refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
- rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))
