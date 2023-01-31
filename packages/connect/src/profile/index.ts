import { StacksTestnet } from '@stacks/network';
import { createUnsecuredToken, Json, TokenSigner } from 'jsontokens';
import { getKeys, getUserSession, hasAppPrivateKey } from '../transactions';
import { ProfileUpdatePayload, ProfileUpdatePopup, ProfileUpdateRequestOptions } from '../types';

import { getStacksProvider } from '../utils';

async function signPayload(payload: ProfileUpdatePayload, privateKey: string) {
  const tokenSigner = new TokenSigner('ES256k', privateKey);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return tokenSigner.signAsync({ ...payload } as any);
}

export function getDefaultProfileUpdateRequestOptions(options: ProfileUpdateRequestOptions) {
  const network = options.network || new StacksTestnet();
  const userSession = getUserSession(options.userSession);
  const defaults: ProfileUpdateRequestOptions = {
    ...options,
    network,
    userSession,
  };
  return {
    ...defaults,
  };
}

async function openProfileUpdatePopup({ token, options }: ProfileUpdatePopup) {
  const provider = getStacksProvider();
  if (!provider) {
    throw new Error('Hiro Wallet not installed.');
  }

  try {
    const profileUpdateResponse = await provider.profileUpdateRequest(token);
    options.onFinish?.(profileUpdateResponse);
  } catch (error) {
    console.error('[Connect] Error during signature request', error);
    options.onCancel?.();
  }
}

export const makeProfileUpdateToken = async (options: ProfileUpdateRequestOptions) => {
  const { userSession, profile, ..._options } = options;
  if (hasAppPrivateKey(userSession)) {
    const { privateKey, publicKey } = getKeys(userSession);

    const payload: ProfileUpdatePayload = {
      ..._options,
      profile,
      publicKey,
    };

    return signPayload(payload, privateKey);
  }
  const payload = { ..._options };
  return createUnsecuredToken(payload as Json);
};

async function generateTokenAndOpenPopup<T extends ProfileUpdateRequestOptions>(
  options: T,
  makeTokenFn: (options: T) => Promise<string>
) {
  const token = await makeTokenFn({
    ...getDefaultProfileUpdateRequestOptions(options),
    ...options,
  } as T);
  return openProfileUpdatePopup({ token, options });
}

export function openProfileUpdateRequestPopup(options: ProfileUpdateRequestOptions) {
  return generateTokenAndOpenPopup(options, makeProfileUpdateToken);
}
