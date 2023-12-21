import { getSelectedProviderId, getProviderFromId } from '@stacks/connect-ui';

export function getStacksProvider() {
  const provider = getProviderFromId(getSelectedProviderId());
  return provider || window.StacksProvider || window.BlockstackProvider;
}

export function isStacksWalletInstalled() {
  return !!getStacksProvider();
}
