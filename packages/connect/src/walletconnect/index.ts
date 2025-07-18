import { UniversalConnector } from '@reown/appkit-universal-connector';
import { GetAddressesResult, JsonRpcResponse, MethodParamsRaw, MethodsRaw, SignMessageResult } from '../methods';
import { StacksProvider } from '../types/provider';
import { config, stacksMainnet } from './config';
import { bitcoin } from '@reown/appkit/networks';


function jsonRpcResponse<M extends keyof MethodsRaw>(result: unknown): JsonRpcResponse<M> {
  return {
    jsonrpc: '2.0',
    id: 1,
    result
  } as JsonRpcResponse<M>;
}


class WalletConnectProvider implements StacksProvider {
  private connector: UniversalConnector;
  constructor(connector: UniversalConnector) {
    this.connector = connector;
  }

  private async connect() {
    try {
      const { session } = await this.connector.connect();
      return session;
    } catch (error) {
      console.error('>> WalletConnectProvider connect error', error);
      throw error;
    }
  }

  private async getAddresses(): Promise<GetAddressesResult> {
    let session = this.connector.session;
    if (!session) {
      session = await this.connect();
    }

    const stacksAddresses = session?.namespaces?.stacks?.accounts || [];
    const btcAddresses = session?.namespaces?.bip122?.accounts || [];
    const caipAddresses = [...stacksAddresses, ...btcAddresses];
    const accounts = caipAddresses.map((caipAddress) => {
      const address = caipAddress.split(':')[2];

      // TODO: get public key from the connector
      return { address, publicKey: '' }
    })

    return {
      addresses: accounts
    }
  }

  private validateRpcMethod(method: keyof MethodsRaw) {
    if (!this.connector.session) {
      throw new Error('WalletConnectProvider not connected. Please connect first.');
    }
    const namespaces = this.connector.session.namespaces;
    console.log('>> WC session', this.connector.session);
    const stacksMethods = namespaces['stacks']?.methods || [];
    const btcMethods = namespaces['bip122']?.methods || [];
    const methods = [...stacksMethods, ...btcMethods];

    if (!methods.includes(method)) {
      throw new Error(`WalletConnectProvider does not support method ${method}. Please use a supported method.`);
    }
  }

  private getTargetCaipNetworkId(method: keyof MethodsRaw) {
    if (this.connector.session?.namespaces?.stacks?.methods.includes(method)) {
      return stacksMainnet.caipNetworkId;
    }

    if (this.connector.session?.namespaces?.bip122?.methods.includes(method)) {
      return bitcoin.caipNetworkId;
    }

    throw new Error(`WalletConnectProvider does not support method ${method}. Please use a supported method.`);
  }

  async request<M extends keyof MethodsRaw>(method: M, params?: MethodParamsRaw<M>): Promise<JsonRpcResponse<M>> {
    try {
      console.log('>> WalletConnectProvider request', method, params);

      if (method === 'getAddresses') {
        const addresses = await this.getAddresses();
        return jsonRpcResponse(addresses);
      }
  
      this.validateRpcMethod(method);
      const caipNetworkId = this.getTargetCaipNetworkId(method);

      switch (method) {
        case 'stx_signMessage':
          console.log('>> WC stx_signMessage', params);
          const caipAddress = this.connector.session?.namespaces?.stacks?.accounts[0];
          const address = caipAddress.split(':')[2];
          console.log('>> WC address', address);
          const accountAddresses = await this.request('getAccountAddresses' as keyof MethodsRaw)
          console.log('>> WC accountAddresses', accountAddresses);
          const result = await this.connector.request({ method, params: { address, ...params } }, caipNetworkId) as SignMessageResult;
          return jsonRpcResponse(result);

        default:
            return await this.connector.request({ method, params }, caipNetworkId) as JsonRpcResponse<M>;
        }
    } catch (error) {
      console.error('>> WalletConnectProvider request error', error);
      throw error;
    }
  }

  async disconnect() {
    await this.connector.disconnect();
  }
}


export const initializeWalletConnectProvider = async () => {
  const provider = await UniversalConnector.init(config)

  const walletConnectProvider = new WalletConnectProvider(provider);

  window['WalletConnectProvider'] = walletConnectProvider;
};
