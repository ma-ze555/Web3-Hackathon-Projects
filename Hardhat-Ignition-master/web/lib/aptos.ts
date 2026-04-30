import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const APTOS_NETWORK = (process.env.NEXT_PUBLIC_APTOS_NETWORK ?? "testnet").toLowerCase();
export const APTOS_MODULE_ADDRESS = process.env.NEXT_PUBLIC_APTOS_MODULE_ADDRESS ?? "";
export const APTOS_MODULE_NAME = "starter_lock";

export function resolveNetwork() {
  switch (APTOS_NETWORK) {
    case "mainnet":
      return Network.MAINNET;
    case "devnet":
      return Network.DEVNET;
    default:
      return Network.TESTNET;
  }
}

export const aptos = new Aptos(
  new AptosConfig({
    network: resolveNetwork(),
  })
);

export function getLockModuleId(address: string = APTOS_MODULE_ADDRESS) {
  if (!address) {
    throw new Error("NEXT_PUBLIC_APTOS_MODULE_ADDRESS is required");
  }

  return `${address}::${APTOS_MODULE_NAME}`;
}

export function tryGetLockModuleId() {
  return APTOS_MODULE_ADDRESS ? getLockModuleId(APTOS_MODULE_ADDRESS) : null;
}
