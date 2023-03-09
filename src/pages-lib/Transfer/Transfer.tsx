import AmountInput from "components/AmountInput";

import styles from "./Transfer.module.css";

const Transfer = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <AmountInput title="You send" type="input" />

      <AmountInput title="Recipient receives" type="output" />
    </div>
  );
};

export default Transfer;
