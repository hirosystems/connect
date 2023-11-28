import {
  WebBTCProvider,
  clearSelectedProvider,
  getInstalledProviders,
  getSelectedProvider,
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

export const DEFAULT_PROVIDERS: WebBTCProvider[] = [
  {
    id: 'LeatherProvider',
    name: 'Leather',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=',

    webUrl: 'https://leather.io',
    chromeWebStoreUrl:
      'https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
    mozillaAddOnsUrl: 'https://addons.mozilla.org/en-US/firefox/addon/hiro-wallet',
    googlePlayStoreUrl: 'https://play.google.com/store/apps/details?id=io.hiro.wallet',
    iOSAppStoreUrl: 'https://apps.apple.com/app/hiro-wallet/id1492380872',
  },
  {
    id: 'XverseProviders.StacksProvider',
    name: 'Xverse Wallet',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMxNzE3MTciIGQ9Ik0wIDBoNjAwdjYwMEgweiIvPjxwYXRoIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTQ0MCA0MzUuNHYtNTFjMC0yLS44LTMuOS0yLjItNS4zTDIyMCAxNjIuMmE3LjYgNy42IDAgMCAwLTUuNC0yLjJoLTUxLjFjLTIuNSAwLTQuNiAyLTQuNiA0LjZ2NDcuM2MwIDIgLjggNCAyLjIgNS40bDc4LjIgNzcuOGE0LjYgNC42IDAgMCAxIDAgNi41bC03OSA3OC43Yy0xIC45LTEuNCAyLTEuNCAzLjJ2NTJjMCAyLjQgMiA0LjUgNC42IDQuNUgyNDljMi42IDAgNC42LTIgNC42LTQuNlY0MDVjMC0xLjIuNS0yLjQgMS40LTMuM2w0Mi40LTQyLjJhNC42IDQuNiAwIDAgMSA2LjQgMGw3OC43IDc4LjRhNy42IDcuNiAwIDAgMCA1LjQgMi4yaDQ3LjVjMi41IDAgNC42LTIgNC42LTQuNloiLz48cGF0aCBmaWxsPSIjRUU3QTMwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0zMjUuNiAyMjcuMmg0Mi44YzIuNiAwIDQuNiAyLjEgNC42IDQuNnY0Mi42YzAgNCA1IDYuMSA4IDMuMmw1OC43LTU4LjVjLjgtLjggMS4zLTIgMS4zLTMuMnYtNTEuMmMwLTIuNi0yLTQuNi00LjYtNC42TDM4NCAxNjBjLTEuMiAwLTIuNC41LTMuMyAxLjNsLTU4LjQgNTguMWE0LjYgNC42IDAgMCAwIDMuMiA3LjhaIi8+PC9nPjwvc3ZnPg==',

    webUrl: 'https://www.xverse.app',
    chromeWebStoreUrl:
      'https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg',
    googlePlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse',
    iOSAppStoreUrl: 'https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513',
  },
];

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

function wrapConnectCall<O extends ActionOptions>(action: (o: O, p?: StacksProvider) => any) {
  return function wrapped(o: O, p?: StacksProvider) {
    const selectedProvider = p || getSelectedProvider();
    if (selectedProvider) return action(o, p);

    if (typeof window === 'undefined') return;
    void defineCustomElements(window);

    const defaultProviders = o?.defaultProviders ?? DEFAULT_PROVIDERS;
    const installedProviders = getInstalledProviders(defaultProviders);

    const element = document.createElement('connect-modal');
    element.defaultProviders = defaultProviders;
    element.installedProviders = installedProviders;
    element.callback = () => action(o, p);

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
export const showConnect = wrapConnectCall(authenticate);

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

/** Disconnect selected wallet. Alias for {@link clearSelectedProvider} */
export const disconnect = clearSelectedProvider();
