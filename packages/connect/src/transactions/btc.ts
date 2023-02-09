import { createUnsecuredToken, Json } from 'jsontokens';
import { getDefaults, getStxAddress } from '.';
import { BtcRecipient, BTCTransferOptions, BTCTransferPayload, TransactionTypes } from '../types';
import { getStacksProvider } from '../utils';

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
  const { recipients, ..._options } = {
    // todo: do we maybe want userSession, stxAddress, ...?
    // ...getDefaults(options),
    ...options,
  };

  const payLoadRecipients: BtcRecipient[] = [];
  recipients.forEach(recipient => {
    payLoadRecipients.push({
      recipient: recipient.recipient,
      amount: recipient.amount.toString(10),
    });
  });

  const payload: Partial<BTCTransferPayload> = {
    ..._options,
    recipients: payLoadRecipients,
    txType: TransactionTypes.BTCTransfer,
  };

  const token = createUnsecuredToken(payload as Json);
  return openGenericTransactionPopup({ token, options });
}
