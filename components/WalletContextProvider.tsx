"use client";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

require("@solana/wallet-adapter-react-ui/styles.css");

// Type cast fixes React 18 JSX incompatibility with older wallet adapter types
const Connection = ConnectionProvider as any;
const Wallet = WalletProvider as any;
const WalletModal = WalletModalProvider as any;

export default function WalletContextProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <Connection endpoint={endpoint}>
      <Wallet wallets={wallets} autoConnect={false}>
        <WalletModal>
          {children}
        </WalletModal>
      </Wallet>
    </Connection>
  );
}
