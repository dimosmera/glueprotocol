import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import { ActionTypes } from "context/UserInputsProvider/reducer";

import styles from "./DroplinksPaymentLink.module.css";

const DroplinksPaymentLink = () => {
  const { inputs, dispatch } = useUserInputs();

  const { paymentLinkVisible, paymentLinkURL } = inputs;
  if (!paymentLinkVisible) return null;

  const handleKnowAddressClick = () => {
    dispatch({
      type: ActionTypes.SET_PAYMENT_LINK_VISIBILITY,
    });
  };

  const handleCreateLink = () => {};

  const handleCopyLink = () => {};

  return (
    <div className={`flexbox ${styles.container}`}>
      <p className={styles["explanation-text"]}>Payment link URL</p>

      <div className={`flexbox ${styles["input-container"]}`}>
        <input
          type="text"
          value={paymentLinkURL}
          readOnly
          placeholder="https://"
          className={styles.input}
        />

        {paymentLinkURL && paymentLinkURL !== "" ? (
          <button
            className={styles["copy-link-button"]}
            onClick={handleCopyLink}
          >
            Copy
          </button>
        ) : (
          <button
            className={styles["create-link-button"]}
            onClick={handleCreateLink}
          >
            Create
          </button>
        )}
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
