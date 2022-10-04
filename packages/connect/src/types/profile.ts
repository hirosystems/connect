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

export interface CommonProfileUpdateRequestOptions extends ProfileUpdateBase {}

export interface CommoneProfileUpdatePayload {
  publicKey: string;
}

export interface PersonProfileUpdatePayload extends CommoneProfileUpdatePayload {
  profile: Person;
}

export interface PersonProfileUpdateRequestOptions extends ProfileUpdateBase {
  profile: Person;
}

export type ProfileUpdatePayload = PersonProfileUpdatePayload;
export type ProfileUpdateRequestOptions = PersonProfileUpdateRequestOptions;

/**
 * Transaction Popup
 */

export interface ProfileUpdatePopup {
  token: string;
  options: ProfileUpdateRequestOptions;
}
