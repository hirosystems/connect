import { useContext } from 'react';
import { authenticate } from '../../auth';
import {
  ConnectContext,
  ConnectDispatchContext
} from '../components/connect/context';

const useConnect = () => {
  const { isOpen, authOptions } = useContext(ConnectContext);
  const dispatch = useContext(ConnectDispatchContext);
  const doOpenDataVault = () => {
    // @ts-ignore
    dispatch({ type: 'open' });
  };

  const doCloseDataVault = () => {
    // @ts-ignore
    dispatch({ type: 'close' });
  };

  return {
    isOpen,
    authOptions,
    doOpenDataVault,
    doCloseDataVault,
    authenticate
  };
};

export { useConnect };
