import 'dotenv/config';
import { SorobanRpc, Networks } from '@stellar/stellar-sdk';

export const CONTRACT_ID = process.env.CONTRACT_ID ?? '';
export const SECRET_KEY = process.env.SECRET_KEY ?? '';

export function resolveNetworkPassphrase(): string {
  switch ((process.env.STELLAR_NETWORK ?? 'testnet').toLowerCase()) {
    case 'mainnet':
      return Networks.PUBLIC;
    case 'futurenet':
      return Networks.FUTURENET;
    default:
      return Networks.TESTNET;
  }
}

export function getRpcUrl(): string {
  switch ((process.env.STELLAR_NETWORK ?? 'testnet').toLowerCase()) {
    case 'mainnet':
      return 'https://mainnet.stellar.validationcloud.io/v1/soroban/rpc';
    case 'futurenet':
      return 'https://rpc-futurenet.stellar.org';
    default:
      return 'https://soroban-testnet.stellar.org';
  }
}

export function getSorobanRpc() {
  return new SorobanRpc.Server(getRpcUrl());
}
