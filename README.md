# Stellar Soroban Starter Kit for Smart Contract Development

This repository is a lightweight **Stellar Soroban starter template** split into two parts:

* **blockend/** contains the Soroban smart contract (Rust), deployment scripts, and helper utilities
* **web/** contains the Next.js wallet UI for deploying, reading, and interacting with the contract

---

## ⚡ Quick Start

1. Install dependencies in both folders:

```bash
cd blockend
cargo build

cd ../web
npm install
```

2. Configure your Stellar account:

* Install Stellar CLI
* Generate a keypair
* Fund your account (testnet or futurenet)

3. Build and deploy the contract:

```bash
cd blockend
soroban contract build
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/<contract>.wasm
```

4. Copy the deployed **contract ID**

5. Set the contract ID in the frontend environment variables

6. Start the frontend:

```bash
cd web
npm run dev
```

7. Connect your wallet (Freighter) and interact with the contract

---

## 🧠 Backend

See **blockend/README.md** for:

* Soroban smart contract (Rust)
* Deployment scripts
* CLI command examples

---

## 🎨 Frontend

See **web/README.md** for:

* Next.js wallet integration
* Contract interaction setup
* Runtime instructions

---

## 🔐 Environment Variables

### Backend

```env
STELLAR_NETWORK=testnet | futurenet
STELLAR_SECRET_KEY=your_secret_key
```

### Frontend

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet | futurenet
NEXT_PUBLIC_CONTRACT_ID=your_contract_id
```

---

## 🧩 Notes

* Contract state is stored using Soroban storage (not Move resources)
* Access control must be handled explicitly in contract logic
* The contract enforces time-based conditions (e.g., lock/unlock) within its functions
* The frontend uses Stellar wallet integration (e.g., Freighter)

---

## ⚠️ Important

* Do not expose private keys in your codebase
* Always test on testnet/futurenet before deploying to mainnet
* Validate all inputs in smart contract functions
* Keep contract logic minimal and secure

---

## 🎯 Purpose

This project serves as a **minimal starter template** for:

* Building Stellar Soroban smart contracts
* Creating full-stack dApps with Rust + Next.js
* Rapid prototyping of blockchain applications

---

**A clean, simple foundation for building on Stellar.**
