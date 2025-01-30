import { getInstalledProviders, getProvider, WbipProvider } from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';
import { JsonRpcError, JsonRpcErrorCode } from './errors';
import { MethodParams, MethodResult, Methods } from './methods';
import { DEFAULT_PROVIDERS } from './providers';
import { StacksProvider } from './types';

export interface ConnectRequestOptions {
  /**
   * The provider to use for the request.
   * If none is provided the UI will be shown.
   * Defaults to the previously selected provider (unless `forceWalletSelect` is `true`).
   */
  provider?: StacksProvider;

  /**
   * The default wallets to display in the modal.
   * Defaults to some known popular wallets.
   */
  defaultProviders?: WbipProvider[];

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
  try {
    const response = await provider.request(method, params);
    if ('error' in response) throw JsonRpcError.fromResponse(response.error);

    return response.result;
  } catch (error) {
    const code = error.code ?? JsonRpcErrorCode.UnknownError;
    throw new JsonRpcError(error.message, code, error.data, error.cause);
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
      provider: getProvider(),
      defaultProviders: DEFAULT_PROVIDERS,

      forceWalletSelect: false,
      persistWalletSelect: true,
      enableOverrides: true,
    },
    shallowDefined(options)
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
    element.persistWalletSelect = opts.persistWalletSelect;

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

      // Xverse-ish wallets
      if (
        opts.enableOverrides &&
        (isXverse(selectedProvider) || isFordefi(selectedProvider)) &&
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
      reject(new JsonRpcError('User canceled the request', JsonRpcErrorCode.UserCanceled));
    };

    document.body.appendChild(element);

    const handleEsc = (ev: KeyboardEvent) => {
      if (ev.key !== 'Escape') return;
      document.removeEventListener('keydown', handleEsc);
      element.remove();
      reject(new JsonRpcError('User canceled the request', JsonRpcErrorCode.UserCanceled));
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

function isXverse(provider: StacksProvider): boolean {
  return (
    // Best effort detection for Xverse
    'signMultipleTransactions' in provider &&
    'createRepeatInscriptions' in provider &&
    !provider?.['isLeather'] &&
    !provider?.['isFordefi']
  );
}

function isFordefi(provider: StacksProvider): boolean {
  return 'isFordefi' in provider && !!provider.isFordefi;
}

function shallowDefined<T extends object>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) result[key as keyof T] = value;
  }
  return result;
}
