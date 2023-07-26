import { UserSession } from '@stacks/auth';
import { StacksNetwork } from '@stacks/network';

import { AuthOptions } from './auth';

/**
 * ALL           -- all inputs, all outputs
 * NONE          -- all inputs, no outputs
 * SINGLE        -- all inputs, one output of the same index
 * ALL + ANYONE  -- one input, all outputs
 * NONE + ANYONE -- one input, no outputs
 * SINGLE        -- one inputs, one output of the same index
 */
export enum SignatureHash {
  ALL = 0x01,
  NONE = 0x02,
  SINGLE = 0x03,
  ALL_ANYONECANPAY = 0x81,
  NONE_ANYONECANPAY = 0x82,
  SINGLE_ANYONECANPAY = 0x83,
}

export interface PsbtData {
  hex: string;
}

export type PsbtCanceled = () => void;
export type PsbtFinished = (data: PsbtData) => void;

export interface PsbtBase {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  network?: StacksNetwork;
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
