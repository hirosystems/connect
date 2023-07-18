import { bytesToHex } from '@stacks/common';
import { serializeCV } from '@stacks/transactions';
import { createUnsecuredToken, TokenSigner } from 'jsontokens';
import { getDefaultSignatureRequestOptions } from '.';
import { getKeys, hasAppPrivateKey } from '../transactions';
import {
  StructuredDataSignatureOptions,
  StructuredDataSignaturePayload,
  StructuredDataSignaturePopup,
  StructuredDataSignatureRequestOptions,
} from '../types/structuredDataSignature';
import { getStacksProvider } from '../utils';
import { StacksProvider } from '../types';

async function generateTokenAndOpenPopup<T extends StructuredDataSignatureOptions>(
  options: T,
  makeTokenFn: (options: T) => Promise<string>,
  provider: StacksProvider
) {
  const token = await makeTokenFn({
    ...getDefaultSignatureRequestOptions(options),
    ...options,
  } as T);
  return openStructuredDataSignaturePopup({ token, options }, provider);
}

function parseUnserializableBigIntValues(payload: any) {
  return {
    ...payload,
    message: bytesToHex(serializeCV(payload.message)),
    domain: bytesToHex(serializeCV(payload.domain)),
  };
}

// eslint-disable-next-line @typescript-eslint/require-await
async function signPayload(payload: StructuredDataSignaturePayload, privateKey: string) {
  const tokenSigner = new TokenSigner('ES256k', privateKey);
  return tokenSigner.signAsync(parseUnserializableBigIntValues(payload));
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function signStructuredMessage(options: StructuredDataSignatureRequestOptions) {
  const { userSession, ..._options } = options;
  if (hasAppPrivateKey(userSession)) {
    const { privateKey, publicKey } = getKeys(userSession);
    const payload: StructuredDataSignaturePayload = {
      ..._options,
      publicKey,
    };
    return signPayload(payload, privateKey);
  }
  // Type casting `any` as payload contains non-serialisable content,
  // such as `StacksNetwork`
  return createUnsecuredToken(parseUnserializableBigIntValues(options));
}

async function openStructuredDataSignaturePopup(
  { token, options }: StructuredDataSignaturePopup,
  provider: StacksProvider
) {
  try {
    const signatureResponse = await provider.structuredDataSignatureRequest(token);

    options.onFinish?.(signatureResponse);
  } catch (error) {
    console.error('[Connect] Error during signature request', error);
    options.onCancel?.();
  }
}

export function openStructuredDataSignatureRequestPopup(
  options: StructuredDataSignatureRequestOptions,
  provider: StacksProvider = getStacksProvider()
) {
  if (!provider) throw new Error('[Connect] No installed Stacks wallet found');
  return generateTokenAndOpenPopup(options, signStructuredMessage, provider);
}
