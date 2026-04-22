"use client";
import dynamic from "next/dynamic";
import React from "react";

const WalletContextProvider = dynamic(
  () => import("./WalletContextProvider"),
  { ssr: false }
);

export default function AppWalletProvider({ children }: { children: React.ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}
