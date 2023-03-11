import { FiHeart } from "react-icons/fi";

import styles from "./AppFooter.module.css";

const AppFooter = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
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
  );
};

export default AppFooter;
