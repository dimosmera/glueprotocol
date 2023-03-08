import { useState } from "react";

import classList from "utils/classList";
import TokenSelect from "components/TokenSelect";

import Input from "./Input";
import styles from "./AmountInput.module.css";

interface Props {
  title: string;
  type: "input" | "output";
}

const AmountInput = ({ title, type }: Props) => {
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
        <Input type={type} onFocus={handleFocus} onBlur={handleBlur} />

        <TokenSelect type={type} />
      </div>
    </div>
  );
};

export default AmountInput;
