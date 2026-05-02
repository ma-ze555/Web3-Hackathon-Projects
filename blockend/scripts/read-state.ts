import {
  Keypair,
  Contract,
  TransactionBuilder,
  BASE_FEE,
  Address,
} from '@stellar/stellar-sdk';
import { CONTRACT_ID, SECRET_KEY, getSorobanRpc, resolveNetworkPassphrase } from './config.js';

const ownerAddress = process.argv[2];

if (!ownerAddress) {
  throw new Error('Usage: npm run read -- <ownerAddress>');
}

if (!CONTRACT_ID) {
  throw new Error('CONTRACT_ID is required');
}

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is required');
}

async function main() {
  const server = getSorobanRpc();
  const keypair = Keypair.fromSecret(SECRET_KEY);
  const account = await server.getAccount(keypair.publicKey());
  const contract = new Contract(CONTRACT_ID);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: resolveNetworkPassphrase(),
  })
    .addOperation(contract.call('get_lock', new Address(ownerAddress).toScVal()))
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
