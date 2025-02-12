import { PublicPersonProfile } from '@stacks/profile';
import { MethodParams, MethodResult } from '../methods';
import { requestRawLegacy } from '../request';
import { ProfileUpdateRequestOptions, StacksProvider } from '../types';
import { getStacksProvider } from '../utils';

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export function getDefaultProfileUpdateRequestOptions(_options: ProfileUpdateRequestOptions) {}

/** @deprecated No-op. Tokens are not needed for latest RPC endpoints. */
export const makeProfileUpdateToken = async (_options: ProfileUpdateRequestOptions) => {};

const METHOD = 'stx_updateProfile' as const;

/** @internal */
export const LEGACY_UPDATE_PROFILE_OPTIONS_MAP = (
  options: ProfileUpdateRequestOptions
): MethodParams<typeof METHOD> => options;

/** @internal */
export const LEGACY_UPDATE_PROFILE_RESPONSE_MAP = (
  response: MethodResult<typeof METHOD>
): PublicPersonProfile => response.profile as PublicPersonProfile;

/** Compatible interface with previous Connect `openProfileUpdateRequestPopup` version, but using new SIP-030 RPC method. */
export function openProfileUpdateRequestPopup(
  options: ProfileUpdateRequestOptions,
  provider: StacksProvider = getStacksProvider()
) {
  requestRawLegacy(
    METHOD,
    LEGACY_UPDATE_PROFILE_OPTIONS_MAP,
    LEGACY_UPDATE_PROFILE_RESPONSE_MAP
  )(options, provider);
}
