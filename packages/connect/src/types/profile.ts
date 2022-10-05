import { UserSession } from '@stacks/auth';
import { StacksNetwork } from '@stacks/network';
import { AuthOptions } from './auth';
import { Person, Profile } from '@stacks/profile';

export type ProfileUpdateFinished = (data: Profile) => void;
export type ProfileUpdateCanceled = () => void;

export interface ProfileUpdateBase {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  network?: StacksNetwork;
  stxAddress?: string;
  userSession?: UserSession;
  onFinish?: ProfileUpdateFinished;
  onCancel?: ProfileUpdateCanceled;
}

export interface CommonProfileUpdatePayload extends ProfileUpdateBase {
  publicKey: string;
}

export interface ProfileUpdatePayload extends CommonProfileUpdatePayload {
  profile: Person;
}

export interface ProfileUpdateRequestOptions extends ProfileUpdateBase {
  profile: Person;
}

/**
 * Transaction Popup
 */

export interface ProfileUpdatePopup {
  token: string;
  options: ProfileUpdateRequestOptions;
}
