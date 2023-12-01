import { getSelectedProviderId } from '@stacks/connect-ui';

export function getStacksProvider() {
  const providerId = getSelectedProviderId();
  const provider = providerId?.split('.').reduce((acc, part) => acc?.[part], window);

  return provider || window.StacksProvider || window.BlockstackProvider;
}

export function isStacksWalletInstalled() {
  return !!getStacksProvider();
}
