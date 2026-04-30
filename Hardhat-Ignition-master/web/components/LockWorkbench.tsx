"use client";

import { Button } from "@/components/ui/button";
import { aptos, getLockModuleId, HAS_APTOS_MODULE_ADDRESS } from "@/lib/aptos";
import { readLockState, type LockState } from "@/lib/starter-lock";
import { shortenAddress } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, RefreshCw, TimerReset } from "lucide-react";
import { useEffect, useState } from "react";

const DEFAULT_UNLOCK_DELAY = 3600;

export function LockWorkbench() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  const ownerAddress = account?.address?.toString() ?? "";
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("1000000");
  const [unlockDelay, setUnlockDelay] = useState(String(DEFAULT_UNLOCK_DELAY));
  const [status, setStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ownerAddress && !beneficiary) {
      setBeneficiary(ownerAddress);
    }
  }, [beneficiary, ownerAddress]);

  const lockQuery = useQuery({
    queryKey: ["starter-lock-state", ownerAddress],
    queryFn: async () => readLockState(ownerAddress),
    enabled: Boolean(ownerAddress && HAS_APTOS_MODULE_ADDRESS),
    refetchInterval: 15_000,
  });

  const lockState: LockState | null = lockQuery.data ?? null;

  const submit = async (
    functionName: "initialize" | "add_to_lock" | "release",
    args: Array<string | number>
  ) => {
    if (!HAS_APTOS_MODULE_ADDRESS) {
      throw new Error(
        "Set NEXT_PUBLIC_APTOS_MODULE_ADDRESS before submitting transactions."
      );
    }

    if (!connected || !ownerAddress) {
      throw new Error("Connect an Aptos wallet first.");
    }

    setSubmitting(true);
    setStatus("");

    try {
      const transaction = await signAndSubmitTransaction({
        data: {
          function: `${getLockModuleId()}::${functionName}`,
          functionArguments: args,
        },
      });

      await aptos.waitForTransaction({ transactionHash: transaction.hash });
      await lockQuery.refetch();
      setStatus(`Transaction confirmed: ${transaction.hash}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-slate-200">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">
            Beneficiary address
          </span>
          <input
            value={beneficiary}
            onChange={(event) => setBeneficiary(event.target.value)}
            placeholder="0x..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 font-mono text-sm outline-none transition placeholder:text-slate-500 focus:border-teal-300/60"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">
            Lock amount
          </span>
          <input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="1000000"
            className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 font-mono text-sm outline-none transition placeholder:text-slate-500 focus:border-teal-300/60"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm text-slate-200">
        <span className="block text-xs uppercase tracking-[0.25em] text-slate-400">
          Unlock delay in seconds
        </span>
        <input
          value={unlockDelay}
          onChange={(event) => setUnlockDelay(event.target.value)}
          placeholder="3600"
          className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 font-mono text-sm outline-none transition placeholder:text-slate-500 focus:border-teal-300/60"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <Button
          type="button"
          className="justify-center gap-2"
          disabled={!connected || submitting || !HAS_APTOS_MODULE_ADDRESS}
          onClick={() => submit("initialize", [beneficiary || ownerAddress, Number(amount), Number(unlockDelay)])}
        >
          <ArrowUpRight className="h-4 w-4" />
          Initialize
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="justify-center gap-2"
          disabled={!connected || submitting || !HAS_APTOS_MODULE_ADDRESS}
          onClick={() => submit("add_to_lock", [Number(amount)])}
        >
          <TimerReset className="h-4 w-4" />
          Add To Lock
        </Button>
        <Button
          type="button"
          variant="outline"
          className="justify-center gap-2 border-white/10 bg-white/5"
          disabled={!connected || submitting || !HAS_APTOS_MODULE_ADDRESS}
          onClick={() => submit("release", [])}
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
          {!lockQuery.isLoading && !lockState && <p>No lock published yet.</p>}
          {lockState && (
            <>
              <p>Owner: {shortenAddress(lockState.owner)}</p>
              <p>Beneficiary: {shortenAddress(lockState.beneficiary)}</p>
              <p>Amount: {lockState.amount}</p>
              <p>Unlocks at: {lockState.unlockAtSeconds}</p>
              <p>Released: {lockState.released ? "yes" : "no"}</p>
              <p>Withdrawn: {lockState.withdrawnAmount}</p>
            </>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-50">
        <p className="font-medium">Module address</p>
        <p className="mt-2 break-all font-mono text-xs text-amber-100/90">
          {HAS_APTOS_MODULE_ADDRESS ? getLockModuleId() : "Set NEXT_PUBLIC_APTOS_MODULE_ADDRESS"}
        </p>
        <p className="mt-2 text-amber-100/80">
          Configure <span className="font-mono">NEXT_PUBLIC_APTOS_MODULE_ADDRESS</span> before using the UI.
        </p>
      </div>

      {status && <p className="text-sm text-emerald-200">{status}</p>}
      {lockQuery.error && <p className="text-sm text-red-300">{String(lockQuery.error)}</p>}
    </div>
  );
}
