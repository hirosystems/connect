import { clearSelectedProviderId } from '@stacks/connect-ui';
import { ConnectRequestOptions, request } from './request';
import { Methods, MethodParams, MethodResult } from './methods';
import { StacksProvider } from './types';
import {
  LEGACY_SIGN_STRUCTURED_MESSAGE_OPTIONS_MAP,
  LEGACY_SIGN_STRUCTURED_MESSAGE_RESPONSE_MAP,
} from './signature/structuredData';
import { LEGACY_SIGN_MESSAGE_OPTIONS_MAP, LEGACY_SIGN_MESSAGE_RESPONSE_MAP } from './signature';

// /** @internal */
// function requestShowLegacy<M extends Methods>(
//   method: M,
//   options: ConnectRequestOptions = {
//     forceSelection: true,
//   }
// ) {
//   return (params?: MethodParams<M>): Promise<MethodResult<M>> => request(options, method, params);
// }

/**
 * **Note:** Higher order function!
 * @internal Legacy UI request.
 */
function requestLegacy<
  M extends Methods,
  O extends {
    onCancel?: () => void;
    onFinish?: (response: R) => void;
  },
  R,
>(
  method: M,
  mapOptions: (options: O) => MethodParams<M>,
  mapResponse: (response: MethodResult<M>) => R,
  uiOptions: ConnectRequestOptions = {
    forceSelection: true,
  }
) {
  return (options: O, provider?: StacksProvider) => {
    if (!provider) throw new Error('[Connect] No installed Stacks wallet found');

    const params = mapOptions(options);

    void request(uiOptions, method, params)
      .then(response => {
        const r = mapResponse(response);
        options.onFinish?.(r);
      })
      .catch(options.onCancel);
  };
}

// BACKWARDS COMPATIBILITY

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link authenticate} action. */
export const showConnect = requestShowLegacy('stx_getAddresses');

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openSTXTransfer} action. */
export const showSTXTransfer = requestShowLegacy('stx_transferStx');

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openContractCall} action. */
export const showContractCall = requestShowLegacy('stx_callContract');

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openContractDeploy} action. */
export const showContractDeploy = requestShowLegacy('stx_deployContract');

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openSignTransaction} action. */
export const showSignTransaction = requestShowLegacy('stx_signTransaction');

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openProfileUpdateRequestPopup} action. */
export const showProfileUpdate = requestShowLegacy('stx_updateProfile');

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openSignatureRequestPopup} action. */
export const showSignMessage = requestLegacy(
  'stx_signMessage',
  LEGACY_SIGN_MESSAGE_OPTIONS_MAP,
  LEGACY_SIGN_MESSAGE_RESPONSE_MAP
);

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openStructuredDataSignatureRequestPopup} action. */
export const showSignStructuredMessage = requestLegacy(
  'stx_signStructuredMessage',
  LEGACY_SIGN_STRUCTURED_MESSAGE_OPTIONS_MAP,
  LEGACY_SIGN_STRUCTURED_MESSAGE_RESPONSE_MAP
);

/** Disconnect selected wallet. Alias for {@link clearSelectedProviderId} */
export const disconnect = clearSelectedProviderId;

/**
 * @deprecated Use the renamed {@link showConnect} method
 */
export const showBlockstackConnect = showConnect;
