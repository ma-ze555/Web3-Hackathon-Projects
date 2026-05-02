import {
  Keypair,
  Contract,
  TransactionBuilder,
  Transaction,
  BASE_FEE,
  Address,
  nativeToScVal,
  xdr,
} from '@stellar/stellar-sdk';
import { CONTRACT_ID, SECRET_KEY, getSorobanRpc, resolveNetworkPassphrase } from './config.js';

const [functionName, ...args] = process.argv.slice(2);

if (!functionName) {
  throw new Error('Usage: npm run submit -- <lock|add_to_lock|release> [args...]');
}

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY is required');
}

if (!CONTRACT_ID) {
  throw new Error('CONTRACT_ID is required');
}

async function main() {
  const server = getSorobanRpc();
  const network = resolveNetworkPassphrase();
  const keypair = Keypair.fromSecret(SECRET_KEY);
  const account = await server.getAccount(keypair.publicKey());
  const contract = new Contract(CONTRACT_ID);
  const callerAddress = new Address(keypair.publicKey());

  let txArgs: xdr.ScVal[] = [];

  switch (functionName) {
    case 'lock': {
      const [amount, unlockTimestamp] = args;
      txArgs = [
        callerAddress.toScVal(),
        nativeToScVal(BigInt(amount), { type: 'i128' }),
        nativeToScVal(BigInt(unlockTimestamp), { type: 'u64' }),
      ];
      break;
    }
    case 'add_to_lock': {
      const [amount] = args;
      txArgs = [
        callerAddress.toScVal(),
        nativeToScVal(BigInt(amount), { type: 'i128' }),
      ];
      break;
    }
    case 'release': {
      txArgs = [callerAddress.toScVal()];
      break;
    }
    default:
      throw new Error(`Unknown function: ${functionName}. Use lock, add_to_lock, or release.`);
  }

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: network,
  })
    .addOperation(contract.call(functionName, ...txArgs))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  (prepared as Transaction).sign(keypair);

  const result = await server.sendTransaction(prepared as Transaction);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
