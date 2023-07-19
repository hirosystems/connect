import { StacksTestnet } from '@stacks/network';
import { createUnsecuredToken, Json, TokenSigner } from 'jsontokens';

import { getKeys, getUserSession, hasAppPrivateKey } from '../transactions';
import { PsbtPayload, PsbtPopup, PsbtRequestOptions } from '../types/bitcoin';
import { getStacksProvider } from '../utils';
import { StacksProvider } from '../types';

// eslint-disable-next-line @typescript-eslint/require-await
async function signPayload(payload: PsbtPayload, privateKey: string) {
  const tokenSigner = new TokenSigner('ES256k', privateKey);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return tokenSigner.signAsync({ ...payload } as any);
}

export function getDefaultPsbtRequestOptions(options: PsbtRequestOptions) {
  const network = options.network || new StacksTestnet();
  const userSession = getUserSession(options.userSession);
  const defaults: PsbtRequestOptions = {
    ...options,
    network,
    userSession,
  };
  return {
    ...defaults,
  };
}

async function openPsbtPopup({ token, options }: PsbtPopup, provider: StacksProvider) {
  if (!provider) throw new Error('[Connect] No installed Stacks wallet found');

  try {
    const psbtResponse = await provider.psbtRequest(token);
    options.onFinish?.(psbtResponse);
  } catch (error) {
    console.error('[Connect] Error during psbt request', error);
    options.onCancel?.();
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export const makePsbtToken = async (options: PsbtRequestOptions) => {
  const { allowedSighash, hex, signAtIndex, userSession, ..._options } = options;
  if (hasAppPrivateKey(userSession)) {
    const { privateKey, publicKey } = getKeys(userSession);

    const payload: PsbtPayload = {
      ..._options,
      allowedSighash,
      hex,
      signAtIndex,
      publicKey,
    };

    return signPayload(payload, privateKey);
  }
  const payload = { ..._options };
  return createUnsecuredToken(payload as Json);
};

async function generateTokenAndOpenPopup<T extends PsbtRequestOptions>(
  options: T,
  makeTokenFn: (options: T) => Promise<string>,
  provider: StacksProvider
) {
  const token = await makeTokenFn({
    ...getDefaultPsbtRequestOptions(options),
    ...options,
  } as T);
  return openPsbtPopup({ token, options }, provider);
}

/**
 * @experimental
 */
export function openPsbtRequestPopup(
  options: PsbtRequestOptions,
  provider: StacksProvider = getStacksProvider()
) {
  return generateTokenAndOpenPopup(options, makePsbtToken, provider);
}
