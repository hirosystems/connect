import { PublicProfile } from '@stacks/profile';

import { PsbtData } from './bitcoin';
import { SignatureData } from './signature';
import { FinishedTxPayload, SponsoredFinishedTxPayload } from './transactions';

export interface StacksProvider {
  /** @deprecated */
  getURL: () => Promise<string>;
  /**
   * Make a transaction request
   *
   * @param payload - a JSON web token representing a transaction request
   */
  transactionRequest(payload: string): Promise<FinishedTxPayload | SponsoredFinishedTxPayload>;
  /**
   * Make an authentication request
   *
   * @param payload - a JSON web token representing an auth request
   *
   * @returns an authResponse string in the form of a JSON web token
   */
  authenticationRequest(payload: string): Promise<string>;
  signatureRequest(payload: string): Promise<SignatureData>;
  structuredDataSignatureRequest(payload: string): Promise<SignatureData>;
  /**
   *  @experimental
   */
  psbtRequest(payload: string): Promise<PsbtData>;
  profileUpdateRequest(payload: string): Promise<PublicProfile>;
  request(method: string, params?: any[]): Promise<Record<string, any>>;
  getProductInfo:
    | undefined
    | (() => {
        version: string;
        name: string;
        meta?: {
          tag?: string;
          commit?: string;
          [key: string]: any;
        };
        [key: string]: any;
      });
}

export type BlockstackProvider = StacksProvider;

declare global {
  interface Window {
    BlockstackProvider?: BlockstackProvider;
    StacksProvider?: StacksProvider;
  }
}
