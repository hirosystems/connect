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
  rpcUrls: { default: { http: ['https://api.mainnet.hiro.so'] } },
};

export const config: UniversalConnectorConfig = {
  projectId: 'your_project_id',
  metadata: {
    name: 'Universal Connector',
    description: 'Universal Connector',
    url: 'https://appkit.reown.com',
    icons: ['https://appkit.reown.com/icon.png'],
  },
  networks: [
    {
      namespace: 'stacks',
      chains: [stacksMainnet as CustomCaipNetwork],
      methods: stacksMethods,
      events: ['stx_chainChanged', 'stx_accountsChanged'],
    },
    {
      namespace: 'bip122',
      chains: [bitcoin],
      methods: ['signMessage', 'sendTransfer', 'signPsbt', 'getAccountAddresses'],
      events: ['bip122_addressesChanged'],
    },
  ],
};
