import { AppConfig, UserSession } from '@stacks/auth';
import { decodeToken } from 'jsontokens';
import type { AuthOptions, AuthResponsePayload, StacksProvider } from './types';

import { getStacksProvider } from './utils';

export const defaultAuthURL = 'https://app.blockstack.org';

if (typeof window !== 'undefined') {
  window.__CONNECT_VERSION__ = '__VERSION__'; // replaced via tsup esbuildOptions
}

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

/**
 * mobile should not use a 'popup' type of window.
 */
export const shouldUsePopup = () => {
  return !isMobile();
};

export const getOrCreateUserSession = (userSession?: UserSession): UserSession => {
  if (!userSession) {
    const appConfig = new AppConfig(['store_write'], document.location.href);
    userSession = new UserSession({ appConfig });
  }
  return userSession;
};

export const authenticate = async (
  authOptions: AuthOptions,
  provider: StacksProvider = getStacksProvider()
) => {
  if (!provider) throw new Error('[Connect] No installed Stacks wallet found');

  const {
    redirectTo = '/',
    manifestPath,
    onFinish,
    onCancel,
    sendToSignIn = false,
    userSession: _userSession,
    appDetails,
  } = authOptions;
  const userSession = getOrCreateUserSession(_userSession);
  if (userSession.isUserSignedIn()) {
    userSession.signUserOut();
  }
  const transitKey = userSession.generateAndStoreTransitKey();
  const authRequest = userSession.makeAuthRequest(
    transitKey,
    `${document.location.origin}${redirectTo}`,
    `${document.location.origin}${manifestPath}`,
    userSession.appConfig.scopes,
    undefined,
    undefined,
    {
      sendToSignIn,
      appDetails,
      connectVersion: '__VERSION__', // replaced via tsup esbuildOptions,
    }
  );

  try {
    const authResponse = await provider.authenticationRequest(authRequest);
    await userSession.handlePendingSignIn(authResponse);
    const token = decodeToken(authResponse);
    const payload = token?.payload;
    const authResponsePayload = payload as unknown as AuthResponsePayload;
    onFinish?.({
      authResponse,
      authResponsePayload,
      userSession,
    });
  } catch (error) {
    console.error('[Connect] Error during auth request', error);
    onCancel?.();
  }
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getUserData = async (userSession?: UserSession) => {
  userSession = getOrCreateUserSession(userSession);
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData();
  }
  if (userSession.isSignInPending()) {
    return userSession.handlePendingSignIn();
  }
  return null;
};
