import { useState } from "react";

import classList from "utils/classList";
import TokenSelect from "components/TokenSelect";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";

import styles from "./AmountInput.module.css";

interface Props {
  title: string;
  type: "input" | "output";
}

const MAX_AMOUNT = 100_000_000_000;

// Format integer part with commas
// Surprisingly complex to do in the input onChange since the cursor moves to the end
// https://github.com/facebook/react/issues/955, https://stackoverflow.com/a/60131033/11688901
const formatNumber = (value: string, symbol: string) => {
  const parts = value.split(".");
  const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimal = parts.length > 1 ? `.${parts[1]}` : "";

  return `${integer}${decimal} ${symbol}`;
};

const AmountInput = ({ title, type }: Props) => {
  const [focused, setFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { inputs, dispatch } = useUserInputs();

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const value = event.currentTarget.value.replace(/[^0-9.]/g, "");

    if (value && (value.split(".").length > 2 || Number(value) > MAX_AMOUNT)) {
      return;
    }

    setInputValue(value);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const { tokens: stateTokens } = inputs;
  const { symbol } = stateTokens[type];

  return (
    <div className={`flexbox ${styles.container}`}>
      <p className={styles["explanation-text"]}>{title}</p>

      <div
        className={classList([
          `flexbox ${styles["input-container"]}`,
          focused ? styles["blue-outline"] : "",
        ])}
      >
        <div className={`flexbox ${styles["numbers-container"]}`}>
          <input
            placeholder="0"
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`semi-bold-text ${styles.input}`}
          />
          {inputValue && Number(inputValue) >= 1_000 && (
            <p className={styles["human-readable-number"]}>
              {formatNumber(inputValue, symbol)}
            </p>
          )}
        </div>

        <TokenSelect type={type} />
      </div>
    </div>
  );
};

export default AmountInput;
