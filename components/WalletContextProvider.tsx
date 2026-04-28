"use client";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
require("@solana/wallet-adapter-react-ui/styles.css");
const CP = ConnectionProvider as any;
const WP = WalletProvider as any;
const WMP = WalletModalProvider as any;
export default function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Mainnet), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);
  return (
    <CP endpoint={endpoint}>
      <WP wallets={wallets} autoConnect={false} onError={(e: any) => { if (e?.name !== "WalletNotReadyError") console.warn(e?.message); }}>
        <WMP>{children}</WMP>
      </WP>
    </CP>
  );
}
