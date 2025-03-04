import React from 'react';
import { getSelectedProviderId } from '@stacks/connect-ui';
import { Cl } from '@stacks/transactions';
import { useReducer, useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AppConfig, UserSession } from '../auth';
import { connect, request } from '../request';
import {
  showConnect,
  showContractCall,
  showContractDeploy,
  showSignMessage,
  showSignStructuredMessage,
  showSignTransaction,
  showSTXTransfer,
} from '../ui';
import './connect.css';
import { disconnect, isConnected, getLocalStorage } from '../storage';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const userSession = new UserSession({ appConfig: new AppConfig() });

const appDetails = {
  name: 'Connect',
  icon: window.location.origin + '/favicon.ico',
};

// Legacy Sign Message Form Component
const LegacySignMessageForm = () => {
  type SignMessageFormData = {
    message: string;
  };
  const methods = useForm<SignMessageFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ message }, e) => {
    e.preventDefault();
    showSignMessage({
      message,
      appDetails,
      onFinish: d => {
        setResponse(d);
        refresh();
      },
      onCancel: e => {
        setResponse({ onCancel: e?.toString() });
      },
    } as any);
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showSignMessage</h3>
        <form onSubmit={e => void onSubmit(e)}>
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
  type STXTransferFormData = {
    amount: string;
    recipient: string;
  };
  const methods = useForm<STXTransferFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ amount, recipient }, e) => {
    e.preventDefault();
    showSTXTransfer({
      amount,
      recipient,
      network: 'mainnet',
      appDetails,
      onFinish: d => {
        setResponse(d);
        refresh();
      },
      onCancel: e => {
        setResponse({ onCancel: e?.toString() });
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showSTXTransfer</h3>
        <form onSubmit={e => void onSubmit(e)}>
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
  type ContractCallFormData = {
    contractAddress: string;
    contractName: string;
    functionName: string;
    functionArgs: string;
  };
  const methods = useForm<ContractCallFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(
    ({ contractAddress, contractName, functionName, functionArgs }, e) => {
      e.preventDefault();
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
          onCancel: e => {
            setResponse({ onCancel: e?.toString() });
          },
        });
      } catch (e) {
        console.error(e);
        setResponse({ error: `Failed to parse arguments: ${e.message || e}` });
      }
    }
  );

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showContractCall</h3>
        <form onSubmit={e => void onSubmit(e)}>
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
  type ContractDeployFormData = {
    contractName: string;
    codeBody: string;
    clarityVersion?: string;
  };
  const methods = useForm<ContractDeployFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ contractName, codeBody }, e) => {
    e.preventDefault();
    showContractDeploy({
      contractName,
      codeBody,
      network: 'mainnet',
      appDetails,
      onFinish: d => {
        setResponse(d);
        refresh();
      },
      onCancel: e => {
        setResponse({ onCancel: e?.toString() });
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showContractDeploy</h3>
        <form onSubmit={e => void onSubmit(e)}>
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
  type LegacySignTransactionFormData = {
    txHex: string;
  };
  const methods = useForm<LegacySignTransactionFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ txHex }, e) => {
    e.preventDefault();
    showSignTransaction({
      txHex,
      network: 'mainnet',
      appDetails,
      onFinish: d => {
        setResponse(d);
        refresh();
      },
      onCancel: e => {
        setResponse({ onCancel: e?.toString() });
      },
    });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>showSignTransaction</h3>
        <form onSubmit={e => void onSubmit(e)}>
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
  type LegacySignStructuredMessageFormData = {
    message: string;
    domain: string;
  };
  const methods = useForm<LegacySignStructuredMessageFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ message, domain }, e) => {
    e.preventDefault();
    try {
      // Create a structured message using Clarity values
      const clarityMessage = Cl.parse(message);
      const clarityDomain = Cl.tuple({
        name: Cl.stringAscii(domain),
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
        onCancel: e => {
          setResponse({ onCancel: e?.toString() });
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
        <form onSubmit={e => void onSubmit(e)}>
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

// Modern Request Methods Components
const GetAddressesForm = () => {
  type GetAddressesFormData = {
    network?: string;
  };
  const methods = useForm<GetAddressesFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ network }, e) => {
    e.preventDefault();
    request('getAddresses', {
      network: network || 'mainnet',
    })
      .then(d => {
        setResponse(d);
        refresh();
      })
      .catch(e => {
        setResponse({ error: e?.toString() });
        refresh();
        throw e;
      });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>getAddresses</h3>
        <form onSubmit={e => void onSubmit(e)}>
          <div>
            <label htmlFor="network">Network (optional)</label>
            <input id="network" {...register('network')} defaultValue="mainnet" />
          </div>
          <button type="submit">Get Addresses</button>
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

// Send Transfer Form Component
const SendTransferForm = () => {
  type SendTransferFormData = {
    address: string;
    amount: string;
  };
  const methods = useForm<SendTransferFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ address, amount }, e) => {
    e.preventDefault();
    request('sendTransfer', {
      recipients: [{ address, amount }],
    })
      .then(d => {
        setResponse(d);
        refresh();
      })
      .catch(e => {
        setResponse({ error: e?.toString() });
        refresh();
        throw e;
      });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>sendTransfer</h3>
        <form onSubmit={e => void onSubmit(e)}>
          <div>
            <label htmlFor="recipient">Recipient</label>
            <input
              id="address"
              {...register('address', { required: true })}
              defaultValue="bc1qul02aptw6x3t0ltn0mvdrlask3r6uqyln3pfeg"
            />
          </div>
          <div>
            <label htmlFor="amount">Amount (sats)</label>
            <input id="amount" {...register('amount', { required: true })} defaultValue="1000" />
          </div>
          <button type="submit">Send Transfer</button>
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

// STX Get Addresses Form Component
const STXGetAddressesForm = () => {
  type STXGetAddressesFormData = {
    network?: string;
  };
  const methods = useForm<STXGetAddressesFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ network }, e) => {
    e.preventDefault();
    request('stx_getAddresses', {
      network: network || 'mainnet',
    })
      .then(d => {
        setResponse(d);
        refresh();
      })
      .catch(e => {
        setResponse({ error: e?.toString() });
        refresh();
        throw e;
      });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>stx_getAddresses</h3>
        <form onSubmit={e => void onSubmit(e)}>
          <div>
            <label htmlFor="network">Network (optional)</label>
            <input id="network" {...register('network')} defaultValue="mainnet" />
          </div>
          <button type="submit">Get STX Addresses</button>
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

// STX Get Accounts Form Component
const STXGetAccountsForm = () => {
  type STXGetAccountsFormData = {
    network?: string;
  };
  const methods = useForm<STXGetAccountsFormData>();
  const { handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({}, e) => {
    e.preventDefault();
    request('stx_getAccounts')
      .then(d => {
        setResponse(d);
        refresh();
      })
      .catch(e => {
        setResponse({ error: e?.toString() });
        refresh();
        throw e;
      });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>stx_getAccounts</h3>
        <form onSubmit={e => void onSubmit(e)}>
          <button type="submit">Get STX Accounts</button>
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

// STX Transfer Form Component
const STXTransferForm = () => {
  type STXTransferFormData = {
    amount: string;
    recipient: string;
    network?: string;
    memo?: string;
  };
  const methods = useForm<STXTransferFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ amount, recipient, network, memo }, e) => {
    e.preventDefault();
    request('stx_transferStx', {
      amount: amount,
      recipient: recipient,
      network: network || 'mainnet',
      memo: memo || undefined,
    })
      .then(d => {
        setResponse(d);
        refresh();
      })
      .catch(e => {
        setResponse({ error: e?.toString() });
        refresh();
        throw e;
      });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>stx_transferStx</h3>
        <form onSubmit={e => void onSubmit(e)}>
          <div>
            <label htmlFor="amount">Amount (uSTX)</label>
            <input id="amount" {...register('amount', { required: true })} defaultValue="1000" />
          </div>
          <div>
            <label htmlFor="recipient">Recipient</label>
            <input
              id="recipient"
              {...register('recipient', { required: true })}
              defaultValue="SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN"
            />
          </div>
          <div>
            <label htmlFor="network">Network (optional)</label>
            <input id="network" {...register('network')} defaultValue="mainnet" />
          </div>
          <div>
            <label htmlFor="memo">Memo (optional)</label>
            <input id="memo" {...register('memo')} />
          </div>
          <button type="submit">Transfer STX</button>
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

// STX Contract Call Form Component
const STXContractCallForm = () => {
  type STXContractCallFormData = {
    contract: string;
    functionName: string;
    functionArgs: string;
    network?: string;
  };
  const methods = useForm<STXContractCallFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ contract, functionName, functionArgs }, e) => {
    e.preventDefault();
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

      request('stx_callContract', {
        contract: contract as `${string}.${string}`,
        functionName,
        functionArgs: parsedArgs,
        // network: network || 'mainnet',
      })
        .then(d => {
          setResponse(d);
          refresh();
        })
        .catch(e => {
          setResponse({ error: e?.toString() });
          refresh();
          throw e;
        });
    } catch (e) {
      console.error(e);
      setResponse({ error: `Failed to parse arguments: ${e.message || e}` });
    }
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>stx_callContract</h3>
        <form onSubmit={e => void onSubmit(e)}>
          <div>
            <label htmlFor="contract">Contract (address.contract-name)</label>
            <input
              id="contract"
              {...register('contract', { required: true })}
              defaultValue="SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN.counters"
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
          <div>
            <label htmlFor="network">Network (optional)</label>
            <input id="network" {...register('network')} defaultValue="mainnet" />
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

// STX Deploy Contract Form Component
const STXDeployContractForm = () => {
  type STXDeployContractFormData = {
    name: string;
    clarityCode: string;
    clarityVersion?: string;
    network?: string;
  };
  const methods = useForm<STXDeployContractFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ name, clarityCode, clarityVersion, network }, e) => {
    e.preventDefault();
    request('stx_deployContract', {
      name,
      clarityCode,
      clarityVersion,
      network: network || 'mainnet',
    })
      .then(d => {
        setResponse(d);
        refresh();
      })
      .catch(e => {
        setResponse({ error: e?.toString() });
        refresh();
        throw e;
      });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>stx_deployContract</h3>
        <form onSubmit={e => void onSubmit(e)}>
          <div>
            <label htmlFor="name">Contract Name</label>
            <input id="name" {...register('name', { required: true })} defaultValue="counters" />
          </div>
          <div>
            <label htmlFor="clarityCode">Contract Code</label>
            <textarea
              id="clarityCode"
              {...register('clarityCode', { required: true })}
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
          <div>
            <label htmlFor="clarityVersion">Clarity Version (optional)</label>
            <input id="clarityVersion" {...register('clarityVersion')} defaultValue="2" />
          </div>
          <div>
            <label htmlFor="network">Network (optional)</label>
            <input id="network" {...register('network')} defaultValue="mainnet" />
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

// STX Sign Message Form Component
const STXSignMessageForm = () => {
  type STXSignMessageFormData = {
    message: string;
  };
  const methods = useForm<STXSignMessageFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ message }, e) => {
    e.preventDefault();
    request('stx_signMessage', {
      message,
    })
      .then(d => {
        setResponse(d);
        refresh();
      })
      .catch(e => {
        setResponse({ error: e?.toString() });
        refresh();
        throw e;
      });
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>stx_signMessage</h3>
        <form onSubmit={e => void onSubmit(e)}>
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

// STX Sign Structured Message Form Component
const STXSignStructuredMessageForm = () => {
  type STXSignStructuredMessageFormData = {
    message: string;
    domain: string;
  };
  const methods = useForm<STXSignStructuredMessageFormData>();
  const { register, handleSubmit } = methods;
  const refresh = useReducer(x => x + 1, 0)[1];
  const [response, setResponse] = useState<any>(null);

  const onSubmit = handleSubmit(({ message, domain }, e) => {
    e.preventDefault();
    try {
      // Create a structured message using Clarity values
      const clarityMessage = Cl.parse(message);
      const clarityDomain = Cl.tuple({
        domain: Cl.stringAscii(domain),
        version: Cl.stringAscii('1.0.0'),
        'chain-id': Cl.uint(1),
      });

      request('stx_signStructuredMessage', {
        message: clarityMessage,
        domain: clarityDomain,
      })
        .then(d => {
          setResponse(d);
          refresh();
        })
        .catch(e => {
          setResponse({ error: e?.toString() });
          refresh();
          throw e;
        });
    } catch (e) {
      console.error(e);
      setResponse({ error: 'Failed to create Clarity values' });
    }
  });

  return (
    <FormProvider {...methods}>
      <section>
        <h3>stx_signStructuredMessage</h3>
        <form onSubmit={e => void onSubmit(e)}>
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
  const [localStorageData, setLocalStorageData] = useState<any>(null);

  useEffect(() => {
    setLocalStorageData(getLocalStorage());
  }, [refresh]);

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
              setLocalStorageData(null);
              refresh();
            } else {
              void showConnect({
                appDetails,
                userSession,
                onFinish: d => {
                  setConnectResponse(d);
                  // Explicitly update localStorage data after successful connection
                  setLocalStorageData(getLocalStorage());
                  refresh();
                },
                onCancel: () => {
                  setConnectResponse({ error: 'User canceled the request' });
                  refresh();
                },
              });
            }
          }}
          style={{
            backgroundColor: isSignedIn ? 'grey' : 'black',
          }}
        >
          {isSignedIn ? 'Disconnect' : <code>`showConnect()`</code>}
        </button>

        <button
          className="connect"
          onClick={() => {
            if (isConnected()) {
              disconnect();
              setConnectResponse(null);
              // Explicitly clear localStorage data display after disconnect
              setLocalStorageData(null);
              refresh();
              return;
            }

            void connect()
              .then(setConnectResponse)
              .then(() => {
                // Explicitly update the localStorage data after successful connection
                setLocalStorageData(getLocalStorage());
                refresh();
              });
          }}
          style={{
            backgroundColor: isConnected() ? 'grey' : 'black',
          }}
        >
          {isConnected() ? 'Disconnect' : <code>`connect()`</code>}
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
          {localStorageData && (
            <div data-response>
              <h3>LocalStorage Content</h3>
              <pre>{JSON.stringify(localStorageData, null, 2)}</pre>
            </div>
          )}
        </section>

        {(isSignedIn || isConnected()) && (
          <>
            <br />

            <h2>Request Methods</h2>

            {/* MODERN REQUEST METHODS GO HERE */}
            <GetAddressesForm />
            <SendTransferForm />
            <STXGetAddressesForm />
            <STXGetAccountsForm />
            <STXTransferForm />
            <STXContractCallForm />
            <STXDeployContractForm />
            <STXSignMessageForm />
            <STXSignStructuredMessageForm />

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
