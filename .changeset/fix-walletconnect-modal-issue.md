---
'@stacks/connect': patch
---

Ensure `getProvider()` is called after all providers are initialized to prevent wallet selection modal from showing unnecessarily when using WalletConnect
