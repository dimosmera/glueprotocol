import { useContext } from "react";
import {
  PublicKey,
  SendOptions,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

import { PhantomContext } from "./PhantomProvider";

interface ReturnType {
  connect: () => void;
  connectAsync: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => void;
  detectPhantom: () => boolean;
  handleSuccessfulConnection: (response: any) => void;
  publicKey: PublicKey | undefined;
  connected: boolean;
  signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined;
  signAndSendTransaction: (
    transaction: Transaction | VersionedTransaction,
    options?: SendOptions | undefined
  ) => Promise<{ publicKey: string; signature: string }>;
}

const error =
  "Seems like PhantomContext is not defined but that should never be the case, since we are gracefully handling Error and Loading states.";

const useGetPhantomContext = (): ReturnType => {
  const results = useContext(PhantomContext);
  if (!results) throw new Error(error);

  const {
    connect,
    connectAsync,
    disconnect,
    detectPhantom,
    publicKey,
    connected,
    signMessage,
    signAndSendTransaction,
    handleSuccessfulConnection,
  } = results;

  return {
    connect,
    connectAsync,
    disconnect,
    detectPhantom,
    publicKey,
    connected,
    signMessage,
    signAndSendTransaction,
    handleSuccessfulConnection,
  };
};

export default useGetPhantomContext;
