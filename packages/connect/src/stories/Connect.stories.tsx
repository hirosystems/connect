import { DEFAULT_PROVIDERS } from '@stacks/connect';
import { ConnectPage } from './ConnectPage';
import { clearSelectedProvider } from '@stacks/connect-ui';

export default {
  component: ConnectPage,
};

// 1. No mocking
export const NoMocking = {
  render: () => <ConnectPage />,
};

// 2. Mocking
const ConnectWithMockedRegister = () => {
  window.webbtc_stx_providers = [DEFAULT_PROVIDERS[0]]; // simulate installed wallet
  return <ConnectPage />;
};
export const WithMockedRegister = {
  render: () => <ConnectWithMockedRegister />,
};

// 3. Mocking
declare global {
  interface Window {
    MockedProvider: any;
  }
}
const ConnectWithMockedWallet = () => {
  window.webbtc_stx_providers = [
    {
      id: 'MockedProvider',
      name: 'Mocked Wallet',
    },
  ];
  window.MockedProvider = {
    authenticationRequest: () => {
      alert('MockedProvider.authenticationRequest()');
    },
  };
  return <ConnectPage />;
};
export const WithMockedWallet = {
  render: () => <ConnectWithMockedWallet />,
};
