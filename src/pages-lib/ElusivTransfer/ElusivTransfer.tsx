import ElusivAmountInput from "components/ElusivAmountInput";
import ElusivRecipientInput from "components/ElusivRecipientInput";
import ElusivSwapButton from "components/ElusivSwapButton";

import styles from "./ElusivTransfer.module.css";

const ElusivTransfer = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <ElusivAmountInput />

      <ElusivRecipientInput />

      <ElusivSwapButton />
    </div>
  );
};

export default ElusivTransfer;
