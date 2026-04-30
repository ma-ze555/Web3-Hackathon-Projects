import { spawnSync } from 'node:child_process';
import { PACKAGE_DIR, PROFILE_NAME } from './config.js';

const moduleAddress = process.env.APTOS_MODULE_ADDRESS;

if (!moduleAddress) {
  throw new Error('APTOS_MODULE_ADDRESS is required for publishing');
}

const result = spawnSync(
  'aptos',
  [
    'move',
    'publish',
    '--package-dir',
    PACKAGE_DIR,
    '--profile',
    PROFILE_NAME,
    '--named-addresses',
    `squid_chain_starter=${moduleAddress}`,
    '--assume-yes',
  ],
  { stdio: 'inherit', shell: true }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
