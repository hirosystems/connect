import { ClarityValue, TupleCV } from '@stacks/transactions';
import {
  CommonSignaturePayload,
  CommonSignatureRequestOptions,
  SignatureCanceled,
  SignatureFinished,
} from './signature';

export interface StructuredDataSignatureRequestOptions extends CommonSignatureRequestOptions {
  message: ClarityValue;
  domain: TupleCV;
}

export interface StructuredDataSignatureOptions {
  message: ClarityValue;
  domain: TupleCV;
  onFinish?: SignatureFinished;
  onCancel?: SignatureCanceled;
}

export type StructuredDataSignaturePopup = {
  token: string;
  options: StructuredDataSignatureOptions;
};

export interface StructuredDataSignaturePayload extends CommonSignaturePayload {
  message: ClarityValue;
  domain: TupleCV;
}
