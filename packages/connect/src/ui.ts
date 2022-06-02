import { authenticate } from './auth';
import type { AuthOptions } from './types/auth';
import { defineCustomElements } from '@stacks/connect-ui/loader';
import { ConnectModal } from '@stacks/connect-ui/dist/components/connect-modal';
import { getStacksProvider } from './utils';

export const showConnect = (authOptions: AuthOptions) => {
  if (getStacksProvider()) {
    void authenticate(authOptions);
    return;
  }
  if (typeof window !== undefined) {
    void defineCustomElements(window);
    const element = document.createElement('connect-modal');
    element.authOptions = authOptions;
    document.body.appendChild(element);
    const handleEsc = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        document.removeEventListener('keydown', handleEsc);
        element.remove();
      }
    };
    document.addEventListener('keydown', handleEsc);
  }
};

export const showConnectStatic = (authOptions: AuthOptions) => {
  if (getStacksProvider()) {
    void authenticate(authOptions);
    return;
  }

  if (typeof window?.customElements?.define === 'function') {
    // supports custom elements
    if (customElements.get('connect-modal') === undefined) {
      // avoid repeat defines
      customElements.define('connect-modal', ConnectModal);
    }
    const element = document.createElement('connect-modal');
    element.authOptions = authOptions;
    document.body.appendChild(element);
    const handleEsc = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') {
        document.removeEventListener('keydown', handleEsc);
        element.remove();
      }
    };
    document.addEventListener('keydown', handleEsc);
  }
};

/**
 * @deprecated Use the renamed `showConnect` method
 */
export const showBlockstackConnect = (authOptions: AuthOptions) => showConnect(authOptions);
