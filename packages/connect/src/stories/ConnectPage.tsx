import { getSelectedProviderId } from '@stacks/connect-ui';
import {
  AnchorMode,
  ClarityVersion,
  makeUnsignedContractDeploy,
  makeUnsignedSTXTokenTransfer,
} from '@stacks/transactions';
import { useReducer } from 'react';
import { disconnect, showConnect, showSignMessage, showSignTransaction } from '../ui';
import { bytesToHex } from '@stacks/common';

export const ConnectPage = ({ children }: { children?: any }) => {
  const refresh = useReducer(x => x + 1, 0)[1];

  const selectedProviderId = getSelectedProviderId();

  return (
    <div style={{ fontFamily: 'monospace' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <code>selectedProviderId</code>:{' '}
          {typeof selectedProviderId === 'undefined'
            ? 'undefined'
            : JSON.stringify(selectedProviderId)}{' '}
          <button onClick={() => refresh()}>
            <code>Rerender</code>
          </button>
        </div>

        <button
          onClick={() => {
            showConnect({
              appDetails: {
                name: 'Connect Demo',
                icon: window.location.origin + '/favicon.ico',
              },
              onFinish: d => {
                alert(JSON.stringify(d, null, 2));
                refresh();
              },
              onCancel: () => refresh(),
            });
          }}
        >
          <code>showConnect()</code>
        </button>

        <button
          onClick={() => {
            showSignMessage({
              appDetails: {
                name: 'Connect Demo',
                icon: window.location.origin + '/favicon.ico',
              },
              message: 'test',
              onFinish: d => {
                alert(JSON.stringify(d, null, 2));
                refresh();
              },
              onCancel: () => refresh(),
            });
          }}
        >
          <code>showSignMessage()</code>
        </button>

        <button
          onClick={() => {
            disconnect();
            refresh();
          }}
        >
          <code>disconnect()</code>
        </button>

        <hr />

        <button
          onClick={() => {
            const run = async () => {
              const tx = await makeUnsignedContractDeploy({
                codeBody: `
                  (define-public (hello-world)
                    (ok "hello world"))
                `,
                contractName: 'hello-world',
                publicKey: '024cce41b91566d70ec2ed6eb161c6ef9c277bdc034738318ed06f1d5ba09546d6', // account 1, example wallet
                clarityVersion: ClarityVersion.Clarity3,
                network: 'testnet',
              });
              const txHex = tx.serialize();
              console.log('txHex', txHex);

              showSignTransaction({
                txHex,
                onFinish: d => {
                  alert(JSON.stringify(d, null, 2));
                },
                onCancel: console.error,
              });
            };
            run().catch(console.error);
          }}
        >
          <code>txHex (contract deploy)</code>
        </button>

        <button
          onClick={() => {
            const run = async () => {
              const tx = await makeUnsignedSTXTokenTransfer({
                recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
                amount: '100000',
                publicKey: '024cce41b91566d70ec2ed6eb161c6ef9c277bdc034738318ed06f1d5ba09546d6', // account 1, example wallet
                network: 'testnet',
              });
              const txHex = tx.serialize();
              console.log('txHex', txHex);

              showSignTransaction({
                txHex,
                onFinish: d => {
                  alert(JSON.stringify(d, null, 2));
                },
                onCancel: console.error,
              });
            };
            run().catch(console.error);
          }}
        >
          <code>txHex (stx transfer)</code>
        </button>
      </div>

      {children}
      <div
        style={{
          marginTop: '16px',
          backgroundColor: '#f0f0f0',
          height: '2000px', // very high, to test scrolling
        }}
      />
    </div>
  );
};
