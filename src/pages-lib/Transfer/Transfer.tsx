import AmountInput from "components/AmountInput";
import RecipientInput from "components/RecipientInput";
import SwapButton from "components/SwapButton";

import styles from "./Transfer.module.css";

const Transfer = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <AmountInput title="You send" type="input" />

      <AmountInput title="Recipient receives" type="output" />

      <RecipientInput />

      <SwapButton />
    </div>
  );
};

export default Transfer;
