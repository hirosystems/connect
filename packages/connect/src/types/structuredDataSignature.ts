import {
  ClarityValue as LegacyClarityValue,
  TupleCV as LegacyTupleCV,
} from '@stacks/transactions-v6';
import { ClarityValue, TupleCV } from '@stacks/transactions';
import {
  CommonSignaturePayload,
  CommonSignatureRequestOptions,
  SignatureCanceled,
  SignatureFinished,
} from './signature';

/** @deprecated Update to the latest `request` RPC methods. */
export interface StructuredDataSignatureRequestOptions extends CommonSignatureRequestOptions {
  message: LegacyClarityValue | ClarityValue;
  domain: LegacyTupleCV | TupleCV;
}

/** @deprecated Update to the latest `request` RPC methods. */
export interface StructuredDataSignatureOptions {
  message: LegacyClarityValue | ClarityValue;
  domain: LegacyTupleCV | TupleCV;
  onFinish?: SignatureFinished;
  onCancel?: SignatureCanceled;
}

/** @deprecated Update to the latest `request` RPC methods. */
export type StructuredDataSignaturePopup = {
  token: string;
  options: StructuredDataSignatureOptions;
};

/** @deprecated Update to the latest `request` RPC methods. */
export interface StructuredDataSignaturePayload extends CommonSignaturePayload {
  message: LegacyClarityValue | ClarityValue;
  domain: LegacyTupleCV | TupleCV;
}
