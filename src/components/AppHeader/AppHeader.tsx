import NextImage from "next/image";
import NextLink from "next/link";
import {
  transact,
  SolanaMobileWalletAdapterProtocolErrorCode,
} from "@solana-mobile/mobile-wallet-adapter-protocol";
import bs58 from "bs58";

import isiOS from "utils/isiOS";
import isAndroid from "utils/isAndroid";
import displayAddress from "utils/displayAddress";
import openPhantomDeeplink from "utils/openPhantomDeeplink";
import { fireErrorAlert } from "components/SweetAlerts";
import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";

import styles from "./AppHeader.module.css";

const AppHeader = () => {
  const { publicKey, detectPhantom, connect, disconnect } =
    useGetPhantomContext();

  const handleConnect = async () => {
    if (publicKey) {
      disconnect();
      return;
    }

    const isPhantomInstalled = detectPhantom();
    if (!isPhantomInstalled) {
      if (isiOS()) {
        openPhantomDeeplink(window.location.href);
        return;
      }

      if (isAndroid()) {
        try {
          await transact(async (wallet) => {
            const { accounts } = await wallet.authorize({
              cluster: "mainnet-beta",
              identity: {
                uri: "https://www.glueprotocol.com/",
                icon: "/glue-icon.png",
                name: "Glue Protocol",
              },
            });

            const bufferData = Buffer.from(accounts[0].address, "base64");
            const publicKey = bs58.encode(bufferData);
            console.log("publicKey: ", publicKey);
          });
        } catch (error: any) {
          console.log("error: ", error);
          console.error(error);

          if (error) {
            if (
              error.code ===
              SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED
            ) {
              fireErrorAlert("Connection rejected");
              return;
            }
          }

          fireErrorAlert();
        }

        return;
      }

      window.open("https://phantom.app/", "_blank");
      return;
    }

    connect();
  };

  return (
    <div className={`flexbox ${styles.container}`}>
      <NextLink href="/" className={`flexbox ${styles["title-container"]}`}>
        <NextImage
          src="/glue-icon.png"
          alt="Glue protocol logo"
          width={46}
          height={46}
        />

        <h1 className={`bold-text ${styles["app-title"]}`}>Glue</h1>
      </NextLink>

      <div className="flexbox">
        <a
          className={styles["help-text"]}
          href="https://twitter.com/dimos851"
          target="_blank"
          rel="noopener"
        >
          Help
        </a>

        <button className={styles["connect-button"]} onClick={handleConnect}>
          {!publicKey ? "Connect Wallet" : displayAddress(publicKey.toString())}
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
