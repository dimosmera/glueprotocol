import { ActionTypes } from "context/ElusivInputsProvider/reducer";
import { useUserInputs } from "context/ElusivInputsProvider/ElusivInputsProvider";
import formatInputAmount from "utils/formatInputAmount";

import styles from "./Input.module.css";

interface Props {
  onFocus: () => void;
  onBlur: () => void;
}

const MAX_AMOUNT = 100_000_000_000_000;

const Input = ({ onFocus, onBlur }: Props) => {
  const { inputs, dispatch } = useUserInputs();

  const { token, amount } = inputs;

  const { symbol } = token;

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const value = event.currentTarget.value.replace(/[^0-9.]/g, "");

    if (value && (value.split(".").length > 2 || Number(value) > MAX_AMOUNT)) {
      return;
    }

    if (value === "" || value === "0") {
      dispatch({
        type: ActionTypes.CLEAR_AMOUNT,
        clearValue: value,
      });

      return;
    }

    dispatch({
      type: ActionTypes.SET_AMOUNT,
      amount: value,
    });
  };

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
          {formatInputAmount(amount, symbol)}
        </p>
      )}
    </div>
  );
};

export default Input;
