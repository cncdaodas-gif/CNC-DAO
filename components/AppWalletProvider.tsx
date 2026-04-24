"use client";
import dynamic from "next/dynamic";
import React from "react";

// ssr:false is critical — wallet extensions only exist in the browser.
// Without this, Next.js tries to render on the server where window is undefined,
// which breaks the extension detection and causes silent click failures.
const WalletContextProvider = dynamic(
  () => import("./WalletContextProvider"),
  {
    ssr: false,
    loading: () => <>{React.Children.map(null, () => null)}</>,
  }
);

export default function AppWalletProvider({ children }: { children: React.ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}
