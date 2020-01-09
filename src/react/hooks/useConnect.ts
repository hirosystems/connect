import { useContext } from 'react';
import { authenticate, AuthOptions } from '../../auth';
import {
  ConnectContext,
  ConnectDispatchContext,
  States,
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

  const doUpdateAuthOptions = (payload: Partial<AuthOptions>) =>
    dispatch({ type: States.UPDATE_AUTH_OPTIONS, payload });

  const doChangeScreen = (newScreen: string) => dispatch({ type: newScreen });
  const doGoToIntroScreen = () => doChangeScreen(States.SCREENS_INTRO);
  const doGoToHowItWorksScreen = () =>
    doChangeScreen(States.SCREENS_HOW_IT_WORKS);
  const doGoToSignInScreen = () => doChangeScreen(States.SCREENS_SIGN_IN);

  const doOpenDataVault = (
    signIn?: boolean,
    authOptions?: Partial<AuthOptions>
  ) => {
    signIn && doGoToSignInScreen();
    authOptions && doUpdateAuthOptions(authOptions);
    dispatch({ type: States.MODAL_OPEN });
  };
  const doCloseDataVault = () => {
    dispatch({ type: States.MODAL_CLOSE });
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
    authenticate,
  };
};

export { useConnect };
