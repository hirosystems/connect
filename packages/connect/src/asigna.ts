const source = 'asigna-stx';

const generateCall = (payload: string, key: string) => {
  return new Promise(res => {
    function listener(message: MessageEvent<any>) {
      if (message.data.source === source && message.data[key]) {
        res(message.data[key]);
        window.removeEventListener('message', listener);
      }
    }
    window.addEventListener('message', listener);
    window.top.postMessage(generateAsignaMessage(payload, key), '*');
  });
};

const AsignaIframeProvider = {
  authenticationRequest: async (payload: string) => {
    return generateCall(payload, 'authenticationRequest');
  },
  transactionRequest: async (payload: string) => {
    return generateCall(payload, 'transactionRequest');
  },
};
const generateAsignaMessage = (payload: string, key: string) => ({ source, [key]: payload });

export const initializeAsignaProvider = () => {
  if (typeof window === 'undefined') return;

  const isIframe = window.top !== window.self;
  if (isIframe) {
    window['AsignaProvider'] = AsignaIframeProvider;
  }
};
