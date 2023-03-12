import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import { ActionTypes } from "context/UserInputsProvider/reducer";

import styles from "./DroplinksPaymentLink.module.css";

const DroplinksPaymentLink = () => {
  const { inputs, dispatch } = useUserInputs();

  const { paymentLinkVisible } = inputs;
  if (!paymentLinkVisible) return null;

  const handleKnowAddressClick = () => {
    dispatch({
      type: ActionTypes.SET_PAYMENT_LINK_VISIBILITY,
    });
  };

  return (
    <div className={`flexbox ${styles.container}`}>
      <p className={styles["explanation-text"]}>Payment link URL</p>

      <div className={`flexbox ${styles["input-container"]}`}>
        <input
          type="text"
          // value={}
          readOnly
          placeholder="https://"
          className={styles.input}
        />

        <button className={styles["payment-link-button"]}>Create</button>
      </div>

      <p
        className={`${styles["known-address-text"]}`}
        onClick={handleKnowAddressClick}
      >
        I know their address
      </p>
    </div>
  );
};

export default DroplinksPaymentLink;
