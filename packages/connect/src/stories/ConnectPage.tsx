import { showConnect } from '@stacks/connect';

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
      {children}
    </div>
  );
};
