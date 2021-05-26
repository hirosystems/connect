import { UserSession } from '@stacks/auth';
import type { AuthOptions } from '../types/auth';
import {
  PostConditionMode,
  PostCondition,
  AnchorMode,
  ClarityValue,
  StacksTransaction,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import BN from 'bn.js';

export interface TxBase {
  appDetails?: AuthOptions['appDetails'];
  postConditionMode?: PostConditionMode;
  postConditions?: (string | PostCondition)[];
  network?: StacksNetwork;
  anchorMode?: AnchorMode;
  attachment?: string;
  /**
   * Provide the Stacks Wallet with a suggested account to sign this transaction with.
   * This is set by default if a `userSession` option is provided.
   */
  stxAddress?: string;
  /** @deprecated `unused - only included for compatibility with @stacks/transactions` */
  senderKey?: string;
  /** @deprecated `unused - only included for compatibility with @stacks/transactions` */
  nonce?: number;
}

export interface SponsoredFinishedTxPayload {
  txRaw: string;
}

export interface SponsoredFinishedTxData extends SponsoredFinishedTxPayload {
  stacksTransaction: StacksTransaction;
}

export interface FinishedTxPayload extends SponsoredFinishedTxPayload {
  txId: string;
}

export interface FinishedTxData extends FinishedTxPayload {
  stacksTransaction: StacksTransaction;
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
  functionArgs: (string | ClarityValue)[];
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
  amount: BN | string;
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

export type TransactionOptions = ContractCallOptions | ContractDeployOptions | STXTransferOptions;
export type TransactionPayload = ContractCallPayload | ContractDeployPayload | STXTransferPayload;

export interface TransactionPopup {
  token: string;
  options: TransactionOptions;
}
