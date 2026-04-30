import fs from 'node:fs';
import path from 'node:path';
import { Account } from '@aptos-labs/ts-sdk';
import { PACKAGE_DIR } from './config.js';

const account = Account.generate();
const outputPath = path.resolve(PACKAGE_DIR, '..', '.env.local');
const content = [
  `APTOS_ACCOUNT_ADDRESS=${account.accountAddress.toString()}`,
  `APTOS_ACCOUNT_PRIVATE_KEY=${account.privateKey.toString()}`,
  'APTOS_NETWORK=testnet',
  `APTOS_MODULE_ADDRESS=${account.accountAddress.toString()}`,
  'APTOS_PROFILE=default',
  '',
].join('\n');

fs.writeFileSync(outputPath, content, 'utf8');

console.log('Generated Aptos account configuration:');
console.log(`- address: ${account.accountAddress.toString()}`);
console.log(`- private key: ${account.privateKey.toString()}`);
console.log(`- env file: ${outputPath}`);
console.log('Fund this account with the Aptos faucet, then publish the module with npm run deploy.');
