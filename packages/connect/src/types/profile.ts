import { UserSession } from '@stacks/auth';
import { AuthOptions } from './auth';
import { PublicPersonProfile } from '@stacks/profile';
import { ConnectNetwork } from './network';

export type ProfileUpdateFinished = (data: PublicPersonProfile) => void;
export type ProfileUpdateCanceled = () => void;

export interface ProfileUpdateBase {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  network?: ConnectNetwork;
  stxAddress?: string;
  userSession?: UserSession;
  onFinish?: ProfileUpdateFinished;
  onCancel?: ProfileUpdateCanceled;
}

export interface CommonProfileUpdatePayload extends ProfileUpdateBase {
  publicKey: string;
}

export interface ProfileUpdatePayload extends CommonProfileUpdatePayload {
  profile: PublicPersonProfile;
}

// same as ProfileUpdatePayload without publicKey
export interface ProfileUpdateRequestOptions extends ProfileUpdateBase {
  profile: PublicPersonProfile;
}

/**
 * Transaction Popup
 */
export interface ProfileUpdatePopup {
  token: string;
  options: ProfileUpdateRequestOptions;
}
