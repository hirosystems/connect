

import './App.css'
import { Connect, disconnect } from '@stacks/connect-react'
import { getProviderFromId, getSelectedProviderId, type WebBTCProvider} from '@stacks/connect-ui';
import { useConnect } from '@stacks/connect-react'
import { useEffect, useState } from 'react';

function ConnectDemo() {
  const { doOpenAuth } = useConnect()
  const [provider, setProvider] = useState<WebBTCProvider | null>(null)
  const providerId = getSelectedProviderId()
  console.log('>> providerId', providerId);
  const handleConnect = () => {
    doOpenAuth()
  }

  const handleDisconnect = () => {
    console.log('>> handleDisconnect');
    disconnect()
    setProvider(null)
  }

  useEffect(() => {
    if (providerId) {
      setProvider(getProviderFromId(providerId))
    } else {
      setProvider(null)
    }
  }, [providerId])

  return (
    <div className="connect-demo">
      <h2>Stacks Connect Demo</h2>
      <div className="demo-section">
        { provider ? (
          <div>
            <h3>Provider</h3>
            <p>{provider.name}</p>
            <button onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={handleConnect}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <Connect
      authOptions={{
        appDetails: {
          name: 'Stacks Connect Playground',
          icon: '/vite.svg',
        },
      }}
    >
      <div className="app-container">
        <h1>Stacks Connect Playground</h1>
        <p>Testing local connect-react package</p>
        <ConnectDemo />
      </div>
    </Connect>
  )
}

export default App 