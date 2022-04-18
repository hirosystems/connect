import { UserSession } from '@stacks/auth';

export interface AccountsRequestOptions {
  manifestPath?: string;
  onFinish?: (payload: FinishedAccountsData) => void;
  onCancel?: () => void;
  userSession?: UserSession;
  appDetails: {
    name: string;
    icon: string;
  };
}

export interface FinishedAccountsData {
  accounts: string[];
}
