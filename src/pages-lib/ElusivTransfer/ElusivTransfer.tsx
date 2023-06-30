import ElusivAmountInput from "components/ElusivAmountInput";
import RecipientInput from "components/RecipientInput";
import SwapButton from "components/SwapButton";

import styles from "./ElusivTransfer.module.css";

const ElusivTransfer = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <ElusivAmountInput />
    </div>
  );
};

export default ElusivTransfer;
