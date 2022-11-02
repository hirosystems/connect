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
- [Sending transactions with post-conditions (`openSTXTransfer`)](#sending-transactions-with-post-conditions-openstxtransfer)
  - [Post-Condition Modes](#post-condition-modes)
- [Calling Smart-Contracts (`openContractCall`)](#calling-smart-contracts-opencontractcall)

#### "Connect" aka authentication (`showConnect`)

Connecting the wallet is a very simple form of authentication.
This process gives the web-app information about a wallet account (selected by the user).

The snippet below lets your web-app trigger the wallet to open and _authenticate_ an account.
If no wallet is installed, an informational modal will be displayed in the web-app.

```js
import { showConnect } from '@stacks/connect';
import { userSession } from './userSession';

const myAppName = 'My Stacks Web-App'; // shown in wallet pop-up
const myAppIcon = window.location.origin + '/my_logo.png'; // shown in wallet pop-up

showConnect({
  userSession, // `userSession` from previous step, to access storage
  appDetails: {
    name: myAppName,
    icon: myAppIcon,
  },
  onFinish: () => {
    window.location.reload(); // WHEN user confirms pop-up
  },
  onCancel: () => {
    console.log('oops'); // WHEN user cancels/closes pop-up
  },
});
```

#### Sending STX (`openSTXTransfer`)

Sending STX tokens is also possible through web-apps interacting with a user's wallet.

The snippet below will open the wallet to _confirm and broadcast_ a smart-contract transaction.
Here, we are sending `10000` micro-STX tokens to a recipient address.

```js
import { openSTXTransfer } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode, PostConditionMode } from '@stacks/transactions';
import { userSession } from './userSession';

openSTXTransfer({
  network: new StacksTestnet(), // which network to use; use `new StacksMainnet()` for mainnet
  anchorMode: AnchorMode.Any, // which type of block the tx should be mined in

  recipient: 'ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK', // which address we are sending to
  amount: 10000, // tokens, denominated in micro-STX
  memo: 'Nr. 1337', // optional; a memo to help identify the tx

  postConditionMode: PostConditionMode.Deny, // whether the tx should fail when unexpected assets are transferred
  postConditions: [], // for an example using post-conditions, see next example

  onFinish: response => {
    // WHEN user confirms pop-up
    console.log(response.txid); // the response includes the txid of the transaction
  },
  onCancel: () => {
    // WHEN user cancels/closes pop-up
    console.log('User canceled');
  },
});
```

#### Sending transactions with post-conditions (`openSTXTransfer`)

Consider the example above.
Using [post-conditions](https://docs.hiro.so/get-started/transactions#post-conditions), a feature of the Stacks blockchain, we can ensure something happened after a transaction.
Here, we could ensure that the recipient indeed receives a certain amount of STX.

```js
import {
  PostConditionMode,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';

// this post-condition ensures that our recipient receives at least 5000 tokens
const myPostCondition = makeStandardSTXPostCondition(
  'ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK', // address of recipient
  FungibleConditionCode.GreaterEqual, // comparator
  5000 // relative amount to previous balance
);

// passing to `openSTXTransfer` options, e.g. modifying our previous example ...
  postConditionMode: PostConditionMode.Deny, // whether the tx should fail when unexpected assets are transferred
  postConditions: [ myPostCondition ],
// ...
```

> For more examples on constructing different kinds of post-conditions read the [Post-Conditions Guide of Stacks.js](https://github.com/hirosystems/stacks.js/tree/master/packages/transactions#post-conditions).

##### Post-Condition Modes

If post-conditions `postConditions: [ ... ]` are specified, they will ALWAYS be checked by blockchain nodes.
If ANY conditions fails, the transaction will fail.

The _Post-Condition Mode_ only relates to transfers of assets, which were not specified in the `postConditions`.

- `PostConditionMode.Deny` will fail the transaction if any unspecified assets are transferred
- `PostConditionMode.Allow` will allow unspecified assets to be transferred
- In both cases, all `postConditions` will be checked

#### Calling Smart-Contracts (`openContractCall`)

Calling smart-contracts lets users interact with the blockchain through transactions.

The snippet below will open the wallet to _confirm and broadcast_ a smart-contract transaction.
Here, we are passing our pick `Alice` to an imaginary deployed voting smart-contract.

```js
import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { AnchorMode, PostConditionMode, stringUtf8CV } from '@stacks/transactions';
import { userSession } from './userSession';

openContractCall({
  network: new StacksTestnet(), // which network to use
  anchorMode: AnchorMode.Any, // which type of block the tx should be mined in

  contractAddress: 'ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK',
  contractName: 'example-contract',
  functionName: 'vote',
  functionArgs: [stringUtf8CV(pick)],

  postConditionMode: PostConditionMode.Deny, // whether the tx should fail when unexpected assets are transferred
  postConditions: [],

  onFinish: response => {
    // WHEN user confirms pop-up
  },
  onCancel: () => {
    // WHEN user cancels/closes pop-up
  },
});
```

## 🤔 Pitfalls <!-- omit in toc -->

- Connect can currently not set manual nonces, since this is not supported by wallets.
- For some projects it might be necessary to also install the `regenerator-runtime` package. `npm install --save-dev regenerator-runtime`. This is a build issue of `@stacks/connect` and we are working on a fix.
