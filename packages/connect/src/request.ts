import {
  getProvider,
  WebBTCProvider,
  getInstalledProviders,
  getSelectedProviderId,
} from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';
import { StacksProvider } from './types';
import { DEFAULT_PROVIDERS } from './providers';
import { ConnectCanceledError } from './errors';
import { Methods, MethodParams, MethodResult } from './methods';

export interface ConnectRequestOptions {
  defaultProviders?: WebBTCProvider[];
  provider?: StacksProvider;
  persistSelection?: boolean;
  forceSelection?: boolean;

  disableOverrides?: boolean;

  // todo: maybe add callbacks, if set use them instead of throwing errors
}

export async function requestRaw<M extends keyof Methods>(
  provider: StacksProvider,
  method: M,
  params?: MethodParams<M>
): Promise<MethodResult<M>> {
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

  const opts = Object.assign(
    {
      defaultProviders: DEFAULT_PROVIDERS,
      persistSelection: true,
      forceSelection: false,
      provider: getProvider(),
      disableOverrides: false,
    },
    options
  );

  // WITHOUT UI
  if (opts.provider && !opts.forceSelection) return await requestRaw(opts.provider, method, params);

  // WITH UI
  if (typeof window === 'undefined') return undefined; // don't throw for SSR contexts

  void defineCustomElements(window);

  return new Promise((resolve, reject) => {
    const element = document.createElement('connect-modal');
    element.defaultProviders = opts.defaultProviders;
    element.installedProviders = getInstalledProviders(opts.defaultProviders);
    element.persistSelection = opts.persistSelection;

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
        !opts.disableOverrides &&
        // Best effort detection for Xverse
        'signMultipleTransactions' in selectedProvider &&
        'createRepeatInscriptions' in selectedProvider &&
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

// /** @internal */
// export function requestOpenLegacy<M extends Methods>(
//   provider: StacksProvider,
//   method: M,
//   params: MethodParams<M>,
//   hooks: {
//     onFinish: (response: JsonRpcResponse<M>) => void;
//     onCancel: () => void;
//   }
// ) {
//   if (!provider) throw new Error('[Connect] No installed Stacks wallet found');
//   provider.request(method, params).then(hooks.onFinish).catch(hooks.onCancel);
// }

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
