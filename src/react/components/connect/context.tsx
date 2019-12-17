import React, { useReducer, createContext } from 'react';
import { AuthOptions } from '../../../auth';

type Action = { type: 'open' } | { type: 'close' };
type Dispatch = (action: Action) => void;
type State = { isOpen: boolean; authOptions: AuthOptions };

const initialState = {
  isOpen: false,
  authOptions: {
    redirectTo: '',
    manifestPath: '',
    finished: () => null,
    vaultUrl: undefined,
    sendToSignIn: false
  }
};

// @ts-ignore
const connectReducer = (state, { type }) => {
  switch (type) {
    case 'open': {
      return { isOpen: true };
    }
    case 'close': {
      return { isOpen: false };
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
  children
}: {
  authOptions: AuthOptions;
  children: any;
}) => {
  const [state, dispatch] = useReducer(connectReducer, initialState);
  return (
    <ConnectContext.Provider value={{ ...state, authOptions }}>
      <ConnectDispatchContext.Provider value={dispatch}>
        {children}
      </ConnectDispatchContext.Provider>
    </ConnectContext.Provider>
  );
};

export {
  initialState,
  connectReducer,
  ConnectContext,
  ConnectDispatchContext,
  ConnectProvider
};
