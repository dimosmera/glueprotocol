import { useContext } from "react";
import { PublicKey, SendOptions, VersionedTransaction } from "@solana/web3.js";
import { MobileWallet } from "@solana-mobile/mobile-wallet-adapter-protocol";

import { PhantomContext } from "./PhantomProvider";

interface ReturnType {
  connect: () => void;
  disconnect: () => Promise<void>;
  detectPhantom: () => boolean;
  publicKey: PublicKey | undefined;
  connected: boolean;
  signAndSendTransaction: (
    transaction: VersionedTransaction,
    options?: SendOptions | undefined
  ) => Promise<{ signature: string }>;
  authoriseWithMobileWallet: (wallet: MobileWallet) => Promise<{
    accounts: Readonly<{
      address: string;
      label?: string | undefined;
    }>[];
  }>;
}

const error =
  "Seems like PhantomContext is not defined but that should never be the case, since we are gracefully handling Error and Loading states.";

const useGetPhantomContext = (): ReturnType => {
  const results = useContext(PhantomContext);
  if (!results) throw new Error(error);

  const {
    connect,
    disconnect,
    detectPhantom,
    publicKey,
    connected,
    signAndSendTransaction,
    authoriseWithMobileWallet,
  } = results;

  return {
    connect,
    disconnect,
    detectPhantom,
    publicKey,
    connected,
    signAndSendTransaction,
    authoriseWithMobileWallet,
  };
};

export default useGetPhantomContext;
