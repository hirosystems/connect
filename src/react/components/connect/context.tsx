import React, { useReducer, createContext } from 'react';
import { AuthOptions } from '../../../auth';

const MODAL_OPEN = 'modal/open';
const MODAL_CLOSE = 'modal/close';
const UPDATE_AUTH_OPTIONS = 'data/update-auth-options';
const SCREENS_INTRO = 'screens/intro';
const SCREENS_HOW_IT_WORKS = 'screens/how-it-works';
const SCREENS_SIGN_IN = 'screens/sign-in';

type Action = { type: string; payload?: any };

type Dispatch = (action: Action) => void;

type State = { isOpen: boolean; screen: string; authOptions: AuthOptions };

const initialState = {
  isOpen: false,
  screen: SCREENS_INTRO,
  authOptions: {
    redirectTo: '',
    manifestPath: '',
    finished: () => null,
    vaultUrl: undefined,
    sendToSignIn: false,
    appDetails: {
      name: '',
      icon: ''
    }
  }
};

const connectReducer = (
  state: State,
  { type, payload }: { type: string; payload?: any }
) => {
  switch (type) {
    case MODAL_OPEN: {
      return { ...state, isOpen: true };
    }
    case MODAL_CLOSE: {
      return { ...state, isOpen: false };
    }
    case SCREENS_INTRO: {
      return {
        ...state,
        screen: SCREENS_INTRO
      };
    }
    case SCREENS_HOW_IT_WORKS: {
      return {
        ...state,
        screen: SCREENS_HOW_IT_WORKS
      };
    }
    case SCREENS_SIGN_IN: {
      return {
        ...state,
        screen: SCREENS_SIGN_IN
      };
    }

    case UPDATE_AUTH_OPTIONS: {
      return {
        ...state,
        authOptions: {
          ...state.authOptions,
          ...payload
        }
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
  ConnectProvider,
  MODAL_OPEN,
  MODAL_CLOSE,
  SCREENS_INTRO,
  SCREENS_HOW_IT_WORKS,
  SCREENS_SIGN_IN,
  UPDATE_AUTH_OPTIONS
};
