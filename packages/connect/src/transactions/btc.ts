import { createUnsecuredToken, Json } from 'jsontokens';
import { BTCTransferOptions, BTCTransferPayload, TransactionTypes } from 'src/types';
import { getStacksProvider } from 'src/utils';

const openGenericTransactionPopup = async ({
  token,
  options,
}: {
  token: string;
  options: BTCTransferOptions; // todo: add generic alternative
}) => {
  const provider = getStacksProvider();
  if (!provider) {
    throw new Error('Hiro Wallet not installed');
  }

  try {
    const txResponse = await provider.transactionRequest(token);

    options.onFinish?.(txResponse as any); // todo: add new `onFinish` for parsed BTC tx data
  } catch (error) {
    console.error('[Connect] Error during transaction request', error);
    options.onCancel?.();
  }
};

export function openBTCTransfer(options: BTCTransferOptions): Promise<void> {
  const { amount, ..._options } = {
    // todo: do we maybe want userSession, stxAddress, ...?
    // ...getDefaults(options),
    ...options,
  };

  const payload: Partial<BTCTransferPayload> = {
    ..._options,
    amount: amount.toString(10),
    txType: TransactionTypes.BTCTransfer,
  };

  const token = createUnsecuredToken(payload as Json);
  return openGenericTransactionPopup({ token, options });
}
