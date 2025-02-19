import { base64 } from '@scure/base';
import { bytesToHex, hexToBytes } from '@stacks/common';
import { MethodParams, MethodResult, Sighash } from '../methods';
import { requestRawLegacy } from '../request';
import { StacksProvider } from '../types';
import { PsbtData, PsbtRequestOptions, SignatureHash } from '../types/bitcoin';
import { getStacksProvider } from '../utils';

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export function getDefaultPsbtRequestOptions(_options: PsbtRequestOptions) {}

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export const makePsbtToken = async (_options: PsbtRequestOptions) => {};

const METHOD = 'signPsbt' as const;

/** @internal */
export const LEGACY_SIGN_PSBT_OPTIONS_MAP = (
  options: PsbtRequestOptions
): MethodParams<typeof METHOD> => ({
  psbt: base64.encode(hexToBytes(options.hex)),
  signInputs: typeof options.signAtIndex === 'number' ? [options.signAtIndex] : options.signAtIndex,
  allowedSighash: options.allowedSighash?.map(hash => SignatureHash[hash] as Sighash),
});

/** @internal */
export const LEGACY_SIGN_PSBT_RESPONSE_MAP = (response: MethodResult<typeof METHOD>): PsbtData => ({
  hex: bytesToHex(base64.decode(response.psbt)),
});

/**
 * @experimental
 * Compatible interface with previous Connect `openPsbtRequestPopup` version, but using new SIP-030 RPC method.
 */
export function openPsbtRequestPopup(
  options: PsbtRequestOptions,
  provider: StacksProvider = getStacksProvider()
) {
  requestRawLegacy(
    METHOD,
    LEGACY_SIGN_PSBT_OPTIONS_MAP,
    LEGACY_SIGN_PSBT_RESPONSE_MAP
  )(options, provider);
}
