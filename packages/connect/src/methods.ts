import type {
  AddressString,
  ClarityValue,
  ContractIdString,
  PostCondition,
  PostConditionModeName,
  TupleCV,
} from '@stacks/transactions';

// Re-export types from Stacks.js
export type {
  AddressString,
  AssetString,
  ClarityValue,
  ContractIdString,
  FungibleComparator,
  FungiblePostCondition,
  NonFungibleComparator,
  NonFungiblePostCondition,
  PostCondition,
  PostConditionModeName,
  StxPostCondition,
} from '@stacks/transactions';

// TYPES

export type NetworkString = 'mainnet' | 'testnet' | 'regtest' | 'devnet' | string;

export type PrincipalString = AddressString | ContractIdString;

export type Integer = number | bigint | string;

export interface AddressEntry {
  address: string;
  publicKey: string;
}

export interface AccountEntry extends AddressEntry {
  gaiaHubUrl: string;
  gaiaAppKey: string;
}

// PARAMS

interface CommonTxParams {
  /**
   * The recommended address to use for the method.
   *
   * ⚠︎ Warning: Wallets may not implement this for privacy reasons.
   */
  address?: AddressString;

  network?: NetworkString;

  fee?: Integer;
  nonce?: Integer;

  sponsored?: boolean;

  postConditions?: (string | PostCondition)[]; // hex-encoded string or JSON PostCondition
  postConditionMode?: PostConditionModeName;
}

export interface TransferStxParams
  extends Omit<CommonTxParams, 'postConditions' | 'postConditionMode'> {
  recipient: string;
  amount: Integer;
  memo?: string;
}

export interface TransferFungibleParams extends CommonTxParams {
  recipient: string;
  asset: string;
  amount: Integer;
}

export interface TransferNonFungibleParams extends CommonTxParams {
  recipient: string;
  asset: string;
  assetId: ClarityValue; // todo: add string (hex-encoded), add string (clarity syntax)
}

export interface CallContractParams extends CommonTxParams {
  contract: ContractIdString;
  functionName: string;
  functionArgs?: ClarityValue[]; // todo: add string (hex-encoded), add string (clarity syntax)
}

export interface DeployContractParams extends CommonTxParams {
  name: string;
  clarityCode: string;
  clarityVersion?: number;
}

export interface SignTransactionParams {
  transaction: string;
  broadcast?: boolean; // todo: check before merging
}

export interface SignMessageParams {
  message: string;
}

export interface SignStructuredMessageParams {
  message: ClarityValue;
  domain: TupleCV;
}

export interface GetAddressesParams {
  network?: NetworkString;
}

export interface GetAccountsParams {
  network?: NetworkString;
}

export interface UpdateProfileParams {
  profile: Record<string, any>;
}

// RESULTS

export interface TransactionResult {
  txid?: string;
  transaction?: string; // todo: check before merging
}

export interface SignTransactionResult {
  txid?: string;
  transaction: string;
}

export interface SignMessageResult {
  signature: string;
  publicKey: string;
}

export interface GetAddressesResult {
  addresses: AddressEntry[];
}

export interface GetAccountsResult {
  accounts: AccountEntry[];
}

export interface UpdateProfileResult {
  profile: Record<string, any>;
}

// ERROR RESPONSES

// todo: add error responses

// JSON RPC METHODS

/// BITCOIN METHODS

export type SigHash = 'ALL' | 'NONE' | 'SINGLE' | 'ANYONECANPAY';

export interface SignInputsByAddress {
  [address: string]: number[];
}

export interface SignPsbtParams {
  psbt: string;
  signInputs?: number[] | SignInputsByAddress;
  /** @experimental Might need a rename, when SIPs/WBIPs are finalized. */
  allowedSigHash?: SigHash[];
}

export interface SignPsbtResult {
  txid?: string;
  psbt: string;
}

// todo: double check spec
export type JsonRpcResponse<M extends keyof Methods> = {
  jsonrpc: '2.0';
  id: number;
  result: Methods[M]['result'];
  // todo: add error
};

export type Methods = {
  // BTC
  signPsbt: {
    params: SignPsbtParams;
    result: SignPsbtResult;
  };
  getAddresses: {
    params: GetAddressesParams;
    result: GetAddressesResult;
  };
  // STX
  stx_transferStx: {
    params: TransferStxParams;
    result: TransactionResult;
  };
  stx_transferSip10Ft: {
    params: TransferFungibleParams;
    result: TransactionResult;
  };
  stx_transferSip10Nft: {
    params: TransferNonFungibleParams;
    result: TransactionResult;
  };
  stx_callContract: {
    params: CallContractParams;
    result: TransactionResult;
  };
  stx_deployContract: {
    params: DeployContractParams;
    result: TransactionResult;
  };
  stx_signTransaction: {
    params: SignTransactionParams;
    result: SignTransactionResult;
  };
  stx_signMessage: {
    params: SignMessageParams;
    result: SignMessageResult;
  };
  stx_signStructuredMessage: {
    params: SignStructuredMessageParams;
    result: SignMessageResult;
  };
  stx_getAddresses: {
    params: GetAddressesParams;
    result: GetAddressesResult;
  };
  stx_getAccounts: {
    params: GetAccountsParams;
    result: GetAccountsResult;
  };
  stx_updateProfile: {
    params: UpdateProfileParams;
    result: UpdateProfileResult;
  };
};

export type MethodParams<M extends keyof Methods> = Methods[M]['params'];

export type MethodResult<M extends keyof Methods> = Methods[M]['result'];
