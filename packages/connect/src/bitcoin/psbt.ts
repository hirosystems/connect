import { createUnsecuredToken, Json, TokenSigner } from 'jsontokens';
import { getKeys, getUserSession, hasAppPrivateKey } from '../transactions';
import { StacksProvider } from '../types';
import {
  PsbtData,
  PsbtPayload,
  PsbtPopup,
  PsbtRequestOptions,
  SignatureHash,
} from '../types/bitcoin';
import { getStacksProvider, legacyNetworkFromConnectNetwork } from '../utils';
import { requestRawLegacy } from '../request';
import { MethodParams, MethodResult, SigHash, SignPsbtResult } from '../methods';

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export function getDefaultPsbtRequestOptions(_options: PsbtRequestOptions) {}

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export const makePsbtToken = async (_options: PsbtRequestOptions) => {};

const METHOD = 'signPsbt' as const;

/** @internal */
export const LEGACY_SIGN_PSBT_OPTIONS_MAP = (
  options: PsbtRequestOptions
): MethodParams<typeof METHOD> => {
  return {
    psbt: options.hex,
    signInputs:
      typeof options.signAtIndex === 'number' ? [options.signAtIndex] : options.signAtIndex,
    allowedSigHash: options.allowedSighash?.map(hash => SignatureHash[hash] as SigHash),
  };
};

/** @internal */
export const LEGACY_SIGN_PSBT_RESPONSE_MAP = (response: MethodResult<typeof METHOD>): PsbtData => ({
  hex: response.psbt,
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
