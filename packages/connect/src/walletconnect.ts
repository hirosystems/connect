import { UniversalConnector, type CustomCaipNetwork } from '@reown/appkit-universal-connector';
import { AccountEntry, ClarityValue, JsonRpcResponse, MethodParams, MethodParamsRaw, Methods } from './methods';
import { StacksProvider } from './types/provider';
const source = 'walletconnect';

const stacksMethods: (keyof Methods)[] = [
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
]


const stacksMainnet: CustomCaipNetwork<'stacks'> = {
  id: 1,
  chainNamespace: 'stacks' as const,
  caipNetworkId: 'stacks:1',
  name: 'Stacks',
  nativeCurrency: { name: 'STX', symbol: 'STX', decimals: 6 },
  rpcUrls: { default: { http: ['https://stacks-node-mainnet.stacks.co'] } }
}


class WalletConnectProvider implements StacksProvider {
  private connector: UniversalConnector;
  constructor(connector: UniversalConnector) {
    this.connector = connector;
  }
  async request<M extends keyof Methods>(method: M, params?: MethodParamsRaw<M>): Promise<JsonRpcResponse<M>> {

    console.log('WC request', method, params);
    console.log('WC session', this.connector.session);

    if (method === 'getAddresses') {
      console.log('>> Connecting...')

      const { session } = await this.connector.connect();
      console.log('WC session', session);
      const caipAddresses = session?.namespaces?.stacks?.accounts;
      const accounts = caipAddresses?.map((caipAddress) => {
        const address = caipAddress.split(':')[2];
        return { address, publicKey: '' }
      })
      return {
        jsonrpc: '2.0',
        id: 1,
        result: { addresses: accounts }
      } as JsonRpcResponse<M>;
    }


    const response = await this.connector.request({ method, params}, stacksMainnet.caipNetworkId);
    return response as JsonRpcResponse<M>;
  }

  async getAddresses(): Promise<string[]> {
    return [];
  }

  async sendTransfer(address: string, amount: number): Promise<number> {
    return Promise.resolve(0);
  }

  async signPsbt(psbt: string): Promise<string> {
    return Promise.resolve('');
  }
  async updateProfile(profile: Record<string, any>): Promise<Record<string, any>> {
    return Promise.resolve({});
  }

  async getAccounts(): Promise<AccountEntry[]> {
    return Promise.resolve([]);
  }
  async signStructuredMessage(message: ClarityValue): Promise<string> {
    return Promise.resolve('');
  }
  async signMessage(message: string): Promise<string> {
    return Promise.resolve('');
  }
  async signTransaction(transaction: string): Promise<string> {
    return Promise.resolve('');
  }
  async deployContract(contract: string): Promise<string> {
    return Promise.resolve('');
  }
  async callContract(contract: string, functionName: string, functionArgs: string[]): Promise<string> {
    return Promise.resolve('');
  }
  async transferStx(address: string, amount: number): Promise<string> {
    return Promise.resolve('');
  }
  async transferSip10Ft(address: string, amount: number): Promise<string> {
    return Promise.resolve('');
  }
  async transferSip10Nft(address: string, amount: number): Promise<string> {
    return Promise.resolve('');
  }
}


export const initializeWalletConnectProvider = async () => {
  const provider = await UniversalConnector.init({
    projectId: '',
    metadata: {
      name: 'Universal Connector',
      description: 'Universal Connector',
      url: 'https://appkit.reown.com',
      icons: ['https://appkit.reown.com/icon.png']
    },
    networks: [
      {
        methods: stacksMethods,
        chains: [stacksMainnet as CustomCaipNetwork],
        events: ['stx_chainChanged', 'stx_accountsChanged'],
        accounts: [],
        namespace: 'stacks'
      }
    ]
  })

  console.log('WC', provider.session?.namespaces.stacks.methods);


  const walletConnectProvider = new WalletConnectProvider(provider);

  window['WalletConnectProvider'] = walletConnectProvider;
  console.log('WC', window['WalletConnectProvider']);
};
