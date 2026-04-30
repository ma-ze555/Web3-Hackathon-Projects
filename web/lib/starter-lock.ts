import { aptos, getLockModuleId } from "./aptos";

export interface LockState {
  owner: string;
  beneficiary: string;
  amount: string;
  unlockAtSeconds: string;
  released: boolean;
  withdrawnAmount: string;
}

export async function readLockState(ownerAddress: string): Promise<LockState | null> {
  if (!ownerAddress) {
    return null;
  }

  try {
    const moduleId = getLockModuleId();

    const result = await aptos.view({
      payload: {
        function: `${moduleId}::get_lock`,
        functionArguments: [ownerAddress],
      },
    });

    const [owner, beneficiary, amount, unlockAtSeconds, released, withdrawnAmount] =
      result as [string, string, string | number, string | number, boolean, string | number];

    return {
      owner,
      beneficiary,
      amount: String(amount),
      unlockAtSeconds: String(unlockAtSeconds),
      released: Boolean(released),
      withdrawnAmount: String(withdrawnAmount),
    };
  } catch {
    return null;
  }
}
