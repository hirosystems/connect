import { UserSession } from '@stacks/auth';
import { StacksNetwork } from '@stacks/network';
import type { AuthOptions } from '../types/auth';

export type SignatureFinished = (data: SignatureData) => void;
export type SignatureCanceled = () => void;

export interface CommonSignatureRequestOptions {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  network?: StacksNetwork;
  stxAddress?: string;
  userSession?: UserSession;
  onFinish?: SignatureFinished;
  onCancel?: SignatureCanceled;
}

export interface SignatureRequestOptions extends CommonSignatureRequestOptions {
  message: string;
}

export interface SignatureOptions {
  message: string;
  onFinish?: SignatureFinished;
  onCancel?: SignatureCanceled;
}

export interface SignaturePopup {
  token: string;
  options: SignatureOptions;
}

export interface SignaturePayload extends CommonSignaturePayload {
  message: string;
}

export interface SignatureData {
  /* Hex encoded DER signature */
  signature: string;
  /* Hex encoded private string taken from privateKey */
  publicKey: string;
}

export interface CommonSignaturePayload {
  publicKey: string;
  /**
   * Provide the Hiro Wallet with a suggested account to sign this transaction with.
   * This is set by default if a `userSession` option is provided.
   */
  stxAddress?: string;
  appDetails?: AuthOptions['appDetails'];
  network?: StacksNetwork;
}
