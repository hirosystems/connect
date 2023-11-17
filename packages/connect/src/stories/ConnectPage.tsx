import { showConnect } from '@stacks/connect';
import { clearSelectedProvider } from '@stacks/connect-ui';

export const ConnectPage = ({ children }: { children?: any }) => {
  function connect() {
    showConnect({
      appDetails: {
        name: 'Connect Demo',
        icon: window.location.origin + '/favicon.ico',
      },
    });
  }

  return (
    <div>
      <button onClick={connect}>Connect Wallet</button>
      <button onClick={() => clearSelectedProvider()}>Disconnect</button>
      {children}
    </div>
  );
};
