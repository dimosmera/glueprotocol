import React, { createContext, useEffect, useState } from "react";
import bs58 from "bs58";
import { PublicKey, SendOptions, VersionedTransaction } from "@solana/web3.js";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";

import { fireErrorAlert } from "components/SweetAlerts";
import isiOS from "utils/isiOS";
import openPhantomDeeplink from "utils/openPhantomDeeplink";
import isAndroid from "utils/isAndroid";
import dealWithMWAErrors from "utils/dealWithMWAErrors";

export const PhantomContext = createContext(undefined);

interface Props {
  children: React.ReactNode;
}

interface PhantomContext {
  publicKey: PublicKey;
  signAndSendTransaction: (
    transaction: VersionedTransaction,
    options?: SendOptions | undefined
  ) => Promise<{ signature: string }>;
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
    const isPhantomInstalled = detectPhantom();
    if (isPhantomInstalled) {
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

      return;
    }

    if (isiOS()) {
      openPhantomDeeplink(window.location.href);
      return;
    }

    if (isAndroid()) {
      try {
        await transact(async (wallet) => {
          const { accounts, auth_token: authToken } = await wallet.authorize({
            cluster: "mainnet-beta",
            identity: {
              uri: "https://www.glueprotocol.com/",
              icon: "/glue-icon.png",
              name: "Glue Protocol",
            },
          });

          // TODO: Save authToken in local storage
          console.log("authToken: ", authToken);

          const bufferData = Buffer.from(accounts[0].address, "base64");
          const publicKey = new PublicKey(bs58.encode(bufferData));
          handleSuccessfulConnection({ publicKey });
        });
      } catch (error: any) {
        console.log("error: ", error);
        console.error(error);

        dealWithMWAErrors(error);
      }

      return;
    }

    window.open("https://phantom.app/", "_blank");
  };

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
        disconnect,
        detectPhantom,
        connected: !!phantomContext?.publicKey,
        ...phantomContext,
      }}
    >
      {children}
    </PhantomContext.Provider>
  );
};

export default PhantomProvider;
