import { base64 } from '@scure/base';
import { bytesToHex } from '@stacks/common';
import { getInstalledProviders, getProvider, WbipProvider } from '@stacks/connect-ui';
import { defineCustomElements } from '@stacks/connect-ui/loader';
import { Cl, PostCondition, postConditionToHex } from '@stacks/transactions';
import { JsonRpcError, JsonRpcErrorCode } from './errors';
import {
  MethodParams,
  MethodParamsRaw,
  MethodResult,
  MethodResultRaw,
  Methods,
  MethodsRaw,
  SendTransferParams,
} from './methods';
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

export async function requestRaw<M extends keyof MethodsRaw>(
  provider: StacksProvider,
  method: M,
  params?: MethodParamsRaw<M>
): Promise<MethodResultRaw<M>> {
  try {
    const response = await provider.request(method, params);
    if ('error' in response) throw JsonRpcError.fromResponse(response.error);

    return response.result;
  } catch (error) {
    if (error instanceof JsonRpcError) throw error;
    if ('jsonrpc' in error) throw JsonRpcError.fromResponse(error.error);

    const code = error.code ?? JsonRpcErrorCode.UnknownError;
    throw new JsonRpcError(error.message, code, error.data, error);
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
    const { method: finalMethod, params: finalParams } = getMethodOverrides(
      opts.provider,
      method,
      params,
      opts.enableOverrides
    );
    return await requestRaw(opts.provider, finalMethod as any, serializeParams(finalParams));
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

      const { method: finalMethod, params: finalParams } = getMethodOverrides(
        selectedProvider,
        method,
        params,
        opts.enableOverrides
      );

      resolve(requestRaw(selectedProvider, finalMethod as any, serializeParams(finalParams)));
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
      onCancel?: (error?: Error) => void;
      onFinish?: (response: R) => void;
    };

    const { method: finalMethod, params: finalParams } = getMethodOverrides(
      provider,
      method,
      params
    );

    void requestRaw(provider, finalMethod as any, serializeParams(finalParams))
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

function isXverseLike(provider: StacksProvider): boolean {
  return isXverse(provider) || isFordefi(provider);
}

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

function isLeather(provider: StacksProvider): boolean {
  return 'isLeather' in provider && !!provider.isLeather;
}

function shallowDefined<T extends object>(obj: T): Partial<T> {
  if (obj === undefined) return {};
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) result[key as keyof T] = value;
  }
  return result;
}

function getMethodOverrides<M extends keyof Methods>(
  provider: StacksProvider,
  method: M,
  params?: MethodParams<M>,
  enableOverrides: boolean = true
): { method: string; params: any } {
  if (!enableOverrides) return { method, params };

  // Xverse-ish wallets
  if (
    isXverseLike(provider) &&
    // Permission granting method
    ['getAddresses', 'stx_getAddresses'].includes(method)
  ) {
    return { method: 'wallet_connect', params };
  }

  // Xverse-ish `sendTransfer`
  if (isXverseLike(provider) && method === 'sendTransfer') {
    const paramsXverse = {
      ...params,
      recipients: (params as SendTransferParams).recipients.map(r => ({
        ...r,
        amount: Number(r.amount), // Xverse expects amount as number
      })),
    };
    return { method, params: paramsXverse };
  }

  // Leather `sendTransfer`
  if (isLeather(provider) && method === 'sendTransfer') {
    const paramsLeather = {
      ...params,
      recipients: (params as SendTransferParams).recipients.map(r => ({
        ...r,
        amount: r.amount.toString(), // Leather expects amount as string
      })),
    };
    return { method, params: paramsLeather };
  }

  // Leather `signPsbt`
  if (isLeather(provider) && method === 'signPsbt') {
    const paramsLeather = {
      hex: bytesToHex(base64.decode((params as MethodParams<'signPsbt'>).psbt)),
      signAtIndex: (params as MethodParams<'signPsbt'>).signInputs.map(i => {
        if (typeof i === 'number') return i;
        return i.index;
      }),
      allowedSighash: (params as MethodParams<'signPsbt'>).allowedSighash,
    };
    return { method, params: paramsLeather };
  }

  return { method, params };
}

const POST_CONDITIONS = [
  'stx-postcondition',
  'ft-postcondition',
  'nft-postcondition',
] satisfies PostCondition['type'][];

/**
 * @internal
 * Simple function for serializing clarity object values to hex strings, in case wallets don't support them.
 */
export function serializeParams<M extends keyof Methods>(params: MethodParams<M>): MethodParams<M> {
  if (!params || typeof params !== 'object') return params;

  const result = { ...params };

  for (const [key, value] of Object.entries(params)) {
    // Handle bigint values
    if (typeof value === 'bigint') {
      result[key] = value.toString();
      continue;
    }

    // Keep original value, don't override
    if (!value) continue;

    // Handle array of things
    if (Array.isArray(value)) {
      result[key] = value.map(item => {
        if (typeof item === 'bigint') return item.toString();
        if (!item || typeof item !== 'object' || !('type' in item)) return item;
        if (POST_CONDITIONS.includes(item.type)) return postConditionToHex(item);
        return Cl.serialize(item);
      });
      continue;
    }

    // Handle things
    if (typeof value === 'object' && 'type' in value) {
      result[key] = POST_CONDITIONS.includes(value.type)
        ? // Post condition
          postConditionToHex(value)
        : // Clarity value
          Cl.serialize(value);
    }
  }

  return result;
}
