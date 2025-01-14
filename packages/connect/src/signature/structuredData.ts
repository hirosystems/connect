import { TupleCV } from '@stacks/transactions';
import { ClarityType as LegacyClarityType } from '@stacks/transactions-v6';
import { MethodParams, MethodResult } from '../methods';
import { requestRawLegacy } from '../request';
import { StacksProvider } from '../types';
import { StructuredDataSignatureRequestOptions } from '../types/structuredDataSignature';
import { getStacksProvider, legacyCVToCV } from '../utils';

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export async function signStructuredMessage(_options: StructuredDataSignatureRequestOptions) {}

const METHOD = 'stx_signStructuredMessage' as const;

/** @internal */
export const LEGACY_SIGN_STRUCTURED_MESSAGE_OPTIONS_MAP = (
  options: StructuredDataSignatureRequestOptions
): MethodParams<typeof METHOD> => ({
  // todo: also make sure that cvs don't have bigint unserializable values
  message: legacyCVToCV(options.message),
  domain: legacyCVToCV(options.domain) as TupleCV, // safe cast, because of below check
});

/** @internal */
export const LEGACY_SIGN_STRUCTURED_MESSAGE_RESPONSE_MAP = (
  response: MethodResult<typeof METHOD>
) => response;

/** Compatible interface with previous Connect `openStructuredDataSignatureRequestPopup` version, but using new SIP-030 RPC method. */
export function openStructuredDataSignatureRequestPopup(
  options: StructuredDataSignatureRequestOptions,
  provider: StacksProvider = getStacksProvider()
): void {
  if (options.domain.type !== LegacyClarityType.Tuple) {
    throw new Error('Domain must be a tuple'); // check, ensures domain is a tuple
  }

  requestRawLegacy(
    METHOD,
    LEGACY_SIGN_STRUCTURED_MESSAGE_OPTIONS_MAP,
    LEGACY_SIGN_STRUCTURED_MESSAGE_RESPONSE_MAP
  )(options, provider);
}
