import ElusivAmountInput from "components/ElusivAmountInput";
import ElusivRecipientInput from "components/ElusivRecipientInput";
import SwapButton from "components/SwapButton";

import styles from "./ElusivTransfer.module.css";

const ElusivTransfer = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <ElusivAmountInput />

      <ElusivRecipientInput />
    </div>
  );
};

export default ElusivTransfer;
