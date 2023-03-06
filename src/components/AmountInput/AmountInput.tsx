import { useState } from "react";

import classList from "utils/classList";

import styles from "./AmountInput.module.css";

interface Props {
  title: string;
}

const AmountInput = ({ title }: Props) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div className={`flexbox ${styles.container}`}>
      <p className={styles["explanation-text"]}>{title}</p>

      <div
        className={classList([
          `flexbox ${styles["input-container"]}`,
          focused ? styles["blue-outline"] : "",
        ])}
      >
        <input
          placeholder="0"
          type="text"
          pattern="^\d*[.,]?\d*$"
          inputMode="decimal"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`semi-bold-text ${styles.input}`}
        />

        <div className={`flexbox ${styles["coin-container"]}`}></div>
      </div>
    </div>
  );
};

export default AmountInput;
