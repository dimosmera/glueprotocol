import React, { createContext, useEffect, useState } from "react";
import bs58 from "bs58";
import {
  PublicKey,
  SendOptions,
  VersionedTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  MobileWallet,
  transact,
  SolanaMobileWalletAdapterProtocolErrorCode,
} from "@solana-mobile/mobile-wallet-adapter-protocol";

import { fireErrorAlert } from "components/SweetAlerts";
import isiOS from "utils/isiOS";
import openWalletDeeplink from "utils/openWalletDeeplink";
import isAndroid from "utils/isAndroid";
import dealWithMWAErrors from "utils/dealWithMWAErrors";
import {
  MWA_AUTH_TOKEN_KEY,
  getItemFromLocalStorage,
  setItemToLocalStorage,
  removeItemFromLocalStorage,
} from "services/localStorage";

export const WalletContext = createContext(undefined);

interface Props {
  children: React.ReactNode;
}

interface WalletContext {
  publicKey: PublicKey;
  signMessage:
    | ((message: Uint8Array) => Promise<{ signature: Uint8Array }>)
    | undefined;
  signTransaction: (
    transaction: Transaction | VersionedTransaction,
    options?: SendOptions | undefined
  ) => Promise<Transaction>;
}

export const getProvider = () => {
  try {
    if (!window) return;

    if ("solflare" in window) {
      // @ts-ignore
      const provider: any = window.solflare;

      if (provider?.isSolflare) {
        return provider;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

/**
 * Supports only Solflare for now
 */
const WalletProvider = ({ children }: Props) => {
  const [walletContext, setWalletContext] = useState<
  WalletContext | undefined
  >(undefined);

  const handleSuccessfulConnection = (response: any) => {
    setWalletContext({
      publicKey: response.publicKey,
      signMessage: getProvider()?.signMessage,
      signTransaction: getProvider()?.signTransaction,
    });
  };

  useEffect(() => {
    getProvider()?.on("connect", (publicKey: any) => {
      handleSuccessfulConnection({ publicKey });
    });
  }, []);

  /**
   * Handle disconnect events
   */
  useEffect(() => {
    getProvider()?.on("disconnect", () => {
      setWalletContext(undefined);
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

  /**
   * Resolves to <true> if the user accepted the connection request and <false> if not
   */
  const connect = async () => {
    const isWalletInstalled = detectWallet();
    if (isWalletInstalled) {
      getProvider()
        ?.connect()
        .then((resp: any) => {
          if (!resp) {
            fireErrorAlert("Connection rejected");
            return;
          }
        })
        .catch(() => {
          fireErrorAlert();
        });

      return;
    }

    if (isiOS()) {
      openWalletDeeplink(window.location.href);
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

    window.open("https://solflare.com/", "_blank");
  };

  const disconnect = async () => {
    const isWalletInstalled = detectWallet();
    if (isWalletInstalled) {
      getProvider()?.disconnect();

      return;
    }

    if (isAndroid()) {
      const existingToken = getItemFromLocalStorage(MWA_AUTH_TOKEN_KEY);
      if (!existingToken) return;

      removeItemFromLocalStorage(MWA_AUTH_TOKEN_KEY);
      setWalletContext(undefined);

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

  const detectWallet = (): boolean => {
    try {
      if (!window) return false;

      // @ts-ignore
      return window.solflare?.isSolflare;
    } catch (error) {
      return false;
    }
  };

  return (
    <WalletContext.Provider
      // @ts-ignore
      value={{
        connect,
        disconnect,
        detectWallet,
        connected: !!walletContext?.publicKey,
        authoriseWithMobileWallet,
        ...walletContext,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
