import { getSelectedProviderId, getProviderFromId } from '@stacks/connect-ui';
import {
  StacksNetwork as LegacyStacksNetwork,
  StacksMainnet as LegacyStacksMainnet,
  StacksTestnet as LegacyStacksTestnet,
} from '@stacks/network-v6';
import { ConnectNetwork } from './types';
import { TransactionVersion } from '@stacks/network';

export function getStacksProvider() {
  const provider = getProviderFromId(getSelectedProviderId());
  return provider || window.StacksProvider || window.BlockstackProvider;
}

export function isStacksWalletInstalled() {
  return !!getStacksProvider();
}

/** @internal */
export function legacyNetworkFromConnectNetwork(network?: ConnectNetwork): LegacyStacksNetwork {
  if (!network) return new LegacyStacksTestnet();
  if (typeof network === 'string') return LegacyStacksNetwork.fromName(network);
  if ('version' in network) return network; // legacy type

  if ('url' in network) return new LegacyStacksMainnet({ url: network.url }); // experimental

  return network.transactionVersion === (TransactionVersion.Mainnet as number)
    ? new LegacyStacksMainnet({ url: network.client.baseUrl })
    : new LegacyStacksTestnet({ url: network.client.baseUrl });
}
