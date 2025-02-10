import type { Meta, StoryObj } from '@storybook/react';
import { DEFAULT_PROVIDERS } from '../providers';
import { ConnectPage } from './ConnectPage';
import { WebBTCProvider } from '@stacks/connect-ui';

// Define window types
declare global {
  interface Window {
    MockedProvider?: {
      authenticationRequest: () => void;
    };
    wbip_providers?: WebBTCProvider[];
  }
}

const meta = {
  title: 'Connect/Connect',
  component: ConnectPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#303030',
        },
      ],
    },
  },
} satisfies Meta<typeof ConnectPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Default state - no mocking
export const Default: Story = {};

// 2. With default provider
export const WithDefaultProvider: Story = {
  play: () => {
    window.wbip_providers = [DEFAULT_PROVIDERS[0]];
  },
};

// 3. With mocked wallet
export const WithMockedWallet: Story = {
  play: () => {
    window.wbip_providers = [
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
  },
};
