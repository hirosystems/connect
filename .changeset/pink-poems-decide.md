---
'@stacks/connect': patch
'@stacks/connect-react': patch
'@stacks/connect-ui': patch
---

This update brings with it many of the changes that we've already added to the @stacks/ui and `stacks-wallet-web` repositories. Namely:
- esbuild is used for both tsdx and webpack builds
- the type declaration outputs for `@stacks/connect` and `@stacks/connect-react` have been cleaned up
- we are now using changesets to version and document our changes in these projects
- adds `patch-package` so that we can make a small patch to `tsdx` to enable better directory output of dist files
