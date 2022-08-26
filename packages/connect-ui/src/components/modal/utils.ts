export const isChrome = () => {
  const isChromium = !!window['chrome'];
  const winNav = window.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof (window as any).opr !== 'undefined';
  const isIEedge = winNav.userAgent.includes('Edge');
  const isIOSChrome = /CriOS/.exec(winNav.userAgent);
  const isMobile = winNav.userAgent.includes('Mobile');

  if (isIOSChrome) {
    return false;
  } else if (
    isChromium !== null &&
    typeof isChromium !== 'undefined' &&
    vendorName === 'Google Inc.' &&
    isOpera === false &&
    isIEedge === false &&
    isMobile === false
  ) {
    return true;
  } else {
    return false;
  }
};

type Browser = 'Chrome' | 'Firefox';

export const getBrowser = (): Browser | null => {
  if (isChrome()) {
    return 'Chrome';
  } else if (window.navigator.userAgent.includes('Firefox')) {
    return 'Firefox';
  }
  return null;
};

type Platform = 'Android' | 'IOS';

export const getPlatform = (): Platform | null => {
  if (!window.navigator.userAgent.includes('Mobile')) return null;
  if (window.navigator.userAgent.includes('iPhone')) {
    return 'IOS';
  } else return 'Android';
};
