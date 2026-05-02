import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const network = (process.env.STELLAR_NETWORK ?? 'testnet').toLowerCase();
const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error('SECRET_KEY is required for deployment');
}

const wasmPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'contracts',
  'target',
  'wasm32-unknown-unknown',
  'release',
  'time_lock.wasm'
);

const result = spawnSync(
  'stellar',
  [
    'contract',
    'deploy',
    '--wasm',
    wasmPath,
    '--source',
    secretKey,
    '--network',
    network,
  ],
  { stdio: 'inherit', shell: true }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
