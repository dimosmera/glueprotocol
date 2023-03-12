import { Inter } from "next/font/google";
import { FiExternalLink } from "react-icons/fi";

import styles from "./SuccessAlert.module.css";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  successText?: string;
  txId?: string;
}

const SuccessAlert = ({ txId, successText = "Success 🎉" }: Props) => {
  return (
    <div className={`flexbox ${inter.className} ${styles.container}`}>
      <p>{successText}</p>

      {txId && (
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://solscan.io/tx/${txId}`}
          className={`flexbox ${styles["verify-container"]}`}
        >
          <FiExternalLink
            color="#558CFF"
            size={14}
            style={{ marginRight: "5px" }}
          />

          <p className={styles["verify-text"]}>Verify</p>
        </a>
      )}
    </div>
  );
};

export default SuccessAlert;
