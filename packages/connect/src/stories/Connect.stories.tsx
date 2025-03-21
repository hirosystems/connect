import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DEFAULT_PROVIDERS } from '../providers';
import { ConnectPage } from './ConnectPage';
import { WebBTCProvider } from '@stacks/connect-ui';
import { connect } from '../request';

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

// 4. With approved providers only
export const WithApprovedProvidersOnly: Story = {
  render: () => {
    const handleConnect = () => {
      return connect({
        approvedProviderIds: ['LeatherProvider'],
      });
    };

    return (
      <ConnectPage customConnectFunction={handleConnect}>
        <p>This demo only allows Leather wallet. Click connect() to test.</p>
      </ConnectPage>
    );
  },
};

// 5. With multiple approved providers
export const WithMultipleApprovedProviders: Story = {
  render: () => {
    const handleConnect = () => {
      return connect({
        approvedProviderIds: ['LeatherProvider', 'FordefiProviders.UtxoProvider'],
      });
    };

    return (
      <ConnectPage customConnectFunction={handleConnect}>
        <p>This demo allows only Leather and Fordefi wallets. Click connect() to test.</p>
      </ConnectPage>
    );
  },
};

// 6. With approved providers and custom default providers
export const WithApprovedAndCustomProviders: Story = {
  render: () => {
    const handleConnect = () => {
      // Create a custom set of providers
      const customProviders = [
        {
          id: 'custom-wallet-1',
          name: 'Custom Wallet 1',
          icon: 'https://via.placeholder.com/48',
        },
        {
          id: 'leather',
          name: 'Custom Leather',
          icon: 'https://www.leather.io/favicon.ico',
        },
        {
          id: 'custom-wallet-2',
          name: 'Custom Wallet 2',
          icon: 'https://via.placeholder.com/48',
        },
      ];

      return connect({
        approvedProviderIds: ['leather', 'xverse'],
        defaultProviders: customProviders,
        forceWalletSelect: true,
      });
    };

    return (
      <ConnectPage customConnectFunction={handleConnect}>
        <p>
          This demo combines approvedProviderIds with custom defaultProviders. Only "Custom Leather"
          should appear.
        </p>
      </ConnectPage>
    );
  },
};
