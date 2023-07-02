import { FiHeart } from "react-icons/fi";

import classList from "utils/classList";

import styles from "./AppFooter.module.css";

const AppFooter = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <div className="flexbox">
        <p className={styles["love-text"]}>Made with</p>

        <FiHeart
          size={14}
          color="#1D243C"
          fill="red"
          style={{ marginLeft: "4px", marginTop: "3px", marginRight: "4px" }}
        />

        <p className={styles["love-text"]}>by</p>

        <a
          className={styles["link-text"]}
          href="https://twitter.com/dimos851"
          target="_blank"
          rel="noopener"
        >
          dimos851
        </a>
      </div>

      <p className={styles["divider-dot"]}>•</p>

      <a
        href="https://github.com/dimosmera/glueprotocol/"
        target="_blank"
        rel="noopener"
      >
        <p className={classList([styles["link-text"], styles["no-margin"]])}>
          Fork on GitHub
        </p>
      </a>
    </div>
  );
};

export default AppFooter;
