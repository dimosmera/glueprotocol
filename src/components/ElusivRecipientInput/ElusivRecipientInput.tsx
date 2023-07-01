import { useState } from "react";

import classList from "utils/classList";
import { ActionTypes } from "context/ElusivInputsProvider/reducer";
import { useUserInputs } from "context/ElusivInputsProvider/ElusivInputsProvider";

import styles from "./ElusivRecipientInput.module.css";

const ElusivRecipientInput = () => {
  const [focused, setFocused] = useState(false);

  const { inputs, dispatch } = useUserInputs();
  const { destinationAddress } = inputs;

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionTypes.SET_DESTINATION_ADDRESS,
      destinationAddress: event.currentTarget.value,
    });
  };

  return (
    <div className={`flexbox ${styles.container}`}>
      <p className={styles["explanation-text"]}>Recipient</p>

      <div
        className={classList([
          `flexbox ${styles["input-container"]}`,
          focused ? styles["blue-outline"] : "",
        ])}
      >
        <input
          type="text"
          value={destinationAddress}
          onChange={handleInputChange}
          placeholder="Wallet address or .sol domain"
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`${styles.input}`}
        />
      </div>
    </div>
  );
};

export default ElusivRecipientInput;
