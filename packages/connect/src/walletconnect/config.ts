import { CustomCaipNetwork, UniversalConnectorConfig } from '@reown/appkit-universal-connector';
import { bitcoin, bitcoinTestnet } from '@reown/appkit/networks';
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
  'stx_transferSip9Nft',
  'stx_callContract',
  'stx_deployContract',
  'sendTransfer',
  'signPsbt',
  'getAddresses',
];

export namespace Chains {
  export namespace Stacks {
    export const Mainnet: CustomCaipNetwork<'stacks'> = {
      id: 1,
      chainNamespace: 'stacks' as const,
      caipNetworkId: 'stacks:1',
      name: 'Stacks',
      nativeCurrency: { name: 'STX', symbol: 'STX', decimals: 6 },
      rpcUrls: { default: { http: ['https://api.mainnet.hiro.so'] } },
    };

    export const Testnet: CustomCaipNetwork<'stacks'> = {
      id: 2,
      chainNamespace: 'stacks' as const,
      caipNetworkId: 'stacks:2147483648',
      name: 'Stacks Testnet',
      nativeCurrency: { name: 'STX', symbol: 'STX', decimals: 6 },
      rpcUrls: { default: { http: ['https://api.testnet.hiro.so'] } },
    };
  }

  export namespace Bitcoin {
    export const Mainnet = bitcoin;
    export const Testnet = bitcoinTestnet;
  }
}

export namespace Networks {
  export const Stacks = {
    namespace: 'stacks',
    chains: [Chains.Stacks.Mainnet, Chains.Stacks.Testnet],
    methods: stacksMethods,
    events: ['stx_chainChanged', 'stx_accountsChanged'],
  };

  export const Bitcoin = {
    namespace: 'bip122',
    chains: [Chains.Bitcoin.Mainnet],
    methods: ['signMessage', 'sendTransfer', 'signPsbt', 'getAccountAddresses'],
    events: ['bip122_addressesChanged'],
  };
}

export const Default: Omit<UniversalConnectorConfig, 'projectId'> = {
  metadata: {
    name: 'Universal Connector',
    description: 'Universal Connector',
    url: 'https://appkit.reown.com',
    icons: ['https://appkit.reown.com/icon.png'],
  },
  networks: [Networks.Stacks, Networks.Bitcoin],
};
