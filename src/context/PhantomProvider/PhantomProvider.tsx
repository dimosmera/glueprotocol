import React, { createContext, useEffect, useState } from "react";
import bs58 from "bs58";
import { PublicKey, SendOptions, VersionedTransaction } from "@solana/web3.js";
import {
  MobileWallet,
  transact,
  SolanaMobileWalletAdapterProtocolErrorCode,
} from "@solana-mobile/mobile-wallet-adapter-protocol";

import { fireErrorAlert } from "components/SweetAlerts";
import isiOS from "utils/isiOS";
import openPhantomDeeplink from "utils/openPhantomDeeplink";
import isAndroid from "utils/isAndroid";
import dealWithMWAErrors from "utils/dealWithMWAErrors";
import {
  MWA_AUTH_TOKEN_KEY,
  getItemFromLocalStorage,
  setItemToLocalStorage,
  removeItemFromLocalStorage,
} from "services/localStorage";

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

  const authoriseWithMobileWallet = async (
    wallet: MobileWallet
  ): Promise<{
    accounts: Readonly<{
      address: string;
      label?: string | undefined;
    }>[];
  }> => {
    const existingToken = getItemFromLocalStorage(MWA_AUTH_TOKEN_KEY);

    if (existingToken) {
      return wallet
        .reauthorize({ auth_token: existingToken })
        .then(({ accounts, auth_token: authToken }) => {
          setItemToLocalStorage(MWA_AUTH_TOKEN_KEY, authToken);

          return { accounts };
        })
        .catch((error: any) => {
          if (
            error &&
            error.code ===
              SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED
          ) {
            console.log(
              "Invalid auth token, beging authorisation from scratch"
            );

            removeItemFromLocalStorage(MWA_AUTH_TOKEN_KEY);

            return authoriseWithMobileWallet(wallet);
          }

          throw error;
        });
    }

    console.log("existingToken: ", existingToken);

    const authorizationResult = await wallet.authorize({
      cluster: "mainnet-beta",
      identity: {
        uri: "https://www.glueprotocol.com/",
        icon: "/glue-icon.png",
        name: "Glue Protocol",
      },
    });

    const { accounts, auth_token: authToken } = authorizationResult;

    setItemToLocalStorage(MWA_AUTH_TOKEN_KEY, authToken);

    return { accounts };
  };

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
          const { accounts } = await authoriseWithMobileWallet(wallet);

          const bufferData = Buffer.from(accounts[0].address, "base64");
          const publicKey = new PublicKey(bs58.encode(bufferData));
          handleSuccessfulConnection({ publicKey });
        });
      } catch (error: any) {
        console.log("MWA authorize error: ", error);
        console.error(error);

        dealWithMWAErrors(error);
      }

      return;
    }

    window.open("https://phantom.app/", "_blank");
  };

  const disconnect = async () => {
    const isPhantomInstalled = detectPhantom();
    if (isPhantomInstalled) {
      getProvider()?.disconnect();

      return;
    }

    if (isAndroid()) {
      const existingToken = getItemFromLocalStorage(MWA_AUTH_TOKEN_KEY);
      if (!existingToken) return;

      removeItemFromLocalStorage(MWA_AUTH_TOKEN_KEY);

      try {
        await transact(async (wallet) => {
          await wallet.deauthorize({ auth_token: existingToken });
        });
      } catch (error: any) {
        console.log("MWA deauthorize error: ", error);
        console.error(error);

        dealWithMWAErrors(error);
      }

      return;
    }
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
        authoriseWithMobileWallet,
        ...phantomContext,
      }}
    >
      {children}
    </PhantomContext.Provider>
  );
};

export default PhantomProvider;
