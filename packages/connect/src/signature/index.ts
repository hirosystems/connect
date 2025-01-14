import { MethodParams, MethodResult } from '../methods';
import { requestRawLegacy } from '../request';
import { StacksProvider } from '../types';
import { CommonSignatureRequestOptions, SignatureRequestOptions } from '../types/signature';
import { getStacksProvider } from '../utils';

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export function getDefaultSignatureRequestOptions(_options: CommonSignatureRequestOptions) {}

export interface SignatureRequestPayload {
  message: string;
}

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export const signMessage = async (_options: SignatureRequestOptions) => {};

const METHOD = 'stx_signMessage' as const;

/** @internal */
export const LEGACY_SIGN_MESSAGE_OPTIONS_MAP = (
  options: SignatureRequestOptions
): MethodParams<typeof METHOD> => options;

/** @internal */
export const LEGACY_SIGN_MESSAGE_RESPONSE_MAP = (response: MethodResult<typeof METHOD>) => response;

export function openSignatureRequestPopup(
  options: SignatureRequestOptions,
  provider: StacksProvider = getStacksProvider()
) {
  requestRawLegacy(
    METHOD,
    LEGACY_SIGN_MESSAGE_OPTIONS_MAP,
    LEGACY_SIGN_MESSAGE_RESPONSE_MAP
  )(options, provider);
}
