import { getInstalledProviders, getProvider, WebBTCProvider } from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';
import { ConnectCanceledError } from './errors';
import { MethodParams, MethodResult, Methods } from './methods';
import { DEFAULT_PROVIDERS } from './providers';
import { StacksProvider } from './types';

export interface ConnectRequestOptions {
  /**
   * The default wallets to display in the modal.
   * Defaults to some known popular wallets.
   */
  defaultProviders?: WebBTCProvider[];

  /**
   * The provider to use for the request.
   * If none is provided the UI will be shown.
   * Defaults to the previously selected provider (unless `forceWalletSelect` is `true`).
   */
  provider?: StacksProvider;

  /**
   * Forces the user to select a wallet.
   * Defaults to `false`.
   */
  forceWalletSelect?: boolean;

  /**
   * Persist the selected wallet across requests.
   * Defaults to `true`.
   */
  persistWalletSelect?: boolean;

  /**
   * Adds manual request rewriting to make different providers behave more closely to SIP-030 / WBIPs.
   * Defaults to `true`.
   */
  enableOverrides?: boolean;

  // todo: maybe add callbacks, if set use them instead of throwing errors
}

export async function requestRaw<M extends keyof Methods>(
  provider: StacksProvider,
  method: M,
  params?: MethodParams<M>
): Promise<MethodResult<M>> {
  // eslint-disable-next-line prefer-rest-params
  console.log('requestRaw', arguments); // todo: remove
  try {
    const response = await provider.request(method, params);
    // if (response.error) {
    //   // todo: add typed error handling (before merge)
    //   throw new Error(response.error.message);
    // }
    console.log('requestRaw response', response);
    return response.result;
  } catch (error) {
    console.error('requestRaw error', error);
    // todo: parse or something
    throw error;
  }
}

export async function request<M extends keyof Methods>(
  method: M,
  params?: MethodParams<M>
): Promise<MethodResult<M>>;
export async function request<M extends keyof Methods>(
  options: ConnectRequestOptions,
  method: M,
  params?: MethodParams<M>
): Promise<MethodResult<M>>;
export async function request<M extends keyof Methods>(
  ...args:
    | [method: M, params?: MethodParams<M>]
    | [options: ConnectRequestOptions, method: M, params?: MethodParams<M>]
): Promise<MethodResult<M>> {
  const { options, method, params } = requestArgs(args);

  // Default options
  const opts = Object.assign(
    {
      defaultProviders: DEFAULT_PROVIDERS,
      provider: getProvider(),

      forceWalletSelect: false,
      persistWalletSelect: true,
      enableOverrides: true,
    },
    options
  );

  // WITHOUT UI
  if (opts.provider && !opts.forceWalletSelect) {
    return await requestRaw(opts.provider, method, params);
  }

  // WITH UI
  if (typeof window === 'undefined') return undefined; // don't throw for SSR contexts

  void defineCustomElements(window);

  return new Promise((resolve, reject) => {
    const element = document.createElement('connect-modal');
    element.defaultProviders = opts.defaultProviders;
    element.installedProviders = getInstalledProviders(opts.defaultProviders);
    element.persistSelection = opts.persistWalletSelect;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
      element.remove();
      document.body.style.overflow = originalOverflow;
    };

    element.callback = (selectedProvider: StacksProvider | undefined) => {
      closeModal();

      // =======================================================================
      // OVERRIDES
      // We may need to maintain some overrides to make different providers semi-compatible.

      // Xverse
      if (
        opts.enableOverrides &&
        isXverse(selectedProvider) &&
        // Permission granting method
        ['getAddresses', 'stx_getAddresses', 'stx_getAccounts'].includes(method)
      ) {
        return resolve(requestRaw(selectedProvider, 'wallet_connect' as any, params)); // Use unknown 'wallet_connect' instead.
      }
      // =======================================================================

      resolve(requestRaw(selectedProvider, method, params));
    };

    element.cancelCallback = () => {
      closeModal();
      reject(new ConnectCanceledError());
    };

    document.body.appendChild(element);

    const handleEsc = (ev: KeyboardEvent) => {
      if (ev.key !== 'Escape') return;
      document.removeEventListener('keydown', handleEsc);
      element.remove();
      reject(new ConnectCanceledError());
    };
    document.addEventListener('keydown', handleEsc);
  });
}

/** @internal */
function requestArgs<M extends keyof Methods>(
  args:
    | [method: M, params?: MethodParams<M>]
    | [options: ConnectRequestOptions, method: M, params?: MethodParams<M>]
): {
  method: M;
  params?: MethodParams<M>;
  options?: ConnectRequestOptions;
} {
  if (typeof args[0] === 'string') return { method: args[0], params: args[1] as MethodParams<M> };
  return { options: args[0], method: args[1] as M, params: args[2] };
}

/**
 * **Note:** Higher order function!
 * @internal Legacy non-UI request.
 */
export function requestRawLegacy<M extends keyof Methods, O, R>(
  method: M,
  mapOptions: (options: O) => MethodParams<M>,
  mapResponse: (response: MethodResult<M>) => R
) {
  return (options: O, provider?: StacksProvider) => {
    if (!provider) throw new Error('[Connect] No installed Stacks wallet found');

    const params = mapOptions(options);

    // Manual cast, since TypeScipt can't infer generic type of options
    const o = options as {
      onCancel?: () => void;
      onFinish?: (response: R) => void;
    };

    void requestRaw(provider, method, params)
      .then(response => {
        const r = mapResponse(response);
        o.onFinish?.(r);
      })
      .catch(o.onCancel);
  };
}

// todo: strip params that might be unserializable or privacy sensitive, e.g.
// appDetails?: AuthOptions['appDetails'];
// authOrigin?: string;
// network?: ConnectNetwork;
// stxAddress?: string;
// userSession?: UserSession;
// onFinish?: ProfileUpdateFinished;
// onCancel?: ProfileUpdateCanceled;

function isXverse(provider: StacksProvider) {
  return (
    // Best effort detection for Xverse
    'signMultipleTransactions' in provider &&
    'createRepeatInscriptions' in provider &&
    !provider?.['isLeather']
  );
}
