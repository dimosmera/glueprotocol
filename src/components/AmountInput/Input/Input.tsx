import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";

import { ActionTypes } from "context/UserInputsProvider/reducer";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";

import styles from "./Input.module.css";

interface Props {
  onFocus: () => void;
  onBlur: () => void;
  type: "input" | "output";
}

const MAX_AMOUNT = 100_000_000_000;

/**
 * Format integer part with commas
 * Surprisingly complex to do in the input onChange since the cursor moves to the end
 * https://github.com/facebook/react/issues/955, https://stackoverflow.com/a/60131033/11688901
 */
const formatNumber = (value: string, symbol: IToken["symbol"]) => {
  const parts = value.split(".");
  const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimal = parts.length > 1 ? `.${parts[1]}` : "";

  return `${integer}${decimal} ${symbol}`;
};

const Input = ({ onFocus, onBlur, type }: Props) => {
  const { inputs, dispatch } = useUserInputs();

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const value = event.currentTarget.value.replace(/[^0-9.]/g, "");

    if (value && (value.split(".").length > 2 || Number(value) > MAX_AMOUNT)) {
      return;
    }

    if (type === "input") {
      dispatch({
        type: ActionTypes.SET_INPUT_AMOUNT,
        inputAmount: value,
      });

      return;
    }

    dispatch({
      type: ActionTypes.SET_OUTPUT_AMOUNT,
      outputAmount: value,
    });
  };

  const { tokens: stateTokens, amounts } = inputs;

  const { symbol } = stateTokens[type];
  const amount = amounts[type];

  return (
    <div className={`flexbox ${styles.container}`}>
      <input
        placeholder="0"
        type="text"
        inputMode="decimal"
        value={amount}
        onChange={handleInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`semi-bold-text ${styles.input}`}
      />

      {amount && Number(amount) >= 1_000 && (
        <p className={styles["human-readable-number"]}>
          {formatNumber(amount, symbol)}
        </p>
      )}
    </div>
  );
};

export default Input;
