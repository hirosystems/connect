import { getProviderFromId, getSelectedProviderId } from '@stacks/connect-ui';
import { TransactionVersion } from '@stacks/network';
import {
  StacksMainnet as LegacyStacksMainnet,
  StacksNetwork as LegacyStacksNetwork,
  StacksTestnet as LegacyStacksTestnet,
} from '@stacks/network-v6';
import { Address, Cl, ClarityValue } from '@stacks/transactions';
import {
  ClarityType as LegacyClarityType,
  ClarityValue as LegacyClarityValue,
} from '@stacks/transactions-v6';
import { ConnectNetwork } from './types';

/** @deprecated This will default to the legacy provider. The behavior may be undefined with competing wallets. */
export function getStacksProvider() {
  const provider = getProviderFromId(getSelectedProviderId());
  return provider || (window as any).StacksProvider || (window as any).BlockstackProvider;
}

export function isStacksWalletInstalled() {
  return !!getStacksProvider();
}

/** @internal */
export function legacyNetworkFromConnectNetwork(network?: ConnectNetwork): LegacyStacksNetwork {
  if (!network) return new LegacyStacksTestnet();
  if (typeof network === 'string') return LegacyStacksNetwork.fromName(network);
  if ('version' in network) return network; // legacy type

  if ('url' in network) return new LegacyStacksMainnet({ url: network.url }); // experimental

  return network.transactionVersion === (TransactionVersion.Mainnet as number)
    ? new LegacyStacksMainnet({ url: network.client.baseUrl })
    : new LegacyStacksTestnet({ url: network.client.baseUrl });
}

/**
 * @internal
 * This may be moved to Stacks.js in the future.
 */
export function legacyCVToCV(cv: LegacyClarityValue | ClarityValue): ClarityValue {
  if (typeof cv.type === 'string') return cv;

  switch (cv.type) {
    case LegacyClarityType.BoolFalse:
      return Cl.bool(false);
    case LegacyClarityType.BoolTrue:
      return Cl.bool(true);
    case LegacyClarityType.Int:
      return Cl.int(cv.value);
    case LegacyClarityType.UInt:
      return Cl.uint(cv.value);
    case LegacyClarityType.Buffer:
      return Cl.buffer(cv.buffer);
    case LegacyClarityType.StringASCII:
      return Cl.stringAscii(cv.data);
    case LegacyClarityType.StringUTF8:
      return Cl.stringUtf8(cv.data);
    case LegacyClarityType.List:
      return Cl.list(cv.list.map(legacyCVToCV));
    case LegacyClarityType.Tuple:
      return Cl.tuple(
        Object.fromEntries(Object.entries(cv.data).map(([k, v]) => [k, legacyCVToCV(v)]))
      );
    case LegacyClarityType.OptionalNone:
      return Cl.none();
    case LegacyClarityType.OptionalSome:
      return Cl.some(legacyCVToCV(cv.value));
    case LegacyClarityType.ResponseErr:
      return Cl.error(legacyCVToCV(cv.value));
    case LegacyClarityType.ResponseOk:
      return Cl.ok(legacyCVToCV(cv.value));
    case LegacyClarityType.PrincipalContract:
      return Cl.contractPrincipal(Address.stringify(cv.address), cv.contractName.content);
    case LegacyClarityType.PrincipalStandard:
      return Cl.standardPrincipal(Address.stringify(cv.address));
    default:
      const _exhaustiveCheck: never = cv;
      throw new Error(`Unknown clarity type: ${_exhaustiveCheck}`);
  }
}
