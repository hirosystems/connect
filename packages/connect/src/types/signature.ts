import type { AuthOptions } from '../types/auth';
import { StacksNetwork } from '@stacks/network';
import { UserSession } from '@stacks/auth';

type Finished = (data: SignatureData) => void;
type Canceled = () => void;

export interface SignatureRequestOptions {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  message: string;
  network?: StacksNetwork;
  stxAddress?: string;
  userSession?: UserSession;
  onFinish?: Finished;
  onCancel?: Canceled;
}

export interface SignatureOptions {
  message: string;
  onFinish?: Finished;
  onCancel?: Canceled;
}

export interface SignaturePopup {
  token: string;
  options: SignatureOptions;
}

export interface SignaturePayload {
  message: string;
  publicKey: string;
  /**
   * Provide the Hiro Wallet with a suggested account to sign this transaction with.
   * This is set by default if a `userSession` option is provided.
   */
  stxAddress?: string;
  appDetails?: AuthOptions['appDetails'];
  network?: StacksNetwork;
}

export interface SignatureData {
  /* Hex encoded DER signature */
  signature: string;
  /* Hex encoded private string taken from privateKey */
  publicKey: string;
}
