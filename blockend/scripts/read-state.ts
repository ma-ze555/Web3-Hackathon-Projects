import { getAptosClient, getModuleId } from './config.js';

const ownerAddress = process.argv[2];

if (!ownerAddress) {
  throw new Error('Usage: npm run read -- <ownerAddress>');
}

async function main() {
  const aptos = getAptosClient();
  const result = await aptos.view({
    payload: {
      function: `${getModuleId()}::get_lock`,
      functionArguments: [ownerAddress],
    },
  });

  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
