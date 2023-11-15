// AUTO REGISTERED PROVIDERS

export interface StxProvider {
  /** The global "path" of the provider (e.g. `"MyProvider"` if registered at `window.MyProvider`) */
  id: string;
  /** The name of the provider, as displayed to the user */
  name: string;
  /** The data URL of an image to show (e.g. `data:image/png;base64,iVBORw0...`) @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs */
  icon?: string;
  /** Different web URLs of the provider */
  urls?: {
    website?: string;
    chromeWebStore?: string;
    mozillaWebStore?: string;
    androidAppStore?: string;
    iOSAppStore?: string;
  };
}

declare global {
  interface Window {
    webbtc_stx_providers?: any; // replace 'any' with the actual type if known
  }
}

export const getRegisteredProviders = () => {
  if (typeof window === 'undefined') return [];
  if (!window.webbtc_stx_providers) return [];

  return window.webbtc_stx_providers as StxProvider[];
};
