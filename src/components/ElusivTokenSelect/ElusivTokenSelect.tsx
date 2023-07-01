import { FiChevronDown } from "react-icons/fi";

import { closeAlert, fireErrorAlert } from "components/SweetAlerts";
import Image from "components/Image";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";
import { ActionTypes } from "context/ElusivInputsProvider/reducer";
import { useUserInputs } from "context/ElusivInputsProvider/ElusivInputsProvider";

import styles from "./ElusivTokenSelect.module.css";

const ElusivTokenSelect = () => {
  const { inputs, dispatch } = useUserInputs();

  // TODO: Use this when more tokens are added
  const handleTokenSelect = (selectedToken: IToken) => {
    closeAlert();

    dispatch({
      type: ActionTypes.SET_TOKEN,
      token: selectedToken,
    });
  };

  const handleOpenList = () => {
    fireErrorAlert("More tokens will be added soon!", undefined, "info");
  };

  const { token } = inputs;
  const { symbol, logoURI } = token;

  return (
    <div className={`flexbox ${styles.container}`} onClick={handleOpenList}>
      <Image
        src={logoURI}
        alt={`${symbol} token logo"`}
        width={25}
        height={25}
      />

      <p className={styles["token-symbol"]}>{symbol}</p>

      <FiChevronDown size={14} />
    </div>
  );
};

export default ElusivTokenSelect;
