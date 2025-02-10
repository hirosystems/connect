import { UserSession } from '../auth';
import type { AuthOptions } from '../types/auth';
import { ConnectNetwork } from './network';

/** @deprecated Update to the latest `request` RPC methods. */
export type SignatureFinished = (data: SignatureData) => void;
/** @deprecated Update to the latest `request` RPC methods. */
export type SignatureCanceled = (error?: Error) => void;

/** @deprecated Update to the latest `request` RPC methods. */
export interface CommonSignatureRequestOptions {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  network?: ConnectNetwork;
  stxAddress?: string;
  userSession?: UserSession;
  onFinish?: SignatureFinished;
  onCancel?: SignatureCanceled;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface SignatureRequestOptions extends CommonSignatureRequestOptions {
  message: string; // todo: check before merge if we only sign strings or also clarity values.
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface SignatureOptions {
  message: string;
  onFinish?: SignatureFinished;
  onCancel?: SignatureCanceled;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface SignaturePopup {
  token: string;
  options: SignatureOptions;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface SignaturePayload extends CommonSignaturePayload {
  message: string;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface SignatureData {
  /* Hex encoded DER signature */
  signature: string;
  /* Hex encoded private string taken from privateKey */
  publicKey: string;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface CommonSignaturePayload {
  publicKey: string;
  /**
   * Provide the Hiro Wallet with a suggested account to sign this transaction with.
   * This is set by default if a `userSession` option is provided.
   */
  stxAddress?: string;
  appDetails?: AuthOptions['appDetails'];
  network?: ConnectNetwork;
}
