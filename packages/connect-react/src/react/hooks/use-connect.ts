import { useContext } from 'react';
import {
  authenticate,
  AuthOptions,
  ContractCallOptions,
  ContractDeployOptions,
  STXTransferOptions,
  openContractCall,
  openContractDeploy,
  openSTXTransfer,
  showBlockstackConnect,
  ContractCallRegularOptions,
  ContractCallSponsoredOptions,
  ContractDeployRegularOptions,
  ContractDeploySponsoredOptions,
  STXTransferRegularOptions,
  STXTransferSponsoredOptions,
  FinishedAuthData,
  openStructuredDataSignatureRequestPopup,
  openSignatureRequestPopup,
  ProfileUpdateRequestOptions,
  openProfileUpdateRequestPopup,
} from '@stacks/connect';
import { ConnectContext, ConnectDispatchContext, States } from '../components/connect/context';
import { SignatureRequestOptions } from '@stacks/connect';
import { StructuredDataSignatureRequestOptions } from '@stacks/connect/src/types/structuredDataSignature';

const useConnectDispatch = () => {
  const dispatch = useContext(ConnectDispatchContext);
  if (!dispatch) {
    throw new Error('This must be used within the ConnectProvider component.');
  }
  return dispatch;
};

export const useConnect = () => {
  const { isOpen, isAuthenticating, authData, authOptions, userSession } =
    useContext(ConnectContext);

  const dispatch = useConnectDispatch();

  const doUpdateAuthOptions = (payload: Partial<AuthOptions>) => {
    return dispatch({ type: States.UPDATE_AUTH_OPTIONS, payload });
  };

  /**
   *
   * @param signIn Whether the user should be sent to sign in
   * @param options
   */
  const doOpenAuth = (signIn?: boolean, options?: Partial<AuthOptions>) => {
    if (signIn) {
      const _options: AuthOptions = {
        ...authOptions,
        ...options,
        onFinish: (payload: FinishedAuthData) => {
          authOptions.onFinish?.(payload);
        },
        sendToSignIn: true,
      };
      void authenticate(_options);
      return;
    } else {
      showBlockstackConnect({
        ...authOptions,
        sendToSignIn: false,
      });
    }
    authOptions && doUpdateAuthOptions(authOptions);
  };

  const doAuth = (options: Partial<AuthOptions> = {}) => {
    void authenticate({
      ...authOptions,
      ...options,
      onFinish: (payload: FinishedAuthData) => {
        authOptions.onFinish?.(payload);
      },
    });
  };

  function doContractCall(options: ContractCallRegularOptions): Promise<void>;
  function doContractCall(options: ContractCallSponsoredOptions): Promise<void>;
  function doContractCall(options: ContractCallOptions): Promise<void>;
  function doContractCall(options: ContractCallOptions) {
    return openContractCall({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });
  }

  function doContractDeploy(options: ContractDeployRegularOptions): Promise<void>;
  function doContractDeploy(options: ContractDeploySponsoredOptions): Promise<void>;
  function doContractDeploy(options: ContractDeployOptions): Promise<void>;
  function doContractDeploy(options: ContractDeployOptions) {
    return openContractDeploy({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });
  }

  function doSTXTransfer(options: STXTransferRegularOptions): Promise<void>;
  function doSTXTransfer(options: STXTransferSponsoredOptions): Promise<void>;
  function doSTXTransfer(options: STXTransferOptions): Promise<void>;
  function doSTXTransfer(options: STXTransferOptions) {
    return openSTXTransfer({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });
  }

  function doProfileUpdate(options: ProfileUpdateRequestOptions) {
    openProfileUpdateRequestPopup({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });
  }

  function sign(options: SignatureRequestOptions) {
    return openSignatureRequestPopup({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });
  }

  function signStructuredData(options: StructuredDataSignatureRequestOptions) {
    return openStructuredDataSignatureRequestPopup({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });
  }

  return {
    isOpen,
    isAuthenticating,
    authData,
    authOptions,
    userSession,
    doOpenAuth,
    doAuth,
    authenticate,
    doContractCall,
    doContractDeploy,
    doSTXTransfer,
    doProfileUpdate,
    sign,
    signStructuredData,
  };
};
