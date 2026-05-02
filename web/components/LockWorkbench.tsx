"use client";

import { Button } from "@/components/ui/button";
import {
  sorobanRpc,
  CONTRACT_ID,
  HAS_CONTRACT_ID,
  getContractId,
  getNetworkPassphrase,
  freighterNetworkName,
} from "@/lib/stellar";
import { readLockState, type LockState } from "@/lib/starter-lock";
import { useQuery } from "@tanstack/react-query";
import {
  Contract,
  TransactionBuilder,
  Transaction,
  BASE_FEE,
  Address,
  nativeToScVal,
} from "@stellar/stellar-sdk";
import { ArrowUpRight, RefreshCw, TimerReset } from "lucide-react";
import { useState } from "react";

interface Props {
  publicKey: string;
}

export function LockWorkbench({ publicKey }: Props) {
  const [amount, setAmount] = useState("1000000");
  const [unlockDelay, setUnlockDelay] = useState("3600");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const lockQuery = useQuery({
    queryKey: ["lock-state", publicKey],
    queryFn: () => readLockState(publicKey, publicKey),
    enabled: Boolean(publicKey && HAS_CONTRACT_ID),
    refetchInterval: 15_000,
  });

  const lockState: LockState | null = lockQuery.data ?? null;

  const submit = async (functionName: "lock" | "add_to_lock" | "release") => {
    if (!HAS_CONTRACT_ID) throw new Error("Set NEXT_PUBLIC_CONTRACT_ID first.");
    if (!publicKey) throw new Error("Connect a Stellar wallet first.");

    setSubmitting(true);
    setStatus("");

    try {
      const freighter = await import("@stellar/freighter-api");
      const account = await sorobanRpc.getAccount(publicKey);
      const contract = new Contract(getContractId());
      const caller = new Address(publicKey);
      const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + Number(unlockDelay));

      const callArgs = {
        lock: [
          caller.toScVal(),
          nativeToScVal(BigInt(amount), { type: "i128" }),
          nativeToScVal(unlockTimestamp, { type: "u64" }),
        ],
        add_to_lock: [
          caller.toScVal(),
          nativeToScVal(BigInt(amount), { type: "i128" }),
        ],
        release: [caller.toScVal()],
      }[functionName];

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: getNetworkPassphrase(),
      })
        .addOperation(contract.call(functionName, ...callArgs))
        .setTimeout(30)
        .build();

      const prepared = await sorobanRpc.prepareTransaction(tx);

      const { signedTxXdr, error } = await freighter.signTransaction(
        prepared.toXDR(),
        {
          network: freighterNetworkName(),
          networkPassphrase: getNetworkPassphrase(),
          accountToSign: publicKey,
        }
      );

      if (error) throw new Error(error);

      const signed = TransactionBuilder.fromXDR(
        signedTxXdr,
        getNetworkPassphrase()
      ) as Transaction;

      const result = await sorobanRpc.sendTransaction(signed);
      await lockQuery.refetch();
      setStatus(`Transaction submitted: ${result.hash}`);
    } catch (e: unknown) {
      setStatus(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-200">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">
            Lock amount (stroops)
          </span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000000"
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 font-mono text-sm outline-none transition placeholder:text-slate-500 focus:border-teal-300/60"
          />
        </label>
        <label className="space-y-2 text-sm text-slate-200">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">
            Unlock delay (seconds)
          </span>
          <input
            value={unlockDelay}
            onChange={(e) => setUnlockDelay(e.target.value)}
            placeholder="3600"
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 font-mono text-sm outline-none transition placeholder:text-slate-500 focus:border-teal-300/60"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button
          type="button"
          className="justify-center gap-2"
          disabled={!publicKey || submitting || !HAS_CONTRACT_ID}
          onClick={() => submit("lock")}
        >
          <ArrowUpRight className="h-4 w-4" />
          Lock
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="justify-center gap-2"
          disabled={!publicKey || submitting || !HAS_CONTRACT_ID}
          onClick={() => submit("add_to_lock")}
        >
          <TimerReset className="h-4 w-4" />
          Add To Lock
        </Button>
        <Button
          type="button"
          variant="outline"
          className="justify-center gap-2 border-white/10 bg-white/5"
          disabled={!publicKey || submitting || !HAS_CONTRACT_ID}
          onClick={() => submit("release")}
        >
          <RefreshCw className="h-4 w-4" />
          Release
        </Button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Current state
          </span>
          <button
            type="button"
            onClick={() => lockQuery.refetch()}
            className="text-xs text-teal-200 transition hover:text-teal-100"
          >
            Refresh
          </button>
        </div>
        <div className="mt-4 space-y-2 font-mono text-xs text-slate-300">
          {lockQuery.isLoading && <p>Loading state...</p>}
          {!lockQuery.isLoading && !lockState && <p>No lock found.</p>}
          {lockState && (
            <>
              <p>Value: {lockState.value}</p>
              <p>
                Unlocks at:{" "}
                {new Date(Number(lockState.unlockTimestamp) * 1000).toLocaleString()}
              </p>
              <p>Active: {lockState.isActive ? "yes" : "no"}</p>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
        <p className="font-medium">Contract ID</p>
        <p className="mt-2 break-all font-mono text-xs text-amber-100/90">
          {HAS_CONTRACT_ID ? CONTRACT_ID : "Set NEXT_PUBLIC_CONTRACT_ID"}
        </p>
        <p className="mt-2 text-amber-100/80">
          Configure <span className="font-mono">NEXT_PUBLIC_CONTRACT_ID</span> before using the UI.
        </p>
      </div>

      {status && (
        <p
          className={`text-sm ${
            status.startsWith("Error") ? "text-red-300" : "text-emerald-200"
          }`}
        >
          {status}
        </p>
      )}
      {lockQuery.error && (
        <p className="text-sm text-red-300">{String(lockQuery.error)}</p>
      )}
    </div>
  );
}
