import { showConnect } from '@stacks/connect';

export const ConnectPage = () => {
  function connect() {
    showConnect({
      appDetails: {
        name: 'Connect Demo',
        icon: window.location.origin + '/favicon.ico',
      },
    });
  }

  return <button onClick={connect}>Connect Wallet</button>;
};
