import { AccountsRequestOptions } from './types/accounts';
import { getStacksProvider } from './utils';

export const requestAccounts = async (accountsOptions: AccountsRequestOptions) => {
  const provider = getStacksProvider();
  if (!provider) {
    throw new Error('Unable to request accounts without Hiro Wallet extension');
  }

  const { onFinish, onCancel } = accountsOptions;

  // todo: should request accounts tie into userSession (e.g. persist accounts)?
  // const userSession = getOrCreateUserSession(_userSession);

  // todo: should request accounts be encrypted using a transit key?
  // const transitKey = userSession.generateAndStoreTransitKey();

  try {
    const accounts = await provider.accountsRequest();
    onFinish?.({ accounts }); // todo: inside object for future extensibility (or directly as single/only parameter)
  } catch (error) {
    console.error('[Connect] Error during accounts request', error);
    onCancel?.();
  }
};
