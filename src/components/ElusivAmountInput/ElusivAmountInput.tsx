import { useState } from "react";

import classList from "utils/classList";
import ElusivTokenSelect from "components/ElusivTokenSelect";

import Input from "./Input";
import styles from "./ElusivAmountInput.module.css";

const ElusivAmountInput = () => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div className={`flexbox ${styles.container}`}>
      <p className={styles["explanation-text"]}>Send Privately</p>

      <div
        className={classList([
          `flexbox ${styles["input-container"]}`,
          focused ? styles["blue-outline"] : "",
        ])}
      >
        <Input onFocus={handleFocus} onBlur={handleBlur} />

        <ElusivTokenSelect />
      </div>
    </div>
  );
};

export default ElusivAmountInput;
