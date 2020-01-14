import React, { useReducer, createContext } from 'react';
import { AuthOptions } from '../../../auth';

enum States {
  MODAL_OPEN = 'modal/open',
  MODAL_CLOSE = 'modal/close',
  UPDATE_AUTH_OPTIONS = 'data/update-auth-options',
  SCREENS_INTRO = 'screens/intro',
  SCREENS_HOW_IT_WORKS = 'screens/how-it-works',
  SCREENS_SIGN_IN = 'screens/sign-in',
}

type Action = { type: string; payload?: any };

type Dispatch = (action: Action) => void;

type State = { isOpen: boolean; screen: string; authOptions: AuthOptions };

const initialState: State = {
  isOpen: false,
  screen: States.SCREENS_INTRO,
  authOptions: {
    redirectTo: '',
    manifestPath: '',
    finished: () => null,
    vaultUrl: undefined,
    sendToSignIn: false,
    appDetails: {
      name: '',
      icon: '',
    },
  },
};

const connectReducer = (state: State, { type, payload }: { type: string; payload?: any }) => {
  switch (type) {
    case States.MODAL_OPEN: {
      return { ...state, isOpen: true };
    }
    case States.MODAL_CLOSE: {
      return { ...state, isOpen: false };
    }
    case States.SCREENS_INTRO: {
      return {
        ...state,
        screen: States.SCREENS_INTRO,
      };
    }
    case States.SCREENS_HOW_IT_WORKS: {
      return {
        ...state,
        screen: States.SCREENS_HOW_IT_WORKS,
      };
    }
    case States.SCREENS_SIGN_IN: {
      return {
        ...state,
        screen: States.SCREENS_SIGN_IN,
      };
    }

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

const ConnectProvider = ({ authOptions, children }: { authOptions: AuthOptions; children: any }) => {
  const [state, dispatch] = useReducer(connectReducer, initialState);
  return (
    <ConnectContext.Provider value={{ ...state, authOptions }}>
      <ConnectDispatchContext.Provider value={dispatch}>{children}</ConnectDispatchContext.Provider>
    </ConnectContext.Provider>
  );
};

export { initialState, connectReducer, ConnectContext, ConnectDispatchContext, ConnectProvider, States };
