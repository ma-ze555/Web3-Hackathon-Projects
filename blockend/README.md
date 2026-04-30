# Aptos Move Starter Kit for Smart Contract Development

This package is a minimal Aptos Move backend starter.

## Structure

- `aptos/Move.toml`: Aptos package manifest
- `aptos/sources/starter_lock.move`: time-locked resource module
- `scripts/setup-account.ts`: generate a local deployer config
- `scripts/publish-module.ts`: publish the Move package with the Aptos CLI
- `scripts/submit-transaction.ts`: submit entry-function transactions through the Aptos CLI
- `scripts/read-state.ts`: read lock state with the Aptos TypeScript SDK

## Prerequisites

- Aptos CLI
- Node.js 18+
- A funded Aptos account for the selected network

## Setup

```bash
cd blockend
npm install
npm run setup:account
```

The setup script writes `.env.local` with a generated account address and private key. Fund that account with the Aptos faucet or your preferred funding flow before publishing.

## Deploy

```bash
npm run deploy
```

Set `APTOS_MODULE_ADDRESS` to the deployer account address before publishing. The script calls the Aptos CLI and uses the `starter_lock` named address.

## Interact

```bash
npm run submit -- initialize 0xYOUR_BENEFICIARY 1000000 3600
npm run submit -- add_to_lock 250000
npm run submit -- release
npm run read -- 0xYOUR_OWNER_ADDRESS
```

## Notes

- The module stores lock state as a resource under the owner account.
- `release` only succeeds after the configured unlock timestamp.
- Keep `APTOS_NETWORK`, `APTOS_PROFILE`, and `APTOS_MODULE_ADDRESS` in sync across scripts and the frontend.
