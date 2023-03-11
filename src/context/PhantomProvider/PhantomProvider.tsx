import React, { createContext, useEffect, useState } from "react";
import {
  PublicKey,
  SendOptions,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

import { fireErrorAlert } from "components/SweetAlerts";

export const PhantomContext = createContext(undefined);

interface Props {
  children: React.ReactNode;
}

interface PhantomContext {
  publicKey: PublicKey;
  signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined;
  signAndSendTransaction: (
    transaction: Transaction | VersionedTransaction,
    options?: SendOptions | undefined
  ) => Promise<{ publicKey: string; signature: string }>;
}

export const getProvider = () => {
  try {
    if (!window) return;

    if ("phantom" in window) {
      // @ts-ignore
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const PhantomProvider = ({ children }: Props) => {
  const [phantomContext, setPhantomContext] = useState<
    PhantomContext | undefined
  >(undefined);

  const handleSuccessfulConnection = (response: any) => {
    setPhantomContext({
      publicKey: response.publicKey,
      signMessage: getProvider()?.signMessage,
      signAndSendTransaction: getProvider()?.signAndSendTransaction,
    });
  };

  /**
   * Will either automatically connect to Phantom, or do nothing
   */
  useEffect(() => {
    getProvider()
      ?.connect({ onlyIfTrusted: true })
      .then((response: any) => {
        handleSuccessfulConnection(response);
      })
      .catch(() => {
        // This is an eager connection. Do nothing.
      });
  }, []);

  /**
   * Handle disconnect events
   */
  useEffect(() => {
    getProvider()?.on("disconnect", () => {
      setPhantomContext(undefined);
    });
  }, []);

  const connect = async () => {
    try {
      const resp = await getProvider()?.connect();

      handleSuccessfulConnection(resp);
    } catch (err: any) {
      if (err && err.code === 4001) {
        fireErrorAlert("Connection rejected");
        return;
      }

      fireErrorAlert();
    }
  };

  /**
   * Returns the publicKey once the promise resolves
   */
  const connectAsync = async () =>
    getProvider()
      ?.connect()
      .then((resp: any) => {
        handleSuccessfulConnection(resp);
        return { publicKey: resp.publicKey };
      })
      .catch((err: any) => {
        if (err && err.code === 4001) {
          fireErrorAlert("Connection rejected");
          return;
        }

        fireErrorAlert();
      });

  const disconnect = () => {
    getProvider()?.disconnect();
  };

  const detectPhantom = (): boolean => {
    try {
      if (!window) return false;

      // @ts-ignore
      return window.phantom?.solana?.isPhantom;
    } catch (error) {
      return false;
    }
  };

  return (
    <PhantomContext.Provider
      // @ts-ignore
      value={{
        connect,
        connectAsync,
        disconnect,
        detectPhantom,
        connected: !!phantomContext?.publicKey,
        handleSuccessfulConnection,
        ...phantomContext,
      }}
    >
      {children}
    </PhantomContext.Provider>
  );
};

export default PhantomProvider;
