import React, { useReducer, createContext } from 'react';
import { AuthOptions, FinishedAuthData, UserSession } from '@stacks/connect';

enum States {
  UPDATE_AUTH_OPTIONS = 'data/update-auth-options',
}

type Action = { type: States; payload?: any };

type Dispatch = (action: Action) => void;

type State = {
  isOpen: boolean;
  isAuthenticating: boolean;
  authData?: FinishedAuthData;
  authOptions: AuthOptions;
  userSession?: UserSession;
};

const initialState: State = {
  isOpen: false,
  isAuthenticating: false,
  authData: undefined,
  userSession: undefined,
  authOptions: {
    redirectTo: '',
    manifestPath: '',
    onFinish: () => null,
    authOrigin: undefined,
    sendToSignIn: false,
    appDetails: {
      name: '',
      icon: '',
    },
  },
};

const connectReducer = (state: State, { type, payload }: { type: States; payload?: any }) => {
  switch (type) {
    case States.UPDATE_AUTH_OPTIONS: {
      return {
        ...state,
        authOptions: {
          ...state.authOptions,
          ...payload,
        },
      };
    }

    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
};

const ConnectContext = createContext<State>(initialState);

const ConnectDispatchContext = createContext<Dispatch | undefined>(undefined);

const ConnectProvider = ({
  authOptions,
  children,
}: {
  authOptions: AuthOptions;
  children: any;
}) => {
  const [state, dispatch] = useReducer(connectReducer, initialState);

  return (
    <ConnectContext.Provider value={{ ...state, authOptions }}>
      <ConnectDispatchContext.Provider value={dispatch}>{children}</ConnectDispatchContext.Provider>
    </ConnectContext.Provider>
  );
};

export {
  initialState,
  connectReducer,
  ConnectContext,
  ConnectDispatchContext,
  ConnectProvider,
  States,
};
