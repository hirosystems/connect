import { UserSession } from '../auth';
import { AuthOptions } from './auth';
import { ConnectNetwork } from './network';

// Taken from @scure/btc-signer
// https://github.com/paulmillr/scure-btc-signer
export enum SignatureHash {
  DEFAULT = 0,
  ALL = 1,
  NONE = 2,
  SINGLE = 3,
  ANYONECANPAY = 0x80,
}

export interface PsbtData {
  hex: string;
}

export type PsbtCanceled = (error?: Error) => void;
export type PsbtFinished = (data: PsbtData) => void;

export interface PsbtBase {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  network?: ConnectNetwork;
  onCancel?: PsbtCanceled;
  onFinish?: PsbtFinished;
  stxAddress?: string;
  userSession?: UserSession;
}

export interface PsbtRequestOptions extends PsbtBase {
  allowedSighash?: SignatureHash[];
  hex: string;
  signAtIndex?: number | number[];
}

export interface CommonPsbtPayload extends PsbtBase {
  publicKey: string;
}

export interface PsbtPayload extends CommonPsbtPayload {
  allowedSighash?: SignatureHash[];
  hex: string;
  signAtIndex?: number | number[];
}

/**
 * Psbt Popup
 */
export interface PsbtPopup {
  token: string;
  options: PsbtRequestOptions;
}
