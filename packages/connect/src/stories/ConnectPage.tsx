import { getSelectedProviderId } from '@stacks/connect-ui';
import { useReducer } from 'react';
import { disconnect, showConnect, showSignMessage, showSTXTransfer } from '../ui';

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
              message: 'test',

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
          <code>showSignMessage()</code>
        </button>

        <button
          onClick={() => {
            showSTXTransfer({
              amount: '1000',
              recipient: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',

              appDetails: {
                name: 'Connect Demo',
                icon: window.location.origin + '/favicon.ico',
              },

              onFinish: d => {
                alert(JSON.stringify(d, null, 2));
                refresh();
              },
              onCancel: e => console.error('onCancel', e),
            });
          }}
        >
          <code>showSTXTransfer()</code>
        </button>

        <button
          onClick={() => {
            disconnect();
            refresh();
          }}
        >
          <code>disconnect()</code>
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
