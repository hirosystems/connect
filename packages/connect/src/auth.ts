/** @deprecated Not used anymore. */
export const defaultAuthURL = 'https://app.blockstack.org';

if (typeof window !== 'undefined') {
  window.__CONNECT_VERSION__ = '__VERSION__'; // replaced via tsup esbuildOptions
}

/** @deprecated Will be marked as internal going forward. */
export const isMobile = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) {
    return true;
  }
  if (/iPad|iPhone|iPod/.test(ua)) {
    return true;
  }
  return /windows phone/i.test(ua);
};
