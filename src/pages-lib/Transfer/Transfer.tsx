import AmountInput from "components/AmountInput";

import styles from "./Transfer.module.css";

const Transfer = () => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <AmountInput title="You send exactly" />

      <AmountInput title="Recipient receives" />
    </div>
  );
};

export default Transfer;
