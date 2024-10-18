import { StacksNetwork } from '@stacks/network';
import { StacksNetwork as LegacyNetwork, StacksNetworkName } from '@stacks/network-v6';

/**
 * ⚠️ Warning: The new Stacks.js v7 network type is still experimental.
 */
export type ConnectNetwork =
  | StacksNetworkName
  | LegacyNetwork
  | StacksNetwork
  | {
      url: string /** @experimental For backwards compatibility to allow selecting user-defined network, if network URL exists in users wallet */;
    };
