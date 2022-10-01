import { StacksTestnet } from '@stacks/network';
import { createUnsecuredToken, TokenSigner } from 'jsontokens';
import {
  ProfileUpdaterPayload,
  ProfileUpdaterPopup,
  ProfileUpdaterRequestOptions,
} from 'src/types/profileUpdater';
import { getKeys, getUserSession, hasAppPrivateKey } from '../transactions';

import { getStacksProvider } from '../utils';

async function signPayload(payload: ProfileUpdaterPayload, privateKey: string) {
  const tokenSigner = new TokenSigner('ES256k', privateKey);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return tokenSigner.signAsync({ ...payload } as any);
}

export function getDefaultProfileUpdaterRequestOptions(options: ProfileUpdaterRequestOptions) {
  const network = options.network || new StacksTestnet();
  const userSession = getUserSession(options.userSession);
  const defaults: ProfileUpdaterRequestOptions = {
    ...options,
    network,
    userSession,
  };
  return {
    ...defaults,
  };
}

async function openProfileUpdaterPopup({ token, options }: ProfileUpdaterPopup) {
  const provider = getStacksProvider();
  if (!provider) {
    throw new Error('Hiro Wallet not installed.');
  }

  try {
    const profileUpdaterResponse = await provider.profileUpdaterRequest(token);
    options.onFinish?.(profileUpdaterResponse);
  } catch (error) {
    console.error('[Connect] Error during signature request', error);
    options.onCancel?.();
  }
}

export interface ProfileUpdaterRequestPayload {
  profile: string;
}

export const makeProfileUpdateToken = async (options: ProfileUpdaterRequestOptions) => {
  const { userSession, profile, ..._options } = options;
  if (hasAppPrivateKey(userSession)) {
    const { privateKey, publicKey } = getKeys(userSession);

    const payload: ProfileUpdaterPayload = {
      profile,
      publicKey,
    };

    return signPayload(payload, privateKey);
  }
  const payload = { ..._options };
  return createUnsecuredToken(payload as any);
};

async function generateTokenAndOpenPopup<T extends ProfileUpdaterRequestOptions>(
  options: T,
  makeTokenFn: (options: T) => Promise<string>
) {
  const token = await makeTokenFn({
    ...getDefaultProfileUpdaterRequestOptions(options),
    ...options,
  } as T);
  return openProfileUpdaterPopup({ token, options });
}

export function openProfileUpdaterRequestPopup(options: ProfileUpdaterRequestOptions) {
  return generateTokenAndOpenPopup(options, makeProfileUpdateToken);
}
