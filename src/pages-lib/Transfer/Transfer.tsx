import AmountInput from "components/AmountInput";
import DroplinksPaymentLink from "components/DroplinksPaymentLink";
import ErrorBox from "components/ErrorBox";
import RecipientInput from "components/RecipientInput";
import SwapButton from "components/SwapButton";

import styles from "./Transfer.module.css";

const Transfer = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <AmountInput title="You send" type="input" />

      <AmountInput title="Recipient receives" type="output" />

      <RecipientInput />

      <DroplinksPaymentLink />

      <SwapButton />

      <ErrorBox />
    </div>
  );
};

export default Transfer;
