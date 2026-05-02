"use client";

import { LockWorkbench } from "@/components/LockWorkbench";
import { WalletConnector } from "@/components/WalletConnector";
import { motion } from "framer-motion";
import { ArrowRight, Blocks, ShieldCheck, TimerReset } from "lucide-react";
import { useState } from "react";

const highlights = [
  {
    icon: Blocks,
    title: "Persistent contract state",
    description:
      "The Soroban contract stores lock data in persistent ledger entries keyed by the owner address.",
  },
  {
    icon: TimerReset,
    title: "Time-locked release",
    description:
      "A release call only succeeds after the configured unlock timestamp has passed.",
  },
  {
    icon: ShieldCheck,
    title: "Wallet-led execution",
    description:
      "Freighter is wired for signing and submitting Soroban transactions from the browser.",
  },
];

export default function HomePage() {
  const [publicKey, setPublicKey] = useState("");

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.24),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#04111b_0%,_#07131f_45%,_#081521_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-teal-200">
                Soroban Starter Kit
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
              >
                A clean Soroban launchpad for time-locked contracts, CLI
                publishing, and wallet-first interaction.
              </motion.h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Built on Stellar Soroban with Rust smart contracts, Stellar CLI
                deploy scripts, and a Next.js front end using the Freighter
                wallet.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Soroban contract
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Stellar CLI deploy
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">
                Freighter wallet
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {highlights.map((item) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <item.icon className="mb-4 h-5 w-5 text-teal-300" />
                <h2 className="text-lg font-medium text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-teal-200">
                  Deployment flow
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Build the Soroban contract and wire the contract ID into the
                  app.
                </h2>
              </div>
              <ArrowRight className="hidden h-5 w-5 text-teal-200 lg:block" />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                [
                  "1. Setup account",
                  "Run the account setup script to generate a Stellar keypair.",
                ],
                [
                  "2. Fund wallet",
                  "Use Friendbot or the Stellar faucet before deploying the contract.",
                ],
                [
                  "3. Deploy contract",
                  "Build the Rust contract and deploy using the Stellar CLI script.",
                ],
                [
                  "4. Interact",
                  "Connect Freighter and submit lock transactions from the UI.",
                ],
              ].map(([step, text]) => (
                <div
                  key={step}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-medium text-teal-200">{step}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
                    Wallet access
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Connect a Stellar wallet.
                  </h2>
                </div>
              </div>
              <WalletConnector
                publicKey={publicKey}
                onConnect={setPublicKey}
                onDisconnect={() => setPublicKey("")}
              />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
                Interaction layer
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Lock, add, and release.
              </h2>
              <LockWorkbench publicKey={publicKey} />
            </motion.section>
          </div>
        </section>
      </div>
    </main>
  );
}
