import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Keypair } from '@stellar/stellar-sdk';

const keypair = Keypair.random();
const outputPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '.env.local'
);

const content = [
  `SECRET_KEY=${keypair.secret()}`,
  `PUBLIC_KEY=${keypair.publicKey()}`,
  'STELLAR_NETWORK=testnet',
  'CONTRACT_ID=',
  '',
].join('\n');

fs.writeFileSync(outputPath, content, 'utf8');

console.log('Generated Stellar keypair:');
console.log(`- public key:  ${keypair.publicKey()}`);
console.log(`- secret key:  ${keypair.secret()}`);
console.log(`- env file:    ${outputPath}`);
console.log(`Fund via:      https://friendbot.stellar.org/?addr=${keypair.publicKey()}`);
console.log('Then build and deploy: npm run deploy');
