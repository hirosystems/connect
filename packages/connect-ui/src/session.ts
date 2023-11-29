const LOCAL_STORAGE_KEY = 'STX_PROVIDER';

export const getSelectedProviderId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(LOCAL_STORAGE_KEY);
};

export const setSelectedProviderId = (provider: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, provider);
  }
};

export const clearSelectedProviderId = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};
