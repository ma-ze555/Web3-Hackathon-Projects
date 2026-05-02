"use client";

import { Button } from "@/components/ui/button";
import { shortenAddress } from "@/lib/utils";
import { CircleOff, LogOut, Wallet } from "lucide-react";
import { useState } from "react";

interface Props {
  publicKey: string;
  onConnect: (key: string) => void;
  onDisconnect: () => void;
}

export function WalletConnector({ publicKey, onConnect, onDisconnect }: Props) {
  const [error, setError] = useState("");

  async function connect() {
    setError("");
    try {
      const freighter = await import("@stellar/freighter-api");
      await freighter.requestAccess();
      const result = await freighter.getPublicKey();
      if (result.error) {
        setError(result.error);
        return;
      }
      onConnect(result.publicKey);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to connect wallet");
    }
  }

  if (publicKey) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
          <p className="flex items-center gap-2 font-medium">
            <Wallet className="h-4 w-4" />
            Connected via Freighter
          </p>
          <p className="mt-2 font-mono text-xs text-emerald-100/90">
            {shortenAddress(publicKey)}
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-center gap-2"
          onClick={onDisconnect}
        >
          <LogOut className="h-4 w-4" />
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-50">
          <p className="flex items-center gap-2 font-medium">
            <CircleOff className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}
      <Button
        type="button"
        className="w-full justify-center gap-2"
        onClick={connect}
      >
        <Wallet className="h-4 w-4" />
        Connect Freighter
      </Button>
    </div>
  );
}
