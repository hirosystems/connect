import { useContext } from 'react';
import { authenticate, OptionalAuthOptions } from '../../auth';
import {
  ConnectContext,
  ConnectDispatchContext,
  MODAL_CLOSE,
  MODAL_OPEN,
  SCREENS_SIGN_IN,
  SCREENS_HOW_IT_WORKS,
  SCREENS_INTRO,
  UPDATE_AUTH_OPTIONS
} from '../components/connect/context';

const useConnectDispatch = () => {
  const dispatch = useContext(ConnectDispatchContext);
  if (!dispatch) {
    throw new Error('This must be used within the ConnectProvider component.');
  }
  return dispatch;
};

const useConnect = () => {
  const { isOpen, screen, authOptions } = useContext(ConnectContext);
  const dispatch = useConnectDispatch();

  const doUpdateAuthOptions = (payload: OptionalAuthOptions) =>
    dispatch({ type: UPDATE_AUTH_OPTIONS, payload });

  const doChangeScreen = (newScreen: string) => dispatch({ type: newScreen });
  const doGoToIntroScreen = () => doChangeScreen(SCREENS_INTRO);
  const doGoToHowItWorksScreen = () => doChangeScreen(SCREENS_HOW_IT_WORKS);
  const doGoToSignInScreen = () => doChangeScreen(SCREENS_SIGN_IN);

  const doOpenDataVault = (
    signIn?: boolean,
    authOptions?: OptionalAuthOptions
  ) => {
    signIn && doGoToSignInScreen();
    authOptions && doUpdateAuthOptions(authOptions);
    dispatch({ type: MODAL_OPEN });
  };
  const doCloseDataVault = () => {
    dispatch({ type: MODAL_CLOSE });
    setTimeout(doGoToIntroScreen, 250);
  };

  return {
    isOpen,
    authOptions,
    screen,
    doOpenDataVault,
    doCloseDataVault,
    doChangeScreen,
    doGoToIntroScreen,
    doGoToHowItWorksScreen,
    doGoToSignInScreen,
    authenticate
  };
};

export { useConnect };
