import NextImage from "next/image";
import NextLink from "next/link";

import displayAddress from "utils/displayAddress";
import useGetWalletContext from "context/WalletProvider/useGetWalletContext";
import SolflareSVG from "components/SolflareSVG";

import styles from "./AppHeader.module.css";

const AppHeader = () => {
  const { publicKey, connect, disconnect } = useGetWalletContext();

  const handleConnect = async () => {
    if (publicKey) {
      await disconnect();
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

        <button
          className={`flexbox ${styles["connect-button"]}`}
          onClick={handleConnect}
        >
          {!publicKey && (
            <SolflareSVG
              style={{ width: "32px", height: "32px", marginRight: ".5rem" }}
            />
          )}

          {!publicKey ? "Connect Wallet" : displayAddress(publicKey.toString())}
        </button>
      </div>
    </div>
  );
};

export default AppHeader;
