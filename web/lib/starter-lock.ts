import {
  Contract,
  TransactionBuilder,
  BASE_FEE,
  Address,
  SorobanRpc,
  scValToNative,
} from '@stellar/stellar-sdk';
import { sorobanRpc, CONTRACT_ID, getNetworkPassphrase } from './stellar';

export interface LockState {
  value: string;
  unlockTimestamp: string;
  isActive: boolean;
}

export async function readLockState(
  ownerAddress: string,
  signerPublicKey: string
): Promise<LockState | null> {
  if (!ownerAddress || !CONTRACT_ID || !signerPublicKey) return null;

  try {
    const account = await sorobanRpc.getAccount(signerPublicKey);
    const contract = new Contract(CONTRACT_ID);

    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: getNetworkPassphrase(),
    })
      .addOperation(contract.call('get_lock', new Address(ownerAddress).toScVal()))
      .setTimeout(30)
      .build();

    const sim = await sorobanRpc.simulateTransaction(tx);

    if (!SorobanRpc.Api.isSimulationSuccess(sim) || !sim.result?.retval) return null;

    const native = scValToNative(sim.result.retval);
    if (native === null || native === undefined) return null;

    return {
      value: String(native.value ?? 0),
      unlockTimestamp: String(native.unlock_timestamp ?? 0),
      isActive: Boolean(native.is_active),
    };
  } catch {
    return null;
  }
}
