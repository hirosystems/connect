import { UserSession } from '@stacks/auth';
import type { AuthOptions } from '../types/auth';
import {
  ClarityValue as LegacyClarityValue,
  PostCondition as LegacyPostCondition,
} from '@stacks/transactions-v6';
import {
  PostConditionMode,
  PostCondition,
  AnchorMode,
  ClarityValue,
  StacksTransactionWire,
} from '@stacks/transactions';
import { ConnectNetwork } from './network';

export interface TxBase {
  appDetails?: AuthOptions['appDetails'];
  postConditionMode?: PostConditionMode;
  postConditions?: (string | LegacyPostCondition | PostCondition)[];
  network?: ConnectNetwork;
  anchorMode?: AnchorMode;
  attachment?: string;
  fee?: number | string;
  /**
   * Provide the Hiro Wallet with a suggested account to sign this transaction with.
   * This is set by default if a `userSession` option is provided.
   */
  stxAddress?: string;
  /** @deprecated `unused - only included for compatibility with @stacks/transactions` */
  senderKey?: string;
  /** @deprecated `unused - only included for compatibility with @stacks/transactions` */
  nonce?: number;
}

export interface SignTransactionBase {
  appDetails?: AuthOptions['appDetails'];
  network?: ConnectNetwork;
  attachment?: string;
  /**
   * Provide wallets with a suggested account to sign this transaction with.
   * This is set by default if a `userSession` option is provided.
   */
  stxAddress?: string;
  txHex: string;
  /** @deprecated `unused - only included for compatibility with other transaction types` */
  postConditions?: (string | LegacyPostCondition | PostCondition)[];
}

export interface SponsoredFinishedTxPayload {
  txRaw: string;
}

export interface SponsoredFinishedTxData extends SponsoredFinishedTxPayload {
  stacksTransaction: StacksTransactionWire;
}

export interface FinishedTxPayload extends SponsoredFinishedTxPayload {
  txId: string;
}

export interface FinishedTxData extends FinishedTxPayload {
  stacksTransaction: StacksTransactionWire;
}

export enum TransactionTypes {
  ContractCall = 'contract_call',
  ContractDeploy = 'smart_contract',
  STXTransfer = 'token_transfer',
}

/**
 * Contract Call
 */

export enum ContractCallArgumentType {
  BUFFER = 'buffer',
  UINT = 'uint',
  INT = 'int',
  PRINCIPAL = 'principal',
  BOOL = 'bool',
}

export interface ContractCallBase extends TxBase {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: (string | LegacyClarityValue | ClarityValue)[];
}

export interface OptionsBase {
  /**
   * @deprecated Authentication is no longer supported through a hosted
   * version. Users must install an extension.
   */
  authOrigin?: string;
  userSession?: UserSession;
}

export type SponsoredFinished = (data: SponsoredFinishedTxData) => void;
export type Finished = (data: FinishedTxData) => void;
export type Canceled = () => void;

export interface SponsoredOptionsBase extends TxBase, OptionsBase {
  sponsored: true;
  onFinish?: SponsoredFinished;
  onCancel?: Canceled;
}

export interface RegularOptionsBase extends TxBase, OptionsBase {
  sponsored?: false;
  onFinish?: Finished;
  onCancel?: Canceled;
}

export type ContractCallRegularOptions = ContractCallBase & RegularOptionsBase;
export type ContractCallSponsoredOptions = ContractCallBase & SponsoredOptionsBase;
export type ContractCallOptions = ContractCallRegularOptions | ContractCallSponsoredOptions;

export interface ContractCallArgument {
  type: ContractCallArgumentType;
  value: string;
}

export interface ContractCallPayload extends ContractCallBase {
  txType: TransactionTypes.ContractCall;
  publicKey: string;
  functionArgs: string[];
  sponsored?: boolean;
}

/**
 * Contract Deploy
 */
export interface ContractDeployBase extends TxBase {
  contractName: string;
  codeBody: string;
  /**
   * Optional integer value to specify the Clarity version to use for this contract.
   * Current live Clarity versions are: `1`, `2`, and `3`.
   *
   * ⚠︎ Warning: Wallets may not support this parameter yet and typically default to the latest Clarity version.
   */
  clarityVersion?: number;
}

export type ContractDeployRegularOptions = ContractDeployBase & RegularOptionsBase;
export type ContractDeploySponsoredOptions = ContractDeployBase & SponsoredOptionsBase;
export type ContractDeployOptions = ContractDeployRegularOptions | ContractDeploySponsoredOptions;

export interface ContractDeployPayload extends ContractDeployBase {
  publicKey: string;
  txType: TransactionTypes.ContractDeploy;
  sponsored?: boolean;
}

/**
 * STX Transfer
 */

export interface STXTransferBase extends TxBase {
  recipient: string;
  amount: BigInt | string;
  memo?: string;
}

export type STXTransferRegularOptions = STXTransferBase & RegularOptionsBase;
export type STXTransferSponsoredOptions = STXTransferBase & SponsoredOptionsBase;
export type STXTransferOptions = STXTransferRegularOptions | STXTransferSponsoredOptions;

export interface STXTransferPayload extends STXTransferBase {
  publicKey: string;
  txType: TransactionTypes.STXTransfer;
  amount: string;
  sponsored?: boolean;
}

/**
 * Transaction Popup
 */

export type TransactionOptions =
  | ContractCallOptions
  | ContractDeployOptions
  | STXTransferOptions
  | SignTransactionOptions;
export type TransactionPayload =
  | ContractCallPayload
  | ContractDeployPayload
  | STXTransferPayload
  | SignTransactionPayload;

export interface TransactionPopup {
  token: string;
  options: TransactionOptions;
}

export interface SignTransactionOptionBase extends SignTransactionBase, OptionsBase {
  onFinish?: SignTransactionFinished;
  onCancel?: Canceled;
}

export interface SignTransactionPayload extends SignTransactionBase {
  publicKey: string;
}

export type SignTransactionFinished = (data: SignTransactionFinishedTxData) => void;

export type SignTransactionOptions = SignTransactionOptionBase;

export interface SignTransactionFinishedTxData {
  stacksTransaction: StacksTransactionWire;
}
