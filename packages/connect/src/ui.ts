import { StxProvider, getRegisteredProviders, getSelectedProvider } from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';
import { authenticate } from './auth';
import { signMessage } from './signature';
import {
  ContractCallOptions,
  ContractDeployOptions,
  ProfileUpdateRequestOptions,
  PsbtRequestOptions,
  STXTransferOptions,
  SignatureRequestOptions,
  StacksProvider,
  TransactionOptions,
} from './types';
import type { AuthOptions } from './types/auth';

const DEFAULT_PROVIDERS: StxProvider[] = [
  {
    id: 'LeatherProvider',
    name: 'Leather Wallet',
    icon: 'data:image/png;base64,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',
    urls: {
      website: 'https://leather.io',
      iOSAppStore: 'https://apps.apple.com/us/app/blockstack-wallet/id1440635868',
    },
  },
];

export type ActionOptions = (
  | AuthOptions
  | PsbtRequestOptions
  | ProfileUpdateRequestOptions
  | SignatureRequestOptions
  | TransactionOptions
  | STXTransferOptions
  | ContractDeployOptions
  | ContractCallOptions
) & {
  defaultProviders?: StxProvider[];
}; // todo: are there more?

function buildUiAction<F extends (o: ActionOptions, p?: StacksProvider) => any>(action: F) {
  return async function wrapped(...args: [ActionOptions, StacksProvider?]) {
    const selectedProvider = args[1] || getSelectedProvider();
    if (selectedProvider) return await action(...args);

    if (typeof window === 'undefined') return;
    void defineCustomElements(window);

    const installedProviders = getRegisteredProviders();
    const defaultProviders = args[0]?.defaultProviders ?? DEFAULT_PROVIDERS;
    const filteredDefaultProviders = defaultProviders.filter(
      p => installedProviders.findIndex(i => i.id === p.id) === -1 // keep providers NOT already in installed list
    );

    const element = document.createElement('connect-modal');
    element.registeredProviders = installedProviders;
    element.defaultProviders = filteredDefaultProviders;
    element.callback = () => action(...args);

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

export const uiSignMessage = buildUiAction(signMessage);
export const showConnect = buildUiAction(authenticate);

/**
 * @deprecated Use the renamed `showConnect` method
 */
export const showBlockstackConnect = (authOptions: AuthOptions) => showConnect(authOptions);
