import { UserSession } from '@stacks/auth';
import { StacksNetwork } from '@stacks/network';
import { AuthOptions } from './auth';
import { Person, Profile } from '@stacks/profile';

export type ProfileUpdaterFinished = (data: Profile) => void;
export type ProfileUpdaterCanceled = () => void;

export interface ProfileUpdaterBase {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  network?: StacksNetwork;
  stxAddress?: string;
  userSession?: UserSession;
  onFinish?: ProfileUpdaterFinished;
  onCancel?: ProfileUpdaterCanceled;
}

export interface CommonProfileUpdaterRequestOptions extends ProfileUpdaterBase {}

export interface CommoneProfileUpdaterPayload {
  publicKey: string;
}

export interface PersonProfileUpdaterPayload extends CommoneProfileUpdaterPayload {
  profile: Person;
}

export interface PersonProfileUpdaterRequestOptions extends ProfileUpdaterBase {
  profile: Person;
}

export type ProfileUpdaterPayload = PersonProfileUpdaterPayload;
export type ProfileUpdaterRequestOptions = PersonProfileUpdaterRequestOptions;

/**
 * Transaction Popup
 */

export interface ProfileUpdaterPopup {
  token: string;
  options: ProfileUpdaterRequestOptions;
}
