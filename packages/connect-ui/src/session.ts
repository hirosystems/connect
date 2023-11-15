const LOCAL_STORAGE_KEY = 'STX_PROVIDER';

export const getSelectedProvider = (): string => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(LOCAL_STORAGE_KEY);
};

export const setSelectedProvider = (provider: string) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, provider);
  }
};

export const clearSelectedProvider = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
};
