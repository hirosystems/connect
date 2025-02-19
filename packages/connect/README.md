# `@stacks/connect` [![npm](https://img.shields.io/npm/v/@stacks/connect)](https://www.npmjs.com/package/@stacks/connect) <!-- omit in toc -->

> [!NOTE]
> The `7.x.x` version may still be more well supported by some wallets.

For the legacy version of `@stacks/connect` using JWT tokens, please use the following command:

```sh
npm install @stacks/connect@7.10.1
```

---

## Usage <!-- omit in toc -->

> Try the [Connect Method Demo App 🏁](https://connect-hirosystems.vercel.app/iframe?id=connect-connect--default&viewMode=story) to see which methods/features are available for wallets

### Install `@stacks/connect` <!-- omit in toc -->

```shell
npm install @stacks/connect
pnpm install @stacks/connect
yarn add @stacks/connect
```

### Use `request` to trigger wallet interactions <!-- omit in toc -->

```js
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

```js
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

```js
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

```js
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

```js
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

```js
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

```js
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

```js
const response = await request('stx_signMessage', {
  message: 'Hello, World!', // message to sign
});
// {
//   "signature": "0x1234...", // The signature of the message
//   "publicKey": "02d3331cbb9f72fe635e6f87c2cf1a13cdea520f08c0cc68584a96e8ac19d8d304" // The public key that signed the message
// }
```

#### `stx_signStructuredMessage`

```js
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

## Advanced Usage

### `request`

The `request` method can be called with an optional options object as the first parameter:

```ts
import { request } from '@stacks/connect';

// WITH options
const response = await request(
  {
    provider?: StacksProvider;        // Custom provider to use for the request
    defaultProviders?: WbipProvider[]; // Default wallets to display in modal
    forceWalletSelect?: boolean;      // Force user to select a wallet (default: false)
    persistWalletSelect?: boolean;     // Persist selected wallet (default: true)
    enableOverrides?: boolean;         // Enable provider compatibility (default: true)
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

### `requestRaw`

The `requestRaw` method provides direct access to wallet providers without the additional features of `request`:

```ts
import { requestRaw } from '@stacks/connect';

const response = await requestRaw(provider, 'method', params);
```

> Note: `requestRaw` bypasses the UI wallet selector, automatic provider compatibility fixes, and other features that come with `request`.
> Use this when you need more manual control over the wallet interaction process.
