# Aptos Move Starter Kit Frontend

This Next.js app is the lightweight interaction layer for the Aptos Move starter kit.

## Setup

1. Install dependencies.
2. Set `NEXT_PUBLIC_APTOS_NETWORK` to `devnet`, `testnet`, or `mainnet`.
3. Set `NEXT_PUBLIC_APTOS_MODULE_ADDRESS` to the published Aptos account address.

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) after the dev server starts.

## What the UI does

- Connects Aptos wallets through the wallet adapter provider.
- Supports Petra and Martian.
- Initializes the time-lock, adds to the lock, reads state, and releases it after expiry.

## Recommended flow

1. Publish the Move package from `blockend`.
2. Copy the deployer account address into `NEXT_PUBLIC_APTOS_MODULE_ADDRESS`.
3. Connect Petra or Martian in the UI.
4. Use the workbench to create and release the lock.
