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

export interface StructuredDataSignatureRequestOptions extends CommonSignatureRequestOptions {
  message: LegacyClarityValue | ClarityValue;
  domain: LegacyTupleCV | TupleCV;
}

export interface StructuredDataSignatureOptions {
  message: LegacyClarityValue | ClarityValue;
  domain: LegacyTupleCV | TupleCV;
  onFinish?: SignatureFinished;
  onCancel?: SignatureCanceled;
}

export type StructuredDataSignaturePopup = {
  token: string;
  options: StructuredDataSignatureOptions;
};

export interface StructuredDataSignaturePayload extends CommonSignaturePayload {
  message: LegacyClarityValue | ClarityValue;
  domain: LegacyTupleCV | TupleCV;
}
