import { UserSession } from '@stacks/auth';
import { AuthOptions } from './auth';
import { PublicPersonProfile } from '@stacks/profile';
import { ConnectNetwork } from './network';

/** @deprecated Update to the latest `request` RPC methods. */
export type ProfileUpdateFinished = (data: PublicPersonProfile) => void;
/** @deprecated Update to the latest `request` RPC methods. */
export type ProfileUpdateCanceled = () => void;

/** @deprecated Update to the latest `request` RPC methods. */
export interface ProfileUpdateBase {
  appDetails?: AuthOptions['appDetails'];
  authOrigin?: string;
  network?: ConnectNetwork;
  stxAddress?: string;
  userSession?: UserSession;
  onFinish?: ProfileUpdateFinished;
  onCancel?: ProfileUpdateCanceled;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface CommonProfileUpdatePayload extends ProfileUpdateBase {
  publicKey: string;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface ProfileUpdatePayload extends CommonProfileUpdatePayload {
  profile: PublicPersonProfile;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface ProfileUpdateRequestOptions extends ProfileUpdateBase {
  profile: PublicPersonProfile;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface ProfileUpdatePopup {
  token: string;
  options: ProfileUpdateRequestOptions;
}
