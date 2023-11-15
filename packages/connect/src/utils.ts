import { getSelectedProvider } from '@stacks/connect-ui';

export function getStacksProvider() {
  return (
    (window as any)[getSelectedProvider()] || window.StacksProvider || window.BlockstackProvider
  );
}

export function isStacksWalletInstalled() {
  return !!getStacksProvider();
}
