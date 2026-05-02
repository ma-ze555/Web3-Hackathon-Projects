import { SorobanRpc, Networks } from '@stellar/stellar-sdk';

export const STELLAR_NETWORK = (process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? 'testnet').toLowerCase();
export const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID ?? '';
export const HAS_CONTRACT_ID = Boolean(CONTRACT_ID);

export function getRpcUrl(): string {
  switch (STELLAR_NETWORK) {
    case 'mainnet':
      return 'https://mainnet.stellar.validationcloud.io/v1/soroban/rpc';
    case 'futurenet':
      return 'https://rpc-futurenet.stellar.org';
    default:
      return 'https://soroban-testnet.stellar.org';
  }
}

export function getNetworkPassphrase(): string {
  switch (STELLAR_NETWORK) {
    case 'mainnet':
      return Networks.PUBLIC;
    case 'futurenet':
      return Networks.FUTURENET;
    default:
      return Networks.TESTNET;
  }
}

export function freighterNetworkName(): string {
  switch (STELLAR_NETWORK) {
    case 'mainnet':
      return 'PUBLIC';
    case 'futurenet':
      return 'FUTURENET';
    default:
      return 'TESTNET';
  }
}

export const sorobanRpc = new SorobanRpc.Server(getRpcUrl());

export function getContractId(id: string = CONTRACT_ID): string {
  if (!id) throw new Error('NEXT_PUBLIC_CONTRACT_ID is required');
  return id;
}
