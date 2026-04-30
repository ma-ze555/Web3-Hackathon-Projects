# Aptos Move Starter Kit for Smart Contract Development

This repository is a lightweight Aptos starter template split into two parts:

- `blockend/` contains the Move package, Aptos CLI deployment scripts, and TypeScript helpers.
- `web/` contains the Next.js wallet UI for publishing, reading, and executing the lock flow.

## Quick Start

1. Install dependencies in both folders.
2. Generate a deployer account.
3. Publish the Move package with the Aptos CLI.
4. Set the published module address in the frontend environment.
5. Connect Petra or Martian and use the lock workbench.

## Backend

See [`blockend/README.md`](blockend/README.md) for the Aptos Move package, deployment scripts, and command examples.

## Frontend

See [`web/README.md`](web/README.md) for the Next.js wallet setup and runtime instructions.

## Environment Variables

Backend:

- `APTOS_NETWORK`
- `APTOS_PROFILE`
- `APTOS_MODULE_ADDRESS`

Frontend:

- `NEXT_PUBLIC_APTOS_NETWORK`
- `NEXT_PUBLIC_APTOS_MODULE_ADDRESS`

## Notes

- The Move module stores lock state as a resource under the owner account.
- The `release` entry function only succeeds after the unlock timestamp passes.
- The frontend uses the Aptos wallet adapter with Petra and Martian wallet plugins.
