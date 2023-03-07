import { FiChevronDown } from "react-icons/fi";

import { closeAlert, fireSweetAlert } from "components/SweetAlerts";
import { useGetTokens } from "context/TokensProvider/TokensProvider";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import Image from "components/Image";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";
import { ActionTypes } from "context/UserInputsProvider/reducer";

import ModalContent from "./ModalContent";
import styles from "./TokenSelect.module.css";

interface Props {
  type: "input" | "output";
}

const TokenSelect = ({ type }: Props) => {
  const { tokens } = useGetTokens();
  const { inputs, dispatch } = useUserInputs();

  if (!tokens) {
    return <div className={`flexbox ${styles.container}`} />;
  }

  const handleTokenSelect = (selectedToken: IToken) => {
    closeAlert();

    if (type === "input") {
      dispatch({
        type: ActionTypes.SET_INPUT_TOKEN,
        inputToken: selectedToken,
      });

      return;
    }

    dispatch({
      type: ActionTypes.SET_OUTPUT_TOKEN,
      outputToken: selectedToken,
    });
  };

  const handleOpenList = () => {
    fireSweetAlert({
      html: <ModalContent tokens={tokens} onTokenSelect={handleTokenSelect} />,
      showConfirmButton: false,
      background: "#0E1C37",
    });
  };

  const { tokens: stateTokens } = inputs;
  const { symbol, logoURI } = stateTokens[type];

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

export default TokenSelect;
