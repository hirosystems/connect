// AUTO REGISTERED PROVIDERS

export interface WebBTCProvider {
  /** The global "path" of the provider (e.g. `"MyProvider"` if registered at `window.MyProvider`) */
  id: string;
  /** The name of the provider, as displayed to the user */
  name: string;
  /** The data URL of an image to show (e.g. `data:image/png;base64,iVBORw0...`) @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs */
  icon?: string;
  /** Web URL of the provider */
  webUrl?: string;

  chromeWebStoreUrl?: string;
  mozillaAddOnsUrl?: string;
  googlePlayStoreUrl?: string;
  iOSAppStoreUrl?: string;
}

declare global {
  interface Window {
    /**
     * @experimental @beta
     * An experimental global registry of providers that can be used by the UI to display a list of providers to the user.
     * Wallets can add their provider to this list without needing to update `@stacks/connect` itself.
     * This is an experimental API and may change in the future.
     * This will be used as a test-run before switching to `webbtc` and WBIP004.
     * The provider objects are WBIP004 compliant.
     * It may happen that no wallet implements this feature before `@stacks/connect` switches to `webbtc`.
     */
    webbtc_stx_providers?: WebBTCProvider[];
  }
}

export const getRegisteredProviders = () => {
  if (typeof window === 'undefined') return [];
  if (!window.webbtc_stx_providers) return [];

  return window.webbtc_stx_providers;
};

export const getInstalledProviders = (defaultProviders: WebBTCProvider[] = []) => {
  if (typeof window === 'undefined') return [];

  const registeredProviders = getRegisteredProviders();

  const additionalInstalledProviders = defaultProviders.filter(defaultProvider => {
    // already registered, don't add again
    if (registeredProviders.find(rp => rp.id === defaultProvider.id)) return false;

    // check if default provider is installed (even if not registered)
    const provider = getProviderFromId(defaultProvider.id);
    return !!provider;
  });

  return registeredProviders.concat(additionalInstalledProviders);
};

export const getProviderFromId = (id: string | undefined) => {
  return id?.split('.').reduce((acc, part) => acc?.[part], window);
};
