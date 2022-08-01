import { StacksTestnet } from '@stacks/network';
import { ChainID } from '@stacks/transactions';
import { createUnsecuredToken, TokenSigner } from 'jsontokens';
import { getKeys, getUserSession, hasAppPrivateKey } from '../transactions';
import {
  CommonSignatureRequestOptions,
  SignatureOptions,
  SignaturePayload,
  SignaturePopup,
  SignatureRequestOptions,
} from '../types/signature';
import { getStacksProvider } from '../utils';

function getStxAddress(options: CommonSignatureRequestOptions) {
  const { userSession, network } = options;

  if (!userSession || !network) return undefined;
  const stxAddresses = userSession?.loadUserData().profile?.stxAddress;
  const chainIdToKey = {
    [ChainID.Mainnet]: 'mainnet',
    [ChainID.Testnet]: 'testnet',
  };
  const address: string | undefined = stxAddresses?.[chainIdToKey[network.chainId]];
  return address;
}

async function signPayload(payload: SignaturePayload, privateKey: string) {
  const tokenSigner = new TokenSigner('ES256k', privateKey);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return tokenSigner.signAsync({ ...payload } as any);
}

export function getDefaultSignatureRequestOptions(options: CommonSignatureRequestOptions) {
  const network = options.network || new StacksTestnet();
  const userSession = getUserSession(options.userSession);
  const defaults: CommonSignatureRequestOptions = {
    ...options,
    network,
    userSession,
  };
  return {
    stxAddress: getStxAddress(defaults),
    ...defaults,
  };
}

async function openSignaturePopup({ token, options }: SignaturePopup) {
  const provider = getStacksProvider();
  if (!provider) {
    throw new Error('Hiro Wallet not installed.');
  }

  try {
    const signatureResponse = await provider.signatureRequest(token);
    options.onFinish?.(signatureResponse);
  } catch (error) {
    console.error('[Connect] Error during signature request', error);
    options.onCancel?.();
  }
}

export interface SignatureRequestPayload {
  message: string;
}

export const signMessage = async (options: SignatureRequestOptions) => {
  const { userSession, ..._options } = options;
  if (hasAppPrivateKey(userSession)) {
    const { privateKey, publicKey } = getKeys(userSession);

    const payload: SignaturePayload = {
      ..._options,
      publicKey,
    };

    return signPayload(payload, privateKey);
  }
  const payload = { ..._options };
  return createUnsecuredToken(payload as any);
};

async function generateTokenAndOpenPopup<T extends SignatureOptions>(
  options: T,
  makeTokenFn: (options: T) => Promise<string>
) {
  const token = await makeTokenFn({
    ...getDefaultSignatureRequestOptions(options),
    ...options,
  } as T);
  return openSignaturePopup({ token, options });
}

export function openSignatureRequestPopup(options: SignatureRequestOptions) {
  return generateTokenAndOpenPopup(options, signMessage);
}
