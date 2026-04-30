"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { useState, type ReactNode } from "react";

const wallets = [new PetraWallet(), new MartianWallet()];

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect
      onError={(error) => {
        console.error("Aptos wallet error:", error);
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AptosWalletAdapterProvider>
  );
}
