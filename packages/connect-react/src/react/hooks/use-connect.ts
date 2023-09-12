import {
  authenticate,
  AuthOptions,
  ContractCallOptions,
  ContractCallRegularOptions,
  ContractCallSponsoredOptions,
  ContractDeployOptions,
  ContractDeployRegularOptions,
  ContractDeploySponsoredOptions,
  FinishedAuthData,
  openContractCall,
  openContractDeploy,
  openSignTransaction,
  openProfileUpdateRequestPopup,
  openPsbtRequestPopup,
  openSignatureRequestPopup,
  openStructuredDataSignatureRequestPopup,
  openSTXTransfer,
  PsbtRequestOptions,
  ProfileUpdateRequestOptions,
  showBlockstackConnect,
  SignatureRequestOptions,
  STXTransferOptions,
  STXTransferRegularOptions,
  STXTransferSponsoredOptions,
  StacksProvider,
  SignTransactionOptions,
} from '@stacks/connect';
import { StructuredDataSignatureRequestOptions } from '@stacks/connect/src/types/structuredDataSignature';
import { useContext } from 'react';
import { ConnectContext, ConnectDispatchContext, States } from '../components/connect/context';

const useConnectDispatch = () => {
  const dispatch = useContext(ConnectDispatchContext);
  if (!dispatch) {
    throw new Error('This must be used within the ConnectProvider component.');
  }
  return dispatch;
};

export const useConnect = () => {
  // todo: add custom provider injection in connect context
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
  const doOpenAuth = (
    signIn?: boolean,
    options?: Partial<AuthOptions>,
    provider?: StacksProvider
  ) => {
    if (signIn) {
      const _options: AuthOptions = {
        ...authOptions,
        ...options,
        onFinish: (payload: FinishedAuthData) => {
          authOptions.onFinish?.(payload);
        },
        sendToSignIn: true,
      };
      void authenticate(_options, provider);
      return;
    } else {
      showBlockstackConnect({
        ...authOptions,
        sendToSignIn: false,
      });
    }
    authOptions && doUpdateAuthOptions(authOptions);
  };

  const doAuth = (options: Partial<AuthOptions> = {}, provider?: StacksProvider) => {
    void authenticate(
      {
        ...authOptions,
        ...options,
        onFinish: (payload: FinishedAuthData) => {
          authOptions.onFinish?.(payload);
        },
      },
      provider
    );
  };

  function doContractCall(
    options: ContractCallOptions | ContractCallRegularOptions | ContractCallSponsoredOptions,
    provider?: StacksProvider
  ) {
    return openContractCall(
      {
        ...options,
        authOrigin: authOptions.authOrigin,
        appDetails: authOptions.appDetails,
      },
      provider
    );
  }

  function doContractDeploy(
    options: ContractDeployOptions | ContractDeployRegularOptions | ContractDeploySponsoredOptions,
    provider?: StacksProvider
  ) {
    return openContractDeploy(
      {
        ...options,
        authOrigin: authOptions.authOrigin,
        appDetails: authOptions.appDetails,
      },
      provider
    );
  }

  function doSTXTransfer(
    options: STXTransferOptions | STXTransferRegularOptions | STXTransferSponsoredOptions,
    provider?: StacksProvider
  ) {
    return openSTXTransfer(
      {
        ...options,
        authOrigin: authOptions.authOrigin,
        appDetails: authOptions.appDetails,
      },
      provider
    );
  }

  function doProfileUpdate(options: ProfileUpdateRequestOptions, provider?: StacksProvider) {
    return openProfileUpdateRequestPopup(
      {
        ...options,
        authOrigin: authOptions.authOrigin,
        appDetails: authOptions.appDetails,
      },
      provider
    );
  }

  function doSignTransaction(options: SignTransactionOptions, provider?: StacksProvider) {
    return openSignTransaction(
      {
        ...options,
        authOrigin: authOptions.authOrigin,
        appDetails: authOptions.appDetails,
      },
      provider
    );
  }

  function sign(options: SignatureRequestOptions, provider?: StacksProvider) {
    return openSignatureRequestPopup(
      {
        ...options,
        authOrigin: authOptions.authOrigin,
        appDetails: authOptions.appDetails,
      },
      provider
    );
  }

  function signStructuredData(
    options: StructuredDataSignatureRequestOptions,
    provider?: StacksProvider
  ) {
    return openStructuredDataSignatureRequestPopup(
      {
        ...options,
        authOrigin: authOptions.authOrigin,
        appDetails: authOptions.appDetails,
      },
      provider
    );
  }

  function signPsbt(options: PsbtRequestOptions, provider?: StacksProvider) {
    return openPsbtRequestPopup(
      {
        ...options,
        authOrigin: authOptions.authOrigin,
        appDetails: authOptions.appDetails,
      },
      provider
    );
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
    doSignTransaction,
    doProfileUpdate,
    sign,
    signStructuredData,
    signPsbt,
  };
};
