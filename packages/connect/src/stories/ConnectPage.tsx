import React from 'react';
import { getSelectedProviderId } from '@stacks/connect-ui';
import { Cl } from '@stacks/transactions';
import { useReducer, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { UserSession } from '../auth';
import {
  disconnect,
  showConnect,
  showContractCall,
  showContractDeploy,
  showSignMessage,
  showSignStructuredMessage,
  showSignTransaction,
  showSTXTransfer,
} from '../ui';
import './connect.css';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const userSession = new UserSession();

// Form Types
type SignMessageFormData = {
  message: string;
};

type STXTransferFormData = {
  amount: string;
  recipient: string;
};

type ContractCallFormData = {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: string;
};

type ContractDeployFormData = {
  contractName: string;
  codeBody: string;
  clarityVersion?: string;
};

type LegacySignTransactionFormData = {
  txHex: string;
};

type LegacySignStructuredMessageFormData = {
  message: string;
  domain: string;
};

const appDetails = {
  name: 'Connect',
  icon: window.location.origin + '/favicon.ico',
};

// Legacy Sign Message Form Component
const LegacySignMessageForm = () => {
  const methods = useForm<SignMessageFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ message }) => {
    showSignMessage({
      message,
      appDetails,
      onFinish: d => {
        setResponse(d);
        refresh();
      },
      onCancel: () => {
        setResponse({ error: 'User canceled the request' });
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showSignMessage</h3>
        <form onSubmit={void onSubmit}>
          <div>
            <label htmlFor="message">Message</label>
            <input
              id="message"
              {...register('message', { required: true })}
              defaultValue="Hello, World!"
            />
          </div>
          <button type="submit">Sign Message</button>
        </form>
        {response && (
          <div data-response>
            <h3>Response</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </section>
    </FormProvider>
  );
};

// Legacy STX Transfer Form Component
const LegacySTXTransferForm = () => {
  const methods = useForm<STXTransferFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ amount, recipient }) => {
    showSTXTransfer({
      amount,
      recipient,
      network: 'mainnet',
      appDetails,
      onFinish: d => {
        setResponse(d);
        refresh();
      },
      onCancel: () => {
        setResponse({ error: 'User canceled the request' });
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showSTXTransfer</h3>
        <form onSubmit={void onSubmit}>
          <div>
            <label htmlFor="amount">Amount (uSTX)</label>
            <input id="amount" {...register('amount', { required: true })} defaultValue="1000" />
          </div>
          <div>
            <label htmlFor="recipient">Recipient</label>
            <input
              id="recipient"
              {...register('recipient', { required: true })}
              defaultValue="SPGSJA8EMYDBAJDX6Z4ED8CWW071B6NB95PJC9WC"
            />
          </div>
          <button type="submit">Send STX</button>
        </form>
        {response && (
          <div data-response>
            <h3>Response</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </section>
    </FormProvider>
  );
};

// Legacy Contract Call Form Component
const LegacyContractCallForm = () => {
  const methods = useForm<ContractCallFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ contractAddress, contractName, functionName, functionArgs }) => {
    try {
      const parsedArgs = functionArgs
        ? functionArgs
            .split('')
            .reduce(
              (acc, char) => {
                if (char === '(') acc.p++;
                if (char === ')') acc.p--;
                if (char === ',' && !acc.p) {
                  acc.segs.push('');
                } else {
                  acc.segs[acc.segs.length - 1] += char;
                }
                return acc;
              },
              { p: 0, segs: [''] }
            )
            .segs.filter(arg => arg.trim())
            .map(arg => Cl.parse(arg.trim()))
        : [];

      showContractCall({
        contractAddress,
        contractName,
        functionName,
        functionArgs: parsedArgs,
        network: 'mainnet',
        appDetails,
        onFinish: d => {
          setResponse(d);
          refresh();
        },
        onCancel: () => {
          setResponse({ error: 'User canceled the request' });
        },
      });
    } catch (e) {
      console.error(e);
      setResponse({ error: `Failed to parse arguments: ${e.message}` });
    }
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showContractCall</h3>
        <form onSubmit={void onSubmit}>
          <div>
            <label htmlFor="contractAddress">Contract Address</label>
            <input
              id="contractAddress"
              {...register('contractAddress', { required: true })}
              defaultValue="SPGSJA8EMYDBAJDX6Z4ED8CWW071B6NB95PJC9WC"
            />
          </div>
          <div>
            <label htmlFor="contractName">Contract Name</label>
            <input
              id="contractName"
              {...register('contractName', { required: true })}
              defaultValue="counters"
            />
          </div>
          <div>
            <label htmlFor="functionName">Function Name</label>
            <input
              id="functionName"
              {...register('functionName', { required: true })}
              defaultValue="count"
            />
          </div>
          <div>
            <label htmlFor="functionArgs">Function Arguments (Clarity expressions)</label>
            <input id="functionArgs" {...register('functionArgs')} defaultValue="3" />
          </div>
          <button type="submit">Call Contract</button>
        </form>
        {response && (
          <div data-response>
            <h3>Response</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </section>
    </FormProvider>
  );
};

// Legacy Contract Deploy Form Component
const LegacyContractDeployForm = () => {
  const methods = useForm<ContractDeployFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ contractName, codeBody }) => {
    showContractDeploy({
      contractName,
      codeBody,
      network: 'mainnet',
      appDetails,
      onFinish: d => {
        setResponse(d);
        refresh();
      },
      onCancel: () => {
        setResponse({ error: 'User canceled the request' });
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showContractDeploy</h3>
        <form onSubmit={void onSubmit}>
          <div>
            <label htmlFor="contractName">Contract Name</label>
            <input
              id="contractName"
              {...register('contractName', { required: true })}
              defaultValue="counters"
            />
          </div>
          <div>
            <label htmlFor="codeBody">Contract Code</label>
            <textarea
              id="codeBody"
              {...register('codeBody', { required: true })}
              defaultValue={`(define-map counters principal int)

(define-public (count (change int))
  (ok (map-set counters tx-sender (+ (get-count tx-sender) change)))
)

(define-read-only (get-count (who principal))
  (default-to 0 (map-get? counters who))
)`}
              rows={3}
            />
          </div>
          <button type="submit">Deploy Contract</button>
        </form>
        {response && (
          <div data-response>
            <h3>Response</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </section>
    </FormProvider>
  );
};

// Sign Transaction Form Component
const LegacySignTransactionForm = () => {
  const methods = useForm<LegacySignTransactionFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ txHex }) => {
    showSignTransaction({
      txHex,
      network: 'mainnet',
      appDetails,
      onFinish: d => {
        setResponse(d);
        refresh();
      },
      onCancel: () => {
        setResponse({ error: 'User canceled the request' });
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showSignTransaction</h3>
        <form onSubmit={void onSubmit}>
          <div>
            <label htmlFor="txHex">Transaction (hex)</label>
            <textarea
              id="txHex"
              {...register('txHex', { required: true })}
              defaultValue="0000000001000000000000000000000000000000000000000000000000000000000000000000000000"
              rows={3}
            />
          </div>
          <button type="submit">Sign Transaction</button>
        </form>
        {response && (
          <div data-response>
            <h3>Response</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </section>
    </FormProvider>
  );
};

// Sign Structured Message Form Component
const LegacySignStructuredMessageForm = () => {
  const methods = useForm<LegacySignStructuredMessageFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ message, domain }) => {
    try {
      // Create a structured message using Clarity values
      const clarityMessage = Cl.parse(message);
      const clarityDomain = Cl.tuple({
        domain: Cl.stringAscii(domain),
        version: Cl.stringAscii('1.0.0'),
        'chain-id': Cl.uint(1),
      });

      showSignStructuredMessage({
        message: clarityMessage,
        domain: clarityDomain,
        network: 'mainnet',
        appDetails,
        onFinish: d => {
          setResponse(d);
          refresh();
        },
        onCancel: () => {
          setResponse({ error: 'User canceled the request' });
        },
      });
    } catch (e) {
      console.error(e);
      setResponse({ error: 'Failed to create Clarity values' });
    }
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showSignStructuredMessage</h3>
        <form onSubmit={void onSubmit}>
          <div>
            <label htmlFor="domain">Domain</label>
            <input
              id="domain"
              {...register('domain', { required: true })}
              defaultValue="example.com"
            />
          </div>
          <div>
            <label htmlFor="structuredMessage">Message</label>
            <input
              id="structuredMessage"
              {...register('message', { required: true })}
              defaultValue='{ structured: "message", num: u3 }'
              style={{ fontFamily: 'monospace' }}
            />
          </div>
          <button type="submit">Sign Structured Message</button>
        </form>
        {response && (
          <div data-response>
            <h3>Response</h3>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </section>
    </FormProvider>
  );
};

// Main ConnectPage Component
export const ConnectPage = ({ children }: { children?: any }) => {
  const refresh = useReducer(x => x + 1, 0)[1];
  const isSignedIn = userSession.isUserSignedIn();
  const [connectResponse, setConnectResponse] = useState<any>(null);

  const appDetails = {
    name: 'Connect',
    icon: window.location.origin + '/favicon.ico',
  };

  return (
    <div>
      <header>
        <h1>Stacks Connect</h1>
        <button
          className="connect"
          onClick={() => {
            if (isSignedIn) {
              disconnect();
              setConnectResponse(null);
            } else {
              void showConnect({
                appDetails,
                onFinish: d => {
                  setConnectResponse(d);
                  refresh();
                },
                onCancel: () => {
                  setConnectResponse({ error: 'User canceled the request' });
                  refresh();
                },
              });
            }
            refresh();
          }}
          style={{
            backgroundColor: isSignedIn ? 'grey' : 'black',
          }}
        >
          {isSignedIn ? 'Disconnect' : 'Connect'}
        </button>
      </header>

      <main>
        <section>
          <h2>Wallet</h2>
          <div>
            Provider:{' '}
            {getSelectedProviderId() ? <code>{getSelectedProviderId()}</code> : 'Not Connected'}
          </div>
          {connectResponse && (
            <div data-response>
              <h3>Connect Response</h3>
              <pre>{JSON.stringify(connectResponse, null, 2)}</pre>
            </div>
          )}
        </section>

        {isSignedIn && (
          <>
            <br />

            <h2>Request Methods</h2>

            {/* MODERN REQUEST METHODS GO HERE */}

            <hr />

            {/* LEGACY METHODS (prefixed with "show") */}
            <h2 style={{ color: 'lightpink' }}>Legacy Methods</h2>

            <LegacySTXTransferForm />
            <LegacyContractCallForm />
            <LegacyContractDeployForm />
            <LegacySignTransactionForm />
            <LegacySignMessageForm />
            <LegacySignStructuredMessageForm />
          </>
        )}
      </main>

      {children}
    </div>
  );
};
