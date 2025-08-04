import { CustomCaipNetwork, UniversalConnectorConfig } from '@reown/appkit-universal-connector';
import { bitcoin } from '@reown/appkit/networks';
import { MethodsRaw } from '../methods';

const stacksMethods: (keyof MethodsRaw)[] = [
  'stx_signMessage',
  'stx_signTransaction',
  'stx_signStructuredMessage',
  'stx_getAccounts',
  'stx_getAddresses',
  'stx_updateProfile',
  'stx_transferStx',
  'stx_transferSip10Ft',
  'stx_transferSip10Nft',
  'stx_callContract',
  'stx_deployContract',
  'sendTransfer',
  'signPsbt',
  'getAddresses',
];

export const stacksMainnet: CustomCaipNetwork<'stacks'> = {
  id: 1,
  chainNamespace: 'stacks' as const,
  caipNetworkId: 'stacks:1',
  name: 'Stacks',
  nativeCurrency: { name: 'STX', symbol: 'STX', decimals: 6 },
  rpcUrls: { default: { http: ['https://stacks-node-mainnet.stacks.co'] } },
};

export const config: UniversalConnectorConfig = {
  projectId: '702e2d45d9debca66795614cddb5c1ca',
  metadata: {
    name: 'Universal Connector',
    description: 'Universal Connector',
    url: 'https://appkit.reown.com',
    icons: ['https://appkit.reown.com/icon.png'],
  },
  networks: [
    {
      methods: stacksMethods,
      chains: [stacksMainnet as CustomCaipNetwork],
      events: ['stx_chainChanged', 'stx_accountsChanged'],
      namespace: 'stacks',
    },
    {
      methods: ['signMessage', 'sendTransfer', 'signPsbt', 'getAccountAddresses'],
      chains: [bitcoin],
      namespace: 'bip122',
      events: ['bip122_addressesChanged'],
    },
  ],
};
