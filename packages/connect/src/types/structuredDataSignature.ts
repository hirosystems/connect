import { ClarityValue } from '@stacks/transactions';
import {
  CommonSignaturePayload,
  CommonSignatureRequestOptions,
  SignatureCanceled,
  SignatureFinished,
} from './signature';

export interface StructuredDataSignatureRequestOptions extends CommonSignatureRequestOptions {
  message: ClarityValue;
}

export interface StructuredDataSignatureOptions {
  message: ClarityValue;
  onFinish?: SignatureFinished;
  onCancel?: SignatureCanceled;
}

export type StructuredDataSignaturePopup = {
  token: string;
  options: StructuredDataSignatureOptions;
};

export interface StructuredDataSignaturePayload extends CommonSignaturePayload {
  message: ClarityValue;
}
