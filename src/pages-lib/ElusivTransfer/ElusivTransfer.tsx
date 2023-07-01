import ElusivAmountInput from "components/ElusivAmountInput";
import ElusivRecipientInput from "components/ElusivRecipientInput";
import ElusivSendButton from "components/ElusivSendButton";

import styles from "./ElusivTransfer.module.css";

const ElusivTransfer = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <ElusivAmountInput />

      <ElusivRecipientInput />

      <ElusivSendButton />
    </div>
  );
};

export default ElusivTransfer;
