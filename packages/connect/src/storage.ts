import { bytesToHex, bytesToUtf8, hexToBytes, utf8ToBytes } from '@stacks/common';
import { clearSelectedProviderId } from '@stacks/connect-ui';
import { UserSession } from './auth';
import { AddressEntry } from './methods';

export const LOCAL_STORAGE_KEY = '@stacks/connect';

export interface StorageData {
  addresses: {
    stx: Omit<AddressEntry, 'publicKey'>[];
    btc: Omit<AddressEntry, 'publicKey'>[];
  };
  updatedAt?: number;
  version: string;
}

/** @internal */
const INITIAL_STORAGE: StorageData = {
  addresses: {
    stx: [],
    btc: [],
  },
  version: '0.0.1',
};

/**
 * @internal Helper to deduplicate address entries and strip sensitive data
 */
export const normalizeAddresses = (
  addresses: AddressEntry[]
): Omit<AddressEntry, 'publicKey'>[] => {
  const deduped = [...new Map(addresses.map(a => [a.address, a])).values()];
  return deduped.map(({ publicKey, ...rest }) => rest);
};

/**
 * @internal Helper to safely store data in localStorage
 */
export function setLocalStorageData(data: {
  addresses?: { stx?: AddressEntry[]; btc?: AddressEntry[] };
}) {
  try {
    const existing = getLocalStorage();
    const current: StorageData = existing || INITIAL_STORAGE;

    const updated = {
      ...current,
      updatedAt: Date.now(),
      addresses: {
        ...current.addresses,
        ...(data.addresses && {
          stx:
            data.addresses.stx &&
            normalizeAddresses([
              ...(current.addresses.stx as AddressEntry[]),
              ...data.addresses.stx,
            ]),
          btc:
            data.addresses.btc &&
            normalizeAddresses([
              ...(current.addresses.btc as AddressEntry[]),
              ...data.addresses.btc,
            ]),
        }),
      },
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, bytesToHex(utf8ToBytes(JSON.stringify(updated))));
  } catch (error) {
    console.warn('Failed to store data in localStorage:', error);
  }
}

/**
 * Clears all stored connect data from localStorage
 */
export function clearLocalStorage() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}

/**
 * Gets the current connect data from localStorage
 */
export function getLocalStorage(): StorageData | null {
  try {
    const hex = localStorage.getItem(LOCAL_STORAGE_KEY);
    return hex ? JSON.parse(bytesToUtf8(hexToBytes(hex))) : null;
  } catch (error) {
    console.warn('Failed to get data from localStorage:', error);
    return null;
  }
}

/** Disconnect selected wallet, clear session data and potentially clear local storage. */
export function disconnect() {
  clearSelectedProviderId();
  clearLocalStorage();
  new UserSession().store.deleteSessionData();
}

/**
 * Checks if the user is connected.
 * Aka has successfully connected to a wallet and received an address.
 * This requires the {@link request} method to have been called with `enableLocalStorage: true`.
 */
export function isConnected(): boolean {
  const storage = getLocalStorage();
  return storage?.addresses.stx.length > 0 || storage?.addresses.btc.length > 0;
}
