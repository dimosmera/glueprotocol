import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import { ActionTypes } from "context/UserInputsProvider/reducer";
import useCreateDroplink from "services/api/useCreateDroplink";
import fireSuccessAlert from "components/SuccessAlert/fireSuccessAlert";
import { fireErrorAlert, fireLoadingAlert } from "components/SweetAlerts";

import styles from "./DroplinksPaymentLink.module.css";

const DroplinksPaymentLink = () => {
  const { inputs, dispatch } = useUserInputs();

  const { isLoading: createLoading, mutateAsync: createDroplink } =
    useCreateDroplink();

  const { paymentLinkVisible, paymentLink } = inputs;
  if (!paymentLinkVisible) return null;

  const handleKnowAddressClick = () => {
    dispatch({
      type: ActionTypes.SET_PAYMENT_LINK_VISIBILITY,
    });
  };

  const handleCreateLink = async () => {
    fireLoadingAlert();

    try {
      const { data } = await createDroplink();

      const { dropLinks } = data;
      const { publicKey, dropLinkURL } = dropLinks[0];

      dispatch({
        type: ActionTypes.SET_PAYMENT_LINK,
        paymentLink: { url: dropLinkURL, publicKey },
      });

      fireSuccessAlert({
        successText: "Payment link created",
        timer: 5_000,
        timerProgressBar: false,
      });
    } catch (error) {
      console.error(error);

      fireErrorAlert();
    }
  };

  const handleCopyLink = () => {};

  return (
    <div className={`flexbox ${styles.container}`}>
      <p className={styles["explanation-text"]}>Payment link URL</p>

      <div className={`flexbox ${styles["input-container"]}`}>
        <input
          type="text"
          value={paymentLink.url}
          readOnly
          placeholder="https://"
          className={styles.input}
        />

        {paymentLink.url && paymentLink.url !== "" ? (
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
            disabled={createLoading}
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
