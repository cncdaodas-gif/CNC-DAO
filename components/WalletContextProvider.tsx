"use client";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");

// Cast to any to bypass React 18 JSX type incompatibility
const CP = ConnectionProvider as any;
const WP = WalletProvider as any;
const WMP = WalletModalProvider as any;

export default function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Mainnet), []);

  // Recreating adapters inside useMemo with NO deps prevents stale adapter instances
  // that cause the "click but nothing happens" bug on extension wallets
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);

  return (
    <CP endpoint={endpoint}>
      <WP
        wallets={wallets}
        autoConnect={false}
        onError={(error: any) => {
          // Swallow WalletNotReadyError silently — happens when extension isn't installed
          if (error?.name !== "WalletNotReadyError") {
            console.warn("Wallet error:", error?.message);
          }
        }}
      >
        <WMP>{children}</WMP>
      </WP>
    </CP>
  );
}
