# Soroban Starter Kit

A minimal Stellar Soroban backend starter for deploying and interacting with the time-lock smart contract.

## Structure

- `scripts/config.ts`: Stellar network config and Soroban RPC client
- `scripts/deploy-contract.ts`: deploy the compiled `.wasm` using the Stellar CLI
- `scripts/setup-account.ts`: generate a Stellar keypair and write `.env.local`
- `scripts/submit-transaction.ts`: call `lock`, `add_to_lock`, or `release` on the contract
- `scripts/read-state.ts`: read lock state via Soroban RPC simulation

## Prerequisites

- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli)
- Node.js 18+
- A funded Stellar account for the selected network

## Setup

```bash
npm install
npm run setup:account
```

Fund the generated account at `https://friendbot.stellar.org/?addr=<PUBLIC_KEY>`.

## Deploy

Build the Rust contract first:

```bash
cd ../../contracts
cargo build --target wasm32-unknown-unknown --release
```

Then deploy:

```bash
npm run deploy
```

Set `CONTRACT_ID` in `.env.local` to the deployed contract ID.

## Interact

```bash
npm run submit -- lock <amount> <unlock_timestamp>
npm run submit -- add_to_lock <amount>
npm run submit -- release
npm run read -- <ownerAddress>
```

## Environment variables

| Variable | Description |
|---|---|
| `SECRET_KEY` | Stellar secret key (S...) |
| `PUBLIC_KEY` | Stellar public key (G...) |
| `STELLAR_NETWORK` | `testnet` \| `mainnet` \| `futurenet` |
| `CONTRACT_ID` | Deployed Soroban contract ID |
