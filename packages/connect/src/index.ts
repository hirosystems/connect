export * from './auth';
export * from './providers';
export * from './types';
export * from './ui';
export * from './errors';

// Manual exports to avoid exporting internals (e.g. `LEGACY_XYZ`)
export { getDefaultPsbtRequestOptions, makePsbtToken, openPsbtRequestPopup } from './bitcoin';
export {
  getDefaultSignatureRequestOptions,
  SignatureRequestPayload,
  signMessage,
  openSignatureRequestPopup,
} from './signature';
export {
  signStructuredMessage,
  openStructuredDataSignatureRequestPopup,
} from './signature/structuredData';
export {
  getDefaultProfileUpdateRequestOptions,
  makeProfileUpdateToken,
  openProfileUpdateRequestPopup,
} from './profile';
export {
  getUserSession,
  hasAppPrivateKey,
  getKeys,
  getStxAddress,
  makeContractCallToken,
  makeContractDeployToken,
  makeSTXTransferToken,
  makeSignTransaction,
  openContractCall,
  openContractDeploy,
  openSTXTransfer,
  openSignTransaction,
} from './transactions';
export { connect, request, requestRaw } from './request';
export type {
  Methods,
  MethodParams,
  MethodResult,
  MethodParamsRaw,
  MethodResultRaw,
} from './methods';
export {
  getLocalStorage,
  clearLocalStorage,
  StorageData,
  disconnect,
  isConnected,
} from './storage';
export { getStacksProvider, isStacksWalletInstalled } from './utils';

// TODO: (next)
// We won't expose these types (TypeBox and Zod) until they are final and stable.
// TypeBox
// Only export the outermost typebox schemas
// export { ClarityValueTypeBoxSchema, PostConditionTypeBoxSchema } from './types/typebox';

// Re-exports
export {
  clearSelectedProviderId,
  getSelectedProviderId,
  setSelectedProviderId,
  isProviderSelected,
} from '@stacks/connect-ui';
export type { WebBTCProvider, WbipProvider } from '@stacks/connect-ui';
