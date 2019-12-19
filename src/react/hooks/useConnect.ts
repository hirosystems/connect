import { useContext } from 'react';
import { authenticate } from '../../auth';
import {
  ConnectContext,
  ConnectDispatchContext,
  MODAL_CLOSE,
  MODAL_OPEN,
  SCREENS_SIGN_IN,
  SCREENS_HOW_IT_WORKS,
  SCREENS_INTRO
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

  const doChangeScreen = (screen: string) => dispatch({ type: screen });
  const doGoToIntroScreen = () => doChangeScreen(SCREENS_INTRO);
  const doGoToHowItWorksScreen = () => doChangeScreen(SCREENS_HOW_IT_WORKS);
  const doGoToSignInScreen = () => doChangeScreen(SCREENS_SIGN_IN);

  const doOpenDataVault = (signIn?: boolean) => {
    signIn && doGoToSignInScreen();
    dispatch({ type: MODAL_OPEN });
  };
  const doCloseDataVault = () => {
    dispatch({ type: MODAL_CLOSE });
    setTimeout( doGoToIntroScreen, 250)
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
