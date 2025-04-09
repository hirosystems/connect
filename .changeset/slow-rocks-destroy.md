---
'@stacks/connect': patch
---

Add override for experimental non-standard parameter `publicKey` in the `stx_signMessage` wallet method. This parameter will now be stripped for non-Xverse-like wallets.
