import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

export type AptosNetworkName = 'devnet' | 'testnet' | 'mainnet';

export const MODULE_ADDRESS = process.env.APTOS_MODULE_ADDRESS ?? '';
export const MODULE_NAME = 'starter_lock';
export const PROFILE_NAME = process.env.APTOS_PROFILE ?? 'default';
export const PACKAGE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'aptos'
);

export function resolveNetwork(): Network {
  switch ((process.env.APTOS_NETWORK ?? 'testnet').toLowerCase()) {
    case 'mainnet':
      return Network.MAINNET;
    case 'devnet':
      return Network.DEVNET;
    default:
      return Network.TESTNET;
  }
}

export function getAptosClient() {
  return new Aptos(
    new AptosConfig({
      network: resolveNetwork(),
    })
  );
}

export function getModuleId(address: string = MODULE_ADDRESS) {
  if (!address) {
    throw new Error('APTOS_MODULE_ADDRESS is required');
  }

  return `${address}::${MODULE_NAME}`;
}
