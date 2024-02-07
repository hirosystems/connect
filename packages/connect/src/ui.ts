import {
  WebBTCProvider,
  clearSelectedProviderId,
  getInstalledProviders,
  getSelectedProviderId,
} from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';
import { authenticate } from './auth';
import { openPsbtRequestPopup } from './bitcoin';
import { openProfileUpdateRequestPopup } from './profile';
import { openSignatureRequestPopup } from './signature';
import { openStructuredDataSignatureRequestPopup } from './signature/structuredData';
import {
  openContractCall,
  openContractDeploy,
  openSTXTransfer,
  openSignTransaction,
} from './transactions';
import {
  ContractCallOptions,
  ContractDeployOptions,
  ProfileUpdateRequestOptions,
  PsbtRequestOptions,
  STXTransferOptions,
  SignatureRequestOptions,
  StacksProvider,
  StructuredDataSignatureRequestOptions,
  TransactionOptions,
} from './types';
import type { AuthOptions } from './types/auth';
import { getStacksProvider } from './utils';
import { DEFAULT_PROVIDERS } from './providers';

export type ActionOptions = (
  | AuthOptions
  | STXTransferOptions
  | ContractCallOptions
  | ContractDeployOptions
  | TransactionOptions
  | PsbtRequestOptions
  | ProfileUpdateRequestOptions
  | SignatureRequestOptions
  | StructuredDataSignatureRequestOptions
) & {
  defaultProviders?: WebBTCProvider[];
};

/** Helper higher-order function for creating connect methods that allow for wallet selection */
function wrapConnectCall<O extends ActionOptions>(
  action: (options: O, provider?: StacksProvider) => any,
  persistSelection = true
) {
  return function wrapped(options: O, provider?: StacksProvider) {
    if (provider) return action(options, provider); // if a provider is passed, use it

    const selectedId = getSelectedProviderId();
    const selectedProvider = getStacksProvider();
    if (selectedId && selectedProvider) return action(options, selectedProvider); // if a provider is selected, use it

    if (typeof window === 'undefined') return;
    void defineCustomElements(window);

    const defaultProviders = options?.defaultProviders ?? DEFAULT_PROVIDERS;
    const installedProviders = getInstalledProviders(defaultProviders);

    const element = document.createElement('connect-modal');
    element.defaultProviders = defaultProviders;
    element.installedProviders = installedProviders;
    element.persistSelection = persistSelection;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
      element.remove();
      document.body.style.overflow = originalOverflow;
    };

    element.callback = (selectedProvider: StacksProvider | undefined) => {
      closeModal();
      action(options, selectedProvider);
    };
    element.cancelCallback = () => {
      closeModal();
      options.onCancel?.();
    };

    document.body.appendChild(element);

    const handleEsc = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        document.removeEventListener('keydown', handleEsc);
        element.remove();
      }
    };
    document.addEventListener('keydown', handleEsc);
  };
}

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link authenticate} action. */
export const showConnect = wrapConnectCall(authenticate, false);

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openSTXTransfer} action. */
export const showSTXTransfer = wrapConnectCall(openSTXTransfer);
/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openContractCall} action. */
export const showContractCall = wrapConnectCall(openContractCall);
/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openContractDeploy} action. */
export const showContractDeploy = wrapConnectCall(openContractDeploy);
/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openSignTransaction} action. */
export const showSignTransaction = wrapConnectCall(openSignTransaction);

/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openPsbtRequestPopup} action. */
export const showPsbt = wrapConnectCall(openPsbtRequestPopup);
/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openProfileUpdateRequestPopup} action. */
export const showProfileUpdate = wrapConnectCall(openProfileUpdateRequestPopup);
/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openSignatureRequestPopup} action. */
export const showSignMessage = wrapConnectCall(openSignatureRequestPopup);
/** A wrapper for selecting a wallet (if none is selected) and then calling the {@link openStructuredDataSignatureRequestPopup} action. */
export const showSignStructuredMessage = wrapConnectCall(openStructuredDataSignatureRequestPopup);

/** Disconnect selected wallet. Alias for {@link clearSelectedProviderId} */
export const disconnect = clearSelectedProviderId;

/**
 * @deprecated Use the renamed {@link showConnect} method
 */
export const showBlockstackConnect = showConnect;
