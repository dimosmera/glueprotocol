import { useContext } from "react";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";

import { PhantomContext } from "./PhantomProvider";

interface ReturnType {
  connect: () => void;
  disconnect: () => void;
  detectPhantom: () => boolean;
  publicKey: PublicKey | undefined;
  connected: boolean;
  signAndSendTransaction: (
    transaction: VersionedTransaction
  ) => Promise<{ signature: string } | undefined>;
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
  } = results;

  return {
    connect,
    disconnect,
    detectPhantom,
    publicKey,
    connected,
    signAndSendTransaction,
  };
};

export default useGetPhantomContext;
