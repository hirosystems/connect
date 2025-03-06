# `@stacks/connect` [![npm](https://img.shields.io/npm/v/@stacks/connect)](https://www.npmjs.com/package/@stacks/connect) <!-- omit in toc -->

> [!NOTE]
> Please be patient during this latest migration.
> There has been a long-running effort together with wallets to modernize and move forward the Stacks web ecosystem.
> It is now culminating in [SIP-030](https://github.com/janniks/sips/blob/main/sips/sip-030/sip-030-wallet-interface.md) and the new `request` method in Stacks Connect `8.x.x`.
> Bear with us during this migration.
> Wallets are still working through some bugs, details, and improvements.
> **We're working on it!**
>
> _Feel free to continue using Stacks Connect `7.x.x` while things stabilize._
> The `7.x.x` version may still be more well supported by some wallets.

For the legacy version of `@stacks/connect` using JWT tokens, please use the following command:

```sh
npm install @stacks/connect@7.10.1
```

## 🛬 Migration Guide <!-- omit in toc -->

**Welcome to the new Stacks Connect! ✨** Read the [`@stacks/connect` docs](./packages/connect) for more information.

For a while now the Stacks community has been working on a new standard for wallet-to-dapp communication.
Stacks Connect and related projects now use standards like [WBIPs](https://wbips.netlify.app/) and [SIP-030](https://github.com/janniks/sips/blob/main/sips/sip-030/sip-030-wallet-interface.md) to allow wallets to communicate with dapps in a more simplified and flexible way.

### ⚠️ Deprecations

The following classes, methods, and types are deprecated in favor of the new `request` RPC methods:

- `show...` and `open...` methods
- `authenticate` method
- `UserSession` class and related functionality
- `AppConfig` class
- `SessionOptions` interface
- `SessionData` interface
- `UserData` interface
- `SessionDataStore` class
- `InstanceDataStore` class
- `LocalStorageStore` class

> [!NOTE]
> To make migrating easier, the familiar `UserSession` & `AppConfig` class still exists and is semi-backwards compatible for the `8.x.x` release.
> It will "cache" the user's address in local storage and allow access to it via the `loadUserData` method (as previously done).

### ▶️ Migration Steps

> To update from `<=7.x.x` to latest/`8.x.x`, follow these steps.

1. Update your `@stacks/connect` version:

```sh
npm install @stacks/connect@latest
```

2. Switch from `showXyz`, `openXyz`, `doXyz` methods to the `request` method.

- `request` follows the pattern `request(method: string, params: object)`, see [Usage](#usage) for more details
- `request` is an async function, so replace the `onFinish` and `onCancel` callbacks with `.then().catch()` or `try & await`

3. Switch from `showConnect` or`authenticate` to `connect()` methods

   - `connect()` is an alias for `request({forceWalletSelect: true}, 'getAddresses')`
   - `connect()` by default caches the user's address in local storage

4. Switch from `UserSession.isSignedIn()` to `isConnected()`
5. Switch from `UserSession.signUserOut()` to `disconnect()`
6. Remove code referencing deprecated methods (`AppConfig`, `UserSession`, etc.)
7. Remove the `@stacks/connect-react` package.
   - You may need to manually reload a component to see local storage updates.
   - No custom hooks are needed to use Stacks Connect anymore.
   - We are working on a new `@stacks/react` package that will make usage even easier in the future (e.g. tracking transaction status, reloading components when a connection is established, updating the page when the network changes, and more).

### 🪪 Address Access

Previously, the `UserSession` class was used to access the user's addresses and data, which abstracted away the underlying implementation details.
Now, the `request` method is used to directly interact with the wallet, giving developers more explicit control and clarity over what's happening under the hood.
This manual approach makes the wallet interaction more transparent and customizable.
Developer can manually manage the currently connected user's address in e.g. local storage, jotai, etc. or use the `connect()`/`request()` method to cache the address in local storage.

> [!IMPORTANT]
> For security reasons, the `8.x.x` release only returns the current network's address (where previously both mainnet and testnet addresses were returned).

---

## Usage <!-- omit in toc -->

> Try the [Connect Method Demo App 🌏](https://connect-hirosystems.vercel.app/iframe?id=connect-connect--default&viewMode=story) to see which methods/features are available for wallets

### Install `@stacks/connect` <!-- omit in toc -->

```shell
npm install @stacks/connect
pnpm install @stacks/connect
yarn add @stacks/connect
```

### Connect to a wallet <!-- omit in toc -->

Initiate a wallet connection and request addresses.

```ts
import { connect } from '@stacks/connect';

const response = await connect(); // stores users address in local storage by default
```

Get the local storage data (stored by a `connect` call).

```ts
import { getLocalStorage } from '@stacks/connect';

const data = getLocalStorage();
// {
//   "addresses": {
//     "stx": [
//       { "address": "SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN" },
//     ],
//     "btc": [
//       { "address": "bc1pp3ha248m0mnaevhp0txfxj5xaxmy03h0j7zuj2upg34mt7s7e32q7mdfae" },
//     ]
//   }
```

Managing the connection state.

```ts
import { connect, disconnect, isConnected } from '@stacks/connect';

isConnected(); // false
await connect(); // similar to the `getAddresses` method
isConnected(); // true
disconnect(); // clears local storage and selected wallet
isConnected(); // false
```

### Use `request` to trigger wallet interactions <!-- omit in toc -->

```ts
import { request } from '@stacks/connect';

// CONNECT
const response = await request({ forceWalletSelect: true }, 'getAddresses');
```

### Available methods <!-- omit in toc -->

- [`getAddresses`](#getaddresses)
- [`sendTransfer`](#sendtransfer)
- [`signPsbt`](#signpsbt)
- [`stx_getAddresses`](#stx_getaddresses)
- [`stx_getAccounts`](#stx_getaccounts)
- [`stx_transferStx`](#stx_transferstx)
- [`stx_callContract`](#stx_callcontract)
- [`stx_deployContract`](#stx_deploycontract)
- [`stx_signMessage`](#stx_signmessage)
- [`stx_signStructuredMessage`](#stx_signstructuredmessage)

#### `getAddresses`

```ts
const response = await request('getAddresses');
// {
//   "addresses": [
//     {
//       "address": "bc1pp3ha248m0mnaevhp0txfxj5xaxmy03h0j7zuj2upg34mt7s7e32q7mdfae",
//       "publicKey": "062bd2c825300d74f4f9feb6b2fec2590beac02b8938f0fc042a34254581ee69",
//     },
//     {
//       "address": "bc1qtmqe7hg4etkq4t384nzg0mrmwf2sam9fjsz0mr",
//       "publicKey": "025b65a0ec0e00699794847f2af1b5d8a53db02a2f48e09417598bef09cfea1114",
//     },
//     {
//       "address": "SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN",
//       "publicKey": "02d3331cbb9f72fe635e6f87c2cf1a13cdea520f08c0cc68584a96e8ac19d8d304",
//     }
//   ]
// }
```

#### `sendTransfer`

```js
const response = await request('sendTransfer', {
  recipients: [
    {
      address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', // recipient address
      amount: '1000', // amount in sats
    },
    // You can specify multiple recipients
    {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      amount: '2000',
    },
  ],
});
// {
//   "txid": "0x1234...", // The transaction ID
// }
```

#### `signPsbt`

```js
const response = await request('signPsbt', {
  psbt: 'cHNidP...', // base64 encoded PSBT string
  signInputs: [{ index: 0, address }], // indices of inputs to sign (optional)
  broadcast: false, // whether to broadcast the transaction after signing (optional)
});
// {
//   "txid": "0x1234...", // The transaction ID (if broadcast is true)
//   "psbt": "cHNidP..." // The signed PSBT in base64 format
// }
```

#### `stx_getAddresses`

```ts
const response = await request('stx_getAddresses');
// {
//   "addresses": [
//     {
//       "address": "bc1pp3ha248m0mnaevhp0txfxj5xaxmy03h0j7zuj2upg34mt7s7e32q7mdfae",
//       "publicKey": "062bd2c825300d74f4f9feb6b2fec2590beac02b8938f0fc042a34254581ee69",
//     },
//     {
//       "address": "bc1qtmqe7hg4etkq4t384nzg0mrmwf2sam9fjsz0mr",
//       "publicKey": "025b65a0ec0e00699794847f2af1b5d8a53db02a2f48e09417598bef09cfea1114",
//     },
//     {
//       "address": "SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN",
//       "publicKey": "02d3331cbb9f72fe635e6f87c2cf1a13cdea520f08c0cc68584a96e8ac19d8d304",
//     }
//   ]
// }
```

#### `stx_getAccounts`

```ts
const response = await request('stx_getAccounts');
// {
//   "addresses": [
//     {
//       "address": "SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN",
//       "publicKey": "02d3331cbb9f72fe635e6f87c2cf1a13cd...",
//       "gaiaHubUrl": "https://hub.hiro.so",
//       "gaiaAppKey": "0488ade4040658015580000000dc81e3a5..."
//     }
//   ]
// }
```

#### `stx_transferStx`

```ts
const response = await request('stx_transferStx', {
  amount: '1000', // amount in micro-STX (1 STX = 1,000,000 micro-STX)
  recipient: 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN', // recipient address
  network: 'mainnet', // optional, defaults to mainnet
  memo: 'Optional memo', // optional memo field
});
// {
//   "txid": "0x1234...", // The transaction ID
// }
```

#### `stx_callContract`

```ts
const response = await request('stx_callContract', {
  contract: 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN.counters', // contract in format: address.contract-name
  functionName: 'count', // name of the function to call
  functionArgs: [Cl.int(3)], // array of Clarity values as arguments
  network: 'mainnet', // optional, defaults to mainnet
});
// {
//   "txid": "0x1234...", // The transaction ID
// }
```

#### `stx_deployContract`

```ts
const response = await request('stx_deployContract', {
  name: 'counters', // name of the contract
  clarityCode: `(define-map counters principal int)

(define-public (count (change int))
  (ok (map-set counters tx-sender (+ (get-count tx-sender) change)))
)

(define-read-only (get-count (who principal))
  (default-to 0 (map-get? counters who))
)`, // Clarity code as string
  clarityVersion: '2', // optional, defaults to latest version
  network: 'mainnet', // optional, defaults to mainnet
});
// {
//   "txid": "0x1234...", // The transaction ID
// }
```

#### `stx_signMessage`

```ts
const response = await request('stx_signMessage', {
  message: 'Hello, World!', // message to sign
});
// {
//   "signature": "0x1234...", // The signature of the message
//   "publicKey": "02d3331cbb9f72fe635e6f87c2cf1a13cdea520f08c0cc68584a96e8ac19d8d304" // The public key that signed the message
// }
```

#### `stx_signStructuredMessage`

```ts
const clarityMessage = Cl.parse('{ structured: "message", num: u3 }');
const clarityDomain = Cl.tuple({
  domain: Cl.stringAscii('example.com'),
  version: Cl.stringAscii('1.0.0'),
  'chain-id': Cl.uint(1),
});

const response = await request('stx_signStructuredMessage', {
  message: clarityMessage, // Clarity value representing the structured message
  domain: clarityDomain, // domain object for SIP-018 style signing
});
// {
//   "signature": "0x1234...", // The signature of the structured message
//   "publicKey": "02d3331cbb9f72fe635e6f87c2cf1a13cdea520f08c0cc68584a96e8ac19d8d304" // The public key that signed the message
// }
```

## Error Handling

The `request` method returns a Promise, allowing you to handle errors using standard Promise-based error handling patterns. You can use either `try/catch` with `async/await` or the `.catch()` method with Promise chains.

### Using try/catch with async/await

```ts
import { request } from '@stacks/connect';

try {
  const response = await request('stx_transferStx', {
    amount: '1000',
    recipient: 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN',
  });
  // SUCCESS
  console.log('Transaction successful:', response.txid);
} catch (error) {
  // ERROR
  console.error('Wallet returned an error:', error);
}
```

## Compatibility

The `request` method by default adds a layer of auto-compatibility for different wallet providers.
This is meant to unify the interface where wallet providers may not implement methods and results the same way.

| Method                      |     | Notes                                                                                                |
| --------------------------- | --- | ---------------------------------------------------------------------------------------------------- |
| `getAddresses`              | 🔵  | <sub>Maps to `wallet_connect` for Xverse-like wallets</sub>                                          |
| `sendTransfer`              | 🔵  | <sub>Converts `amount` to number for Xverse, string for Leather</sub>                                |
| `signPsbt`                  | 🟡  | <sub>Transforms PSBT format for Leather (base64 to hex) with lossy restructure of `signInputs`</sub> |
| `stx_getAddresses`          | 🔵  | <sub>Maps to `wallet_connect` for Xverse-like wallets</sub>                                          |
| `stx_getAccounts`           | 🟢  |                                                                                                      |
| `stx_getNetworks`           | 🟢  |                                                                                                      |
| `stx_transferStx`           | 🟢  |                                                                                                      |
| `stx_transferSip10Ft`       | 🟢  |                                                                                                      |
| `stx_transferSip9Nft`       | 🟢  |                                                                                                      |
| `stx_callContract`          | 🔵  | <sub>Transforms Clarity values to hex-encoded format for compatibility</sub>                         |
| `stx_deployContract`        | 🔵  | <sub>Transforms Clarity values to hex-encoded format for compatibility</sub>                         |
| `stx_signTransaction`       | 🔵  | <sub>Transforms Clarity values to hex-encoded format for compatibility</sub>                         |
| `stx_signMessage`           | 🔵  | <sub>Transforms Clarity values to hex-encoded format for compatibility</sub>                         |
| `stx_signStructuredMessage` | 🔵  | <sub>Transforms Clarity values to hex-encoded format for compatibility</sub>                         |
| `stx_updateProfile`         | 🟢  |                                                                                                      |
| `stx_accountChange` (event) | 🟢  |                                                                                                      |
| `stx_networkChange` (event) | 🟢  |                                                                                                      |

- 🟢 No overrides needed for any wallet
- 🔵 Has compatibility overrides that maintain functionality
- 🟡 Has breaking overrides that may lose some information

> To disable this behavior, you can set the `enableOverrides` option to `false` or use the `requestRaw` method detailed below.

## Advanced Usage

### `request`

The `request` method is called with an optional options object as the first parameter:

```ts
import { request } from '@stacks/connect';

// WITH options
const response = await request(
  {
    provider?: StacksProvider;        // Custom provider to use for the request

    forceWalletSelect?: boolean;      // Force user to select a wallet (default: false)
    persistWalletSelect?: boolean;     // Persist selected wallet (default: true)
    enableOverrides?: boolean;         // Enable provider compatibility (default: true)
    enableLocalStorage?: boolean;      // Store address in local storage (default: true)

    defaultProviders?: WbipProvider[]; // Default wallets to display in modal
    approvedProviderIds?: string[];    // List of approved provider IDs to show in modal
  },
  'method',
  params
);

// WITHOUT options
const response = await request('method', params);
```

> The `enableOverrides` option enables automatic compatibility fixes for different wallet providers.
> For example, it handles converting numeric types between string and number formats as needed by different wallets, and remaps certain method names to match wallet-specific implementations.
> This ensures consistent behavior across different wallet providers without requiring manual adjustments.

> The `approvedProviderIds` option allows you to filter which wallet providers are shown in the connect modal.
> This is useful when you want to limit the available wallet options to specific providers.
> For example, you might only want to support Leather wallet:
>
> ```ts
> connect({ approvedProviderIds: ['LeatherProvider'] });
> ```
>
> Or multiple specific wallets:
>
> ```ts
> connect({ approvedProviderIds: ['LeatherProvider', 'xverse'] });
> ```

### `requestRaw`

The `requestRaw` method provides direct access to wallet providers without the additional features of `request`:

```ts
import { requestRaw } from '@stacks/connect';

const response = await requestRaw(provider, 'method', params);
```

> Note: `requestRaw` bypasses the UI wallet selector, automatic provider compatibility fixes, and other features that come with `request`.
> Use this when you need more manual control over the wallet interaction process.

## Support

Here's a list of methods and events that are supported by popular wallets:

| Method                      | Leather                                            | Xverse-like                                                                    |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ |
| `getAddresses`              | 🟡 <sub>No support for experimental purposes</sub> | 🟡 <sub>Use `wallet_connect` instead</sub>                                     |
| `sendTransfer`              | 🟡 <sub>Expects `amount` as string</sub>           | 🟡 <sub>Expects `amount` as number</sub>                                       |
| `signPsbt`                  | 🟡 <sub>Uses signing index array only</sub>        | 🟡 <sub>Uses `signInputs` record instead of array</sub>                        |
| `stx_getAddresses`          | 🟢                                                 | 🔴                                                                             |
| `stx_getAccounts`           | 🔴                                                 | 🟢                                                                             |
| `stx_getNetworks`           | 🔴                                                 | 🔴                                                                             |
| `stx_transferStx`           | 🟢                                                 | 🟢                                                                             |
| `stx_transferSip10Ft`       | 🟢                                                 | 🔴                                                                             |
| `stx_transferSip9Nft`       | 🟢                                                 | 🔴                                                                             |
| `stx_callContract`          | 🟡 <sub>Hex-encoded Clarity values only</sub>      | 🟡 <sub>Hex-encoded Clarity values only, no support for `postConditions`</sub> |
| `stx_deployContract`        | 🟡 <sub>Hex-encoded Clarity values only</sub>      | 🟡 <sub>Hex-encoded Clarity values only, no support for `postConditions`</sub> |
| `stx_signTransaction`       | 🟡 <sub>Hex-encoded Clarity values only</sub>      | 🟡 <sub>Hex-encoded Clarity values only</sub>                                  |
| `stx_signMessage`           | 🟡 <sub>Hex-encoded Clarity values only</sub>      | 🟡 <sub>Hex-encoded Clarity values only</sub>                                  |
| `stx_signStructuredMessage` | 🟡 <sub>Hex-encoded Clarity values only</sub>      | 🟡 <sub>Hex-encoded Clarity values only</sub>                                  |
| `stx_updateProfile`         | 🔴                                                 | 🔴                                                                             |

| Event               | Leather | Xverse |
| ------------------- | ------- | ------ |
| `stx_accountChange` | 🔴      | 🔴     |
| `stx_networkChange` | 🔴      | 🔴     |

- 🔴 No support (yet)
- 🟡 Partial support
- 🟢 Supported

---

<div align="center"><br>

[![Hiro Docs](https://img.shields.io/badge/%2F--%2F-Docs-orange?labelColor=gray)](https://docs.hiro.so/)&nbsp;&nbsp;[![Hiro Twitter](https://img.shields.io/badge/Follow%20%40hirosystems-orange?labelColor=gray&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHBhdGggZmlsbD0iI2ZmZiIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNNTAgMTAuNGMtMS44LjktMy44IDEuNC01LjggMS43IDItMS4zIDMuNy0zLjMgNC41LTUuNy0yIDEuMS00LjIgMi02LjYgMi41YTEwLjMgMTAuMyAwIDAgMC0xNy41IDkuM0EyOS4yIDI5LjIgMCAwIDEgMy40IDcuNWExMC4yIDEwLjIgMCAwIDAgMy4yIDEzLjdDNSAyMS4yIDMuMyAyMC43IDIgMjB2LjJjMCA1IDMuNSA5LjEgOC4yIDEwYTEwLjMgMTAuMyAwIDAgMS00LjYuMmMxLjMgNC4xIDUgNyA5LjYgNy4yQTIwLjYgMjAuNiAwIDAgMS0uMSA0MS43YTI5IDI5IDAgMCAwIDQ1LTI2YzItMS40IDMuOC0zLjIgNS4yLTUuM3oiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXNpemU9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6bm9ybWFsIiB0ZXh0LWFuY2hvcj0ibm9uZSIgdHJhbnNmb3JtPSJzY2FsZSg1LjEpIi8+PC9zdmc+&logoColor=white)](https://twitter.com/hirosystems)&nbsp;&nbsp;[![Stacks Discord](https://img.shields.io/badge/%23stacks--js_on%20Discord-orange?labelColor=gray&logo=discord&logoColor=white)](https://stacks.chat/)

</div>
