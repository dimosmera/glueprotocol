import { useContext } from "react";
import {
  PublicKey,
  SendOptions,
  VersionedTransaction,
  Transaction,
} from "@solana/web3.js";
import { MobileWallet } from "@solana-mobile/mobile-wallet-adapter-protocol";

import { WalletContext } from "./WalletProvider";

interface ReturnType {
  connect: () => void;
  disconnect: () => Promise<void>;
  detectWallet: () => boolean;
  publicKey: PublicKey | undefined;
  connected: boolean;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signTransaction: (
    transaction: Transaction | VersionedTransaction,
    options?: SendOptions | undefined
  ) => Promise<Transaction>;
  authoriseWithMobileWallet: (wallet: MobileWallet) => Promise<{
    accounts: Readonly<{
      address: string;
      label?: string | undefined;
    }>[];
  }>;
}

const error =
  "Seems like WalletContext is not defined but that should never be the case, since we are gracefully handling Error and Loading states.";

const useGetWalletContext = (): ReturnType => {
  const results = useContext(WalletContext);
  if (!results) throw new Error(error);

  const {
    connect,
    disconnect,
    detectWallet,
    publicKey,
    connected,
    signMessage,
    signTransaction,
    authoriseWithMobileWallet,
  } = results;

  return {
    connect,
    disconnect,
    detectWallet,
    publicKey,
    connected,
    signMessage,
    signTransaction,
    authoriseWithMobileWallet,
  };
};

export default useGetWalletContext;
