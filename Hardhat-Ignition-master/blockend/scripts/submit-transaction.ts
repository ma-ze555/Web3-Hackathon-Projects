import { spawnSync } from 'node:child_process';
import { MODULE_ADDRESS, MODULE_NAME, PROFILE_NAME } from './config.js';

const [commandName, ...args] = process.argv.slice(2);

if (!MODULE_ADDRESS) {
  throw new Error('APTOS_MODULE_ADDRESS is required for transaction submission');
}

if (!commandName) {
  throw new Error('Usage: npm run submit -- <initialize|add|release> [args...]');
}

const functionId = `${MODULE_ADDRESS}::${MODULE_NAME}::${commandName}`;
const result = spawnSync(
  'aptos',
  [
    'move',
    'run',
    '--profile',
    PROFILE_NAME,
    '--function-id',
    functionId,
    '--args',
    ...args,
  ],
  { stdio: 'inherit', shell: true }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
