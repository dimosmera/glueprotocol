import { useState } from "react";

import classList from "utils/classList";
import { ActionTypes } from "context/UserInputsProvider/reducer";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";

import styles from "./RecipientInput.module.css";

const RecipientInput = () => {
  const [focused, setFocused] = useState(false);

  const { inputs, dispatch } = useUserInputs();
  const { destinationAddress, paymentLinkVisible } = inputs;

  if (paymentLinkVisible) return null;

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

  const handleUnknownAddressClick = () => {
    dispatch({
      type: ActionTypes.SET_PAYMENT_LINK_VISIBILITY,
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

      <p
        className={`${styles["unknown-address-text"]}`}
        onClick={handleUnknownAddressClick}
      >
        {"Don't know their address?"}
      </p>
    </div>
  );
};

export default RecipientInput;
