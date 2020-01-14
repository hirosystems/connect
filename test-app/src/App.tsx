import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Connect } from '../../src/react/components/connect';
import { useConnect } from '../../src/react';
import { Button, ThemeProvider, theme } from '@blockstack/ui';

const icon = `/messenger-app-icon.png`;
const authOptions = {
  manifestPath: '/static/manifest.json',
  redirectTo: '/',
  finished: () => {
    console.log('finish');
  },
  vaultUrl: 'http://localhost:8080',
  appDetails: {
    name: 'Testing App',
    icon,
  },
};
const DataVaultButton: React.FC = () => {
  const { doOpenDataVault } = useConnect();

  return <Button onClick={() => doOpenDataVault()}>Get Started</Button>;
};
const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Connect authOptions={authOptions}>
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="App"
          >
            <DataVaultButton />
          </div>
        </Connect>
      </ThemeProvider>
    </>
  );
};

export default App;
