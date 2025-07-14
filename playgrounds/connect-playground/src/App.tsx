
import './App.css'
import { Connect } from '@stacks/connect-react'
import { useConnect } from '@stacks/connect-react'

function ConnectDemo() {
  const { doOpenAuth, userSession, authData } = useConnect()

  const handleConnect = () => {
    doOpenAuth()
  }

  console.log('userSession', userSession);
  console.log('authData', authData);

  return (
    <div className="connect-demo">
      <h2>Stacks Connect Demo</h2>
      <div className="demo-section">
        <h3>Authentication</h3>
        <button onClick={handleConnect}>
          Connect Wallet
        </button>
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