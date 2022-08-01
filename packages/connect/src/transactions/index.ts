import { UserSession, AppConfig } from '@stacks/auth';
import { createUnsecuredToken, Json, SECP256K1Client, TokenSigner } from 'jsontokens';
import {
  ContractCallOptions,
  ContractCallPayload,
  ContractDeployOptions,
  ContractDeployPayload,
  TransactionPopup,
  TransactionOptions,
  STXTransferOptions,
  STXTransferPayload,
  TransactionPayload,
  TransactionTypes,
  STXTransferSponsoredOptions,
  STXTransferRegularOptions,
  ContractDeployRegularOptions,
  ContractDeploySponsoredOptions,
  ContractCallRegularOptions,
  ContractCallSponsoredOptions,
  SponsoredFinishedTxPayload,
  FinishedTxPayload,
} from '../types/transactions';
import {
  serializeCV,
  ChainID,
  deserializeTransaction,
  BufferReader,
  serializePostCondition,
  PostCondition,
} from '@stacks/transactions';
import { getStacksProvider } from '../utils';
import { StacksTestnet } from '@stacks/network';

// TODO extract out of transactions
export const getUserSession = (_userSession?: UserSession) => {
  let userSession = _userSession;

  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    userSession = new UserSession({ appConfig });
  }
  return userSession;
};

export function hasAppPrivateKey(userSession?: UserSession) {
  try {
    const session = getUserSession(userSession).loadUserData();
    return session.appPrivateKey;
  } catch (e) {
    return false;
  }
}

export const getKeys = (_userSession?: UserSession) => {
  const userSession = getUserSession(_userSession);
  const privateKey = userSession.loadUserData().appPrivateKey;
  const publicKey = SECP256K1Client.derivePublicKey(privateKey);

  return { privateKey, publicKey };
};

// TODO extract out of transactions
export function getStxAddress(options: TransactionOptions) {
  const { stxAddress, userSession, network } = options;

  if (stxAddress) return stxAddress;
  if (!userSession || !network) return undefined;
  const stxAddresses = userSession?.loadUserData().profile?.stxAddress;
  const chainIdToKey = {
    [ChainID.Mainnet]: 'mainnet',
    [ChainID.Testnet]: 'testnet',
  };
  const address: string | undefined = stxAddresses?.[chainIdToKey[network.chainId]];
  return address;
}

function getDefaults(options: TransactionOptions) {
  const network = options.network || new StacksTestnet();

  // Legacy auth using localstorage with appPrivateKey
  if (hasAppPrivateKey(options.userSession)) {
    const userSession = getUserSession(options.userSession);
    const defaults: TransactionOptions = {
      ...options,
      network,
      userSession,
    };

    return {
      stxAddress: getStxAddress(defaults),
      ...defaults,
    };
  }

  // User has not authed, we're relying on the app having previously having been
  // given permissions from  `stx_requestAccounts`, and the wallet recognising the app's origin
  // const hasSetRequiredStxAddressPropForRequestAccountFlow = 'stxAddress' in options;
  // if (!hasSetRequiredStxAddressPropForRequestAccountFlow) {
  //   throw new Error(
  //     'Must set property `stxAddress` when using `stx_requestAccounts to initiate transaction`'
  //   );
  // }
  return { ...options, network };
}

function encodePostConditions(postConditions: PostCondition[]) {
  return postConditions.map(pc => serializePostCondition(pc).toString('hex'));
}

async function signPayload(payload: TransactionPayload, privateKey: string) {
  let { postConditions } = payload;
  if (postConditions && typeof postConditions[0] !== 'string') {
    postConditions = encodePostConditions(postConditions as PostCondition[]);
  }
  const tokenSigner = new TokenSigner('ES256k', privateKey);
  return tokenSigner.signAsync({ ...payload, postConditions } as any);
}

function createUnsignedTransactionPayload(payload: Partial<TransactionPayload>) {
  let { postConditions } = payload;
  if (postConditions && typeof postConditions[0] !== 'string') {
    postConditions = encodePostConditions(postConditions as PostCondition[]);
  }
  return createUnsecuredToken({ ...payload, postConditions } as unknown as Json);
}

const openTransactionPopup = async ({ token, options }: TransactionPopup) => {
  const provider = getStacksProvider();
  if (!provider) {
    throw new Error('Hiro Wallet not installed');
  }

  try {
    const txResponse = await provider.transactionRequest(token);
    const { txRaw } = txResponse;
    const txBuffer = Buffer.from(txRaw.replace(/^0x/, ''), 'hex');
    const stacksTransaction = deserializeTransaction(new BufferReader(txBuffer));

    if ('sponsored' in options && options.sponsored) {
      options.onFinish?.({
        ...(txResponse as SponsoredFinishedTxPayload),
        stacksTransaction,
      });
      return;
    }
    options.onFinish?.({
      ...(txResponse as FinishedTxPayload),
      stacksTransaction,
    });
  } catch (error) {
    console.error('[Connect] Error during transaction request', error);
    options.onCancel?.();
  }
};

export const makeContractCallToken = async (options: ContractCallOptions) => {
  const { functionArgs, appDetails, userSession, ..._options } = options;

  const args: string[] = functionArgs.map(arg => {
    if (typeof arg === 'string') {
      return arg;
    }
    return serializeCV(arg).toString('hex');
  });
  if (hasAppPrivateKey(userSession)) {
    const { privateKey, publicKey } = getKeys(userSession);
    const payload: ContractCallPayload = {
      ..._options,
      functionArgs: args,
      txType: TransactionTypes.ContractCall,
      publicKey,
    };
    if (appDetails) payload.appDetails = appDetails;
    return signPayload(payload, privateKey);
  }
  const payload: Partial<ContractCallPayload> = {
    ..._options,
    functionArgs: args,
    txType: TransactionTypes.ContractCall,
  };
  if (appDetails) payload.appDetails = appDetails;
  return createUnsignedTransactionPayload(payload);
};

export const makeContractDeployToken = async (options: ContractDeployOptions) => {
  const { appDetails, userSession, ..._options } = options;
  if (hasAppPrivateKey(userSession)) {
    const { privateKey, publicKey } = getKeys(userSession);
    const payload: ContractDeployPayload = {
      ..._options,
      publicKey,
      txType: TransactionTypes.ContractDeploy,
    };
    if (appDetails) payload.appDetails = appDetails;
    return signPayload(payload, privateKey);
  }

  const payload: Partial<ContractDeployPayload> = {
    ..._options,
    txType: TransactionTypes.ContractDeploy,
  };
  if (appDetails) payload.appDetails = appDetails;
  return createUnsignedTransactionPayload(payload);
};

export const makeSTXTransferToken = async (options: STXTransferOptions) => {
  const { amount, appDetails, userSession, ..._options } = options;

  if (hasAppPrivateKey(userSession)) {
    const { privateKey, publicKey } = getKeys(userSession);
    const payload: STXTransferPayload = {
      ..._options,
      amount: amount.toString(10),
      publicKey,
      txType: TransactionTypes.STXTransfer,
    };
    if (appDetails) payload.appDetails = appDetails;
    return signPayload(payload, privateKey);
  }

  const payload: Partial<STXTransferPayload> = {
    ..._options,
    amount: amount.toString(10),
    txType: TransactionTypes.STXTransfer,
  };
  if (appDetails) payload.appDetails = appDetails;
  return createUnsignedTransactionPayload(payload);
};

async function generateTokenAndOpenPopup<T extends TransactionOptions>(
  options: T,
  makeTokenFn: (options: T) => Promise<string>
) {
  const token = await makeTokenFn({
    ...getDefaults(options),
    ...options,
  } as T);
  return openTransactionPopup({ token, options });
}

export function openContractCall(options: ContractCallRegularOptions): Promise<void>;
export function openContractCall(options: ContractCallSponsoredOptions): Promise<void>;
export function openContractCall(options: ContractCallOptions): Promise<void>;
export function openContractCall(options: ContractCallOptions) {
  return generateTokenAndOpenPopup(options, makeContractCallToken);
}

export function openContractDeploy(options: ContractDeployRegularOptions): Promise<void>;
export function openContractDeploy(options: ContractDeploySponsoredOptions): Promise<void>;
export function openContractDeploy(options: ContractDeployOptions): Promise<void>;
export function openContractDeploy(options: ContractDeployOptions) {
  return generateTokenAndOpenPopup(options, makeContractDeployToken);
}

export function openSTXTransfer(options: STXTransferRegularOptions): Promise<void>;
export function openSTXTransfer(options: STXTransferSponsoredOptions): Promise<void>;
export function openSTXTransfer(options: STXTransferOptions): Promise<void>;
export function openSTXTransfer(options: STXTransferOptions) {
  return generateTokenAndOpenPopup(options, makeSTXTransferToken);
}
