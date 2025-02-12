---
'@stacks/connect-react': major
'@stacks/connect': major
---

Switch to new RPC API with SIP-030

BREAKING CHANGE:

Adds the new `request` method to the `@stacks/connect` package.
Which is the default way of interacting with Bitcoin and Stacks wallets.
This update needs a slightly breaking change to the `showXyz` and `openXyz` methods.

- ADDED `request` (UI) and `requestRaw` for calling wallet RPC methods
- UPDATED `SessionData` and `UserSession` to only expose a light `UserData` with `profile.stxAddress`
- UPDATED `StacksProvider` to only have a `request` method
- REMOVED `BlockstackProvider`, `StacksProvider`
