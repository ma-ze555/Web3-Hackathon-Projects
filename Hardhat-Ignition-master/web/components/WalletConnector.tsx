"use client";

import { Button } from "@/components/ui/button";
import { cn, shortenAddress } from "@/lib/utils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CircleOff, LogOut, Wallet } from "lucide-react";

export function WalletConnector() {
  const { connect, disconnect, connected, account, wallet, wallets = [] } =
    useWallet();

  const connectedAddress = account?.address?.toString();

  if (connected && connectedAddress) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
          <p className="flex items-center gap-2 font-medium">
            <Wallet className="h-4 w-4" />
            Connected with {wallet?.name ?? "Aptos wallet"}
          </p>
          <p className="mt-2 font-mono text-xs text-emerald-100/90">
            {shortenAddress(connectedAddress)}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-center gap-2"
          onClick={disconnect}
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  if (!wallets.length) {
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
        <p className="flex items-center gap-2 font-medium">
          <CircleOff className="h-4 w-4" />
          No Aptos wallet detected
        </p>
        <p className="mt-2 text-amber-100/90">
          Install Petra or Martian, then refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {wallets.map((walletOption) => (
        <Button
          key={walletOption.name}
          type="button"
          variant="outline"
          className={cn(
            "h-auto min-h-16 flex-col items-start justify-center border-white/10 bg-white/5 px-4 py-3 text-left text-slate-100 hover:bg-white/10",
            connected && wallet?.name === walletOption.name && "border-teal-300/40"
          )}
          onClick={() => connect(walletOption.name)}
        >
          <span className="text-sm font-medium">{walletOption.name}</span>
          <span className="text-xs text-slate-300">Connect via Aptos</span>
        </Button>
      ))}
    </div>
  );
}
