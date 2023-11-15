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

/** @ignore */
export const DEFAULT_PROVIDERS: StxProvider[] = [
  {
    id: 'HiroWalletProvider',
    name: 'Leather',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iMjYuODM4NyIgZmlsbD0iIzEyMTAwRiIvPgo8cGF0aCBkPSJNNzQuOTE3MSA1Mi43MTE0QzgyLjQ3NjYgNTEuNTQwOCA5My40MDg3IDQzLjU4MDQgOTMuNDA4NyAzNy4zNzYxQzkzLjQwODcgMzUuNTAzMSA5MS44OTY4IDM0LjIxNTQgODkuNjg3MSAzNC4yMTU0Qzg1LjUwMDQgMzQuMjE1NCA3OC40MDYxIDQwLjUzNjggNzQuOTE3MSA1Mi43MTE0Wk0zOS45MTEgODMuNDk5MUMzMC4wMjU2IDgzLjQ5OTEgMjkuMjExNSA5My4zMzI0IDM5LjA5NjkgOTMuMzMyNEM0My41MTYzIDkzLjMzMjQgNDguODY2MSA5MS41NzY0IDUxLjY1NzMgODguNDE1N0M0Ny41ODY4IDg0LjkwMzggNDQuMjE0MSA4My40OTkxIDM5LjkxMSA4My40OTkxWk0xMDIuODI5IDc5LjI4NDhDMTAzLjQxIDk1Ljc5MDcgOTUuMDM2OSAxMDUuMDM5IDgwLjg0ODQgMTA1LjAzOUM3Mi40NzQ4IDEwNS4wMzkgNjguMjg4MSAxMDEuODc4IDU5LjMzMyA5Ni4wMjQ5QzU0LjY4MSAxMDEuMTc2IDQ1Ljg0MjMgMTA1LjAzOSAzOC41MTU0IDEwNS4wMzlDMTMuMjc4NSAxMDUuMDM5IDE0LjMyNTIgNzIuODQ2MyA0MC4wMjczIDcyLjg0NjNDNDUuMzc3MSA3Mi44NDYzIDQ5LjkxMjggNzQuMjUxMSA1NS43Mjc3IDc3Ljg4TDU5LjU2NTYgNjQuNDE3N0M0My43NDg5IDYwLjA4NjQgMzUuODQwNSA0Ny45MTE4IDQzLjYzMjYgMzAuNDY5M0g1Ni4xOTI5QzQ5LjIxNSA0Mi4wNTg2IDUzLjk4MzIgNTEuNjU3OCA2Mi44MjIgNTIuNzExNEM2Ny41OTAzIDM1LjczNzIgNzcuODI0NiAyMi41MDkgOTEuNDMxNiAyMi41MDlDOTkuMTA3NCAyMi41MDkgMTA1LjE1NSAyNy41NDI4IDEwNS4xNTUgMzYuNjczN0MxMDUuMTU1IDUxLjMwNjYgODYuMDgxOSA2My4yNDcxIDcxLjY2MDcgNjQuNDE3N0w2NS43Mjk1IDg1LjM3MjFDNzIuNDc0OCA5My4yMTUzIDkxLjE5OSAxMDAuODI0IDkxLjE5OSA3OS4yODQ4SDEwMi44MjlaIiBmaWxsPSIjRjVGMUVEIi8+Cjwvc3ZnPgo=',
    urls: {
      about: 'https://leather.io',
      chromeWebStore:
        'https://chrome.google.com/webstore/detail/hiro-wallet/ldinpeekobnhjjdofggfgjlcehhmanlj',
      mozillaWebStore: 'https://addons.mozilla.org/en-US/firefox/addon/hiro-wallet',
    },
  },
  {
    id: 'XverseProviders.StacksProvider',
    name: 'Xverse Wallet',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMTAuMjkyNCIgZmlsbD0iIzEyMTUxRSIvPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTExLjk0OTQgMTEuMTAxQzE2LjUxMjIgNi45NjYzMiAyMy40ODgxIDYuOTY2MzUgMjguMDUwOSAxMS4xMDFMMjYuOTg3MiAxMi4xNjQ3QzIzLjAxMzQgOC42MTQ2NiAxNi45ODcgOC42MTQ2MyAxMy4wMTMxIDEyLjE2NDZMMTEuOTQ5NCAxMS4xMDFaTTI4Ljg5OTQgMTEuOTQ5NkwyNy44MzU4IDEzLjAxMzNDMzEuMzg1NSAxNi45ODcxIDMxLjM4NTUgMjMuMDEzMyAyNy44MzU2IDI2Ljk4NzFMMjguODk5MiAyOC4wNTA4QzMzLjAzMzggMjMuNDg4MSAzMy4wMzM4IDE2LjUxMjQgMjguODk5NCAxMS45NDk2Wk0xMy4wMTMzIDI3LjgzNTdDMTYuOTg3MSAzMS4zODU1IDIzLjAxMzIgMzEuMzg1NSAyNi45ODcgMjcuODM1NkwyOC4wNTA3IDI4Ljg5OTNDMjMuNDg3OSAzMy4wMzM4IDE2LjUxMjQgMzMuMDMzOCAxMS45NDk2IDI4Ljg5OTRMMTMuMDEzMyAyNy44MzU3Wk0xMi4xNjQ3IDI2Ljk4NzJMMTEuMTAxIDI4LjA1MDlDNi45NjYzOCAyMy40ODgxIDYuOTY2MzIgMTYuNTEyNCAxMS4xMDA4IDExLjk0OTVMMTIuMTY0NSAxMy4wMTMyQzguNjE0NjMgMTYuOTg3MSA4LjYxNDY5IDIzLjAxMzQgMTIuMTY0NyAyNi45ODcyWk0yNy40Nzg2IDE0Ljk4OTZDMjcuMTU3OSAxNC41MTIxIDI2Ljc4NjQgMTQuMDU4NSAyNi4zNjQzIDEzLjYzNjRDMjMuNTY4MiAxMC44NDAyIDE5LjM4OTkgMTAuMjY4NSAxNi4wMjg2IDExLjkyMTRMMTYuNzgxOSAxMy4yMjYxQzE5LjU2NjQgMTEuOTAzMiAyMi45OTc3IDEyLjM5NDEgMjUuMzAyMiAxNC42OTg1QzI1LjYyOTMgMTUuMDI1NiAyNS45MTk4IDE1LjM3NTQgMjYuMTczOCAxNS43NDI5TDI3LjQ3ODYgMTQuOTg5NlpNMjYuNzc0NSAxNi43ODE3TDI4LjA3OTMgMTYuMDI4NEMyOS43MzIyIDE5LjM4OTggMjkuMTYwNiAyMy41NjgyIDI2LjM2NDMgMjYuMzY0NEMyNS45NDIyIDI2Ljc4NjYgMjUuNDg4NSAyNy4xNTggMjUuMDEwOCAyNy40Nzg4TDI0LjI1NzYgMjYuMTc0MUMyNC42MjUxIDI1LjkyIDI0Ljk3NSAyNS42Mjk0IDI1LjMwMjIgMjUuMzAyMkMyNy42MDY3IDIyLjk5NzcgMjguMDk3NSAxOS41NjYyIDI2Ljc3NDUgMTYuNzgxN1pNMjMuMjE4NyAyNi43NzQ3QzIwLjQzNDIgMjguMDk3NSAxNy4wMDI5IDI3LjYwNjYgMTQuNjk4NSAyNS4zMDIyQzE0LjM3MTIgMjQuOTc0OSAxNC4wODA1IDI0LjYyNDkgMTMuODI2NCAyNC4yNTczTDEyLjUyMTcgMjUuMDEwNkMxMi44NDI1IDI1LjQ4ODMgMTMuMjE0IDI1Ljk0MjEgMTMuNjM2MyAyNi4zNjQ0QzE2LjQzMjUgMjkuMTYwNSAyMC42MTA3IDI5LjczMjIgMjMuOTcyIDI4LjA3OTRMMjMuMjE4NyAyNi43NzQ3Wk0xMS45MjExIDIzLjk3MTdMMTMuMjI1OCAyMy4yMTg0QzExLjkwMzMgMjAuNDM0IDEyLjM5NDIgMTcuMDAyOSAxNC42OTg1IDE0LjY5ODVDMTUuMDI1NyAxNC4zNzE0IDE1LjM3NTUgMTQuMDgwOCAxNS43NDMgMTMuODI2N0wxNC45ODk3IDEyLjUyMkMxNC41MTIxIDEyLjg0MjggMTQuMDU4NSAxMy4yMTQyIDEzLjYzNjMgMTMuNjM2NEMxMC44NDAzIDE2LjQzMjQgMTAuMjY4NSAyMC42MTA0IDExLjkyMTEgMjMuOTcxN1pNMjQuMjQyOCAxNS43NTc0QzI1LjEyODcgMTYuNjQzMyAyNS42Nzk3IDE3LjczNzMgMjUuODk1NyAxOC44ODIxTDI0LjM4OTIgMTkuMDEzOUMyNC4yMDkzIDE4LjIwOTcgMjMuODA2NCAxNy40NDU0IDIzLjE4MDYgMTYuODE5NUMyMi4zNTU2IDE1Ljk5NDUgMjEuMjg5NyAxNS41NTY5IDIwLjIwOTIgMTUuNTA3TDIwLjA3NzQgMTQuMDAwNUMyMS41ODcxIDE0LjAxOTggMjMuMDkwOSAxNC42MDU0IDI0LjI0MjggMTUuNzU3NFpNMTguODgyIDE0LjEwNDVDMTcuNzM3MyAxNC4zMjA2IDE2LjY0MzMgMTQuODcxNSAxNS43NTc1IDE1Ljc1NzRDMTQuNjA1NiAxNi45MDkyIDE0LjAyIDE4LjQxMjkgMTQuMDAwNiAxOS45MjI1TDE1LjUwNzEgMTkuNzkwN0MxNS41NTcxIDE4LjcxMDMgMTUuOTk0NiAxNy42NDQ2IDE2LjgxOTYgMTYuODE5NUMxNy40NDU0IDE2LjE5MzggMTguMjA5NyAxNS43OTA5IDE5LjAxMzggMTUuNjExTDE4Ljg4MiAxNC4xMDQ1Wk0xNC4xMDQ2IDIxLjExOEMxNC4zMjA2IDIyLjI2MjggMTQuODcxNSAyMy4zNTY4IDE1Ljc1NzUgMjQuMjQyN0MxNi45MDkzIDI1LjM5NDYgMTguNDEzIDI1Ljk4MDIgMTkuOTIyNiAyNS45OTk2TDE5Ljc5MDcgMjQuNDkzMUMxOC43MTA0IDI0LjQ0MyAxNy42NDQ2IDI0LjAwNTUgMTYuODE5NiAyMy4xODA1QzE2LjE5MzggMjIuNTU0NyAxNS43OTEgMjEuNzkwNCAxNS42MTExIDIwLjk4NjJMMTQuMTA0NiAyMS4xMThaTTI0LjI0MjggMjQuMjQyN0MyMy4zNTY5IDI1LjEyODYgMjIuMjYyOCAyNS42Nzk2IDIxLjExOCAyNS44OTU2TDIwLjk4NjIgMjQuMzg5MUMyMS43OTA0IDI0LjIwOTIgMjIuNTU0OCAyMy44MDY0IDIzLjE4MDYgMjMuMTgwNUMyNC4wMDU2IDIyLjM1NTUgMjQuNDQzMiAyMS4yODk3IDI0LjQ5MzIgMjAuMjA5NEwyNS45OTk3IDIwLjA3NzZDMjUuOTgwMyAyMS41ODcyIDI1LjM5NDcgMjMuMDkwOCAyNC4yNDI4IDI0LjI0MjdaIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfNTA1Nl8yNDIzNjgpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNTA1Nl8yNDIzNjgiIHgxPSIxMS41NjgxIiB5MT0iMjguNTY5MSIgeDI9IjMyLjc2NjkiIHkyPSI3LjM3MDMzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiM1NTY1RjciLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjOUVBN0ZBIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
    urls: {
      about: 'https://www.xverse.app',
      chromeWebStore:
        'https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg',
      androidAppStore: 'https://play.google.com/store/apps/details?id=com.secretkeylabs.xverse',
      iOSAppStore: 'https://apps.apple.com/app/xverse-bitcoin-web3-wallet/id1552272513',
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
