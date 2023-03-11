import displayAddress from "utils/displayAddress";
import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";

import styles from "./AppHeader.module.css";

const AppHeader = () => {
  const { publicKey, detectPhantom, connect, disconnect } =
    useGetPhantomContext();

  const handleConnect = () => {
    if (publicKey) {
      disconnect();
      return;
    }

    const isPhantomInstalled = detectPhantom();
    if (!isPhantomInstalled) {
      // if (shouldDeeplink) {
      //   openPhantomDeeplink(window.location.href);
      //   return;
      // }

      window.open("https://phantom.app/", "_blank");
      return;
    }

    connect();
  };

  return (
    <div className={`flexbox ${styles.container}`}>
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
  );
};

export default AppHeader;
