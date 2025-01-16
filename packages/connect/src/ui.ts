import { clearSelectedProviderId } from '@stacks/connect-ui';
import { LEGACY_GET_ADDRESSES_OPTIONS_MAP, LEGACY_GET_ADDRESSES_RESPONSE_MAP } from './auth';
import { MethodParams, MethodResult, Methods } from './methods';
import { LEGACY_UPDATE_PROFILE_OPTIONS_MAP, LEGACY_UPDATE_PROFILE_RESPONSE_MAP } from './profile';
import { ConnectRequestOptions, request } from './request';
import { LEGACY_SIGN_MESSAGE_OPTIONS_MAP, LEGACY_SIGN_MESSAGE_RESPONSE_MAP } from './signature';
import {
  LEGACY_SIGN_STRUCTURED_MESSAGE_OPTIONS_MAP,
  LEGACY_SIGN_STRUCTURED_MESSAGE_RESPONSE_MAP,
} from './signature/structuredData';
import {
  LEGACY_CALL_CONTRACT_OPTIONS_MAP,
  LEGACY_CALL_CONTRACT_RESPONSE_MAP,
  LEGACY_DEPLOY_CONTRACT_OPTIONS_MAP,
  LEGACY_DEPLOY_CONTRACT_RESPONSE_MAP,
  LEGACY_SIGN_TRANSACTION_OPTIONS_MAP,
  LEGACY_SIGN_TRANSACTION_RESPONSE_MAP,
  LEGACY_TRANSFER_STX_OPTIONS_MAP,
  LEGACY_TRANSFER_STX_RESPONSE_MAP,
} from './transactions';
import { StacksProvider } from './types';

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
  M extends keyof Methods,
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
export const showConnect = requestLegacy(
  'stx_getAddresses',
  LEGACY_GET_ADDRESSES_OPTIONS_MAP,
  LEGACY_GET_ADDRESSES_RESPONSE_MAP
);

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openSTXTransfer} action. */
export const showSTXTransfer = requestLegacy(
  'stx_transferStx',
  LEGACY_TRANSFER_STX_OPTIONS_MAP,
  LEGACY_TRANSFER_STX_RESPONSE_MAP
);

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openContractCall} action. */
export const showContractCall = requestLegacy(
  'stx_callContract',
  LEGACY_CALL_CONTRACT_OPTIONS_MAP,
  LEGACY_CALL_CONTRACT_RESPONSE_MAP
);

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openContractDeploy} action. */
export const showContractDeploy = requestLegacy(
  'stx_deployContract',
  LEGACY_DEPLOY_CONTRACT_OPTIONS_MAP,
  LEGACY_DEPLOY_CONTRACT_RESPONSE_MAP
);

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openSignTransaction} action. */
export const showSignTransaction = requestLegacy(
  'stx_signTransaction',
  LEGACY_SIGN_TRANSACTION_OPTIONS_MAP,
  LEGACY_SIGN_TRANSACTION_RESPONSE_MAP
);

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openProfileUpdateRequestPopup} action. */
export const showProfileUpdate = requestLegacy(
  'stx_updateProfile',
  LEGACY_UPDATE_PROFILE_OPTIONS_MAP,
  LEGACY_UPDATE_PROFILE_RESPONSE_MAP
);

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
