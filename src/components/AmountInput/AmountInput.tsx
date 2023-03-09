import { useState } from "react";

import { TokenType } from "types";
import classList from "utils/classList";
import TokenSelect from "components/TokenSelect";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";

import Input from "./Input";
import styles from "./AmountInput.module.css";

interface Props {
  title: string;
  type: TokenType;
}

const AmountInput = ({ title, type }: Props) => {
  const [focused, setFocused] = useState(false);

  const { inputs } = useUserInputs();
  const { lastChanged } = inputs;

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div className={`flexbox ${styles.container}`}>
      <p className={styles["explanation-text"]}>
        {title}
        <b>{lastChanged === type ? " exactly" : ""}</b>
      </p>

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
