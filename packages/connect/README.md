# `@stacks/connect` [![npm](https://img.shields.io/npm/v/@stacks/connect)](https://www.npmjs.com/package/@stacks/connect) <!-- omit in toc -->

## 🐎 Getting Started <!-- omit in toc -->

### 1. Add the dependency <!-- omit in toc -->

Add the `@stacks/connect` dependency to your project using your favorite package manager.
_Some options below_

```shell
npm install @stacks/connect
pnpm install @stacks/connect
yarn add @stacks/connect
```

### 2. Creating `AppConfig` and `UserSession` <!-- omit in toc -->

Add a reusable `UserSession` instance to your project.
This will allow your website to store authentication state in localStorage.

```js
/* ./userSession.js */
import { AppConfig, UserSession } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig }); // we will use this export from other files
```

### 3. Interacting with the wallet <!-- omit in toc -->

- ["Connect" aka authentication (`showConnect`)](#connect-aka-authentication-showconnect)
- [Sending STX (`openSTXTransfer`)](#sending-stx-openstxtransfer)
- [Calling Smart-Contracts (`openContractCall`)](#calling-smart-contracts-opencontractcall)

#### "Connect" aka authentication (`showConnect`)

Connecting the wallet is a very simple form of authentication.
This process gives the web-app information about a wallet account (selected by the user).

The newly created `connect()` method below lets your web-app trigger the wallet to open and _authenticate_ an account.
If no wallet is installed, an informational modal will be displayed in the web-app.

```js
import { showConnect } from '@stacks/connect';
import { userSession } from './userSession';

function connect() {
  showConnect({
    userSession, // `userSession` from previous step, to access storage
    appDetails: {
      // web-app specific shown in pop-up
      name: 'My Stacks Web-App',
      icon: window.location.origin + '/my_logo.png',
    },
    onFinish: () => {
      window.location.reload(); // WHEN user confirms pop-up
    },
    onCancel: () => {
      console.log('oops'); // WHEN user cancels/closes pop-up
    },
  });
}
```

#### Sending STX (`openSTXTransfer`)

Sending STX tokens is also possible through web-apps interacting with a user's wallet.

The newly created `send()` method below will open the wallet to _confirm and broadcast_ a smart-contract transaction.
Here, calling `send(10_000)` passes the pick `Alice` to an imaginary deployed voting smart-contract.

```js
import { openSTXTransfer } from "@stacks/connect";
import { StacksTestnet } from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode
} from "@stacks/transactions";
import { userSession } from './userSession';

function send(amountMicroStacks) {
  openSTXTransfer({
    network: new StacksTestnet(), // which network, api, and node to use
    anchorMode: AnchorMode.Any, // which type of block the tx should be mined in

    recipient: "ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK", // which address we are sending to
    amount: amountMicroStacks, // tokens, denominated in microstacks
    memo: "Nr. 1337", // optional; a memo to help identify the tx

    postConditionMode: PostConditionMode.Deny, // whether the tx should fail when unexpected assets are thransferred
    postConditions: [],

    onFinish: (response) => {
      // WHEN user confirms pop-up
      window
        .open(`https://explorer.stacks.co/txid/${response.txId}?chain=testnet`)
        .focus(); // opens the explorer page for the newly created tx
    },
    onCancel: () => {
      console.log("oh"); // WHEN user cancels/closes pop-up
    },
  });
```

#### Calling Smart-Contracts (`openContractCall`)

Calling smart-contracts lets users interact with the blockchain through transactions.

The newly created `vote()` method below will open the wallet to _confirm and broadcast_ a smart-contract transaction.
Here, calling `vote("Alice")` passes the pick `Alice` to an imaginary deployed voting smart-contract.

```js
import { openContractCall } from "@stacks/connect";
import { StacksTestnet } from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV
} from "@stacks/transactions";
import { userSession } from './userSession';

function vote(pick) {
  openContractCall({
    network: new StacksTestnet(), // which network, api, and node to use
    anchorMode: AnchorMode.Any, // which type of block the tx should be mined in

    contractAddress: "ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK",
    contractName: "example-contract",
    functionName: "vote",
    functionArgs: [stringUtf8CV(pick)],

    postConditionMode: PostConditionMode.Deny, // whether the tx should fail when unexpected assets are thransferred
    postConditions: [],

    onFinish: (response) => {
      // WHEN user confirms pop-up; *see previous example*
    },
    onCancel: () => {
      console.log("hmm"); // WHEN user cancels/closes pop-up
    },
  });
```

## 🤔 Pitfalls <!-- omit in toc -->

- Connect can currently not set manual nonces, since this is not supported by wallets.
- For some projects it might be necessary to also install the `regenerator-runtime` package. `npm install --save-dev regenerator-runtime`. We are working on fixing this.
