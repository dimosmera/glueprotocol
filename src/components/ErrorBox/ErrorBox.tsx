import { FiAlertOctagon } from "react-icons/fi";

import { InputError } from "context/UserInputsProvider/reducer";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";

import styles from "./ErrorBox.module.css";

const getErrorBodyText = (errorType: InputError["type"]) => {
  switch (errorType) {
    case "ExactInLiquidity":
      return "Try a different asset pair or amount";
    case "ExactOutLiquidity":
      return 'Try a different asset pair or start with the "You send" box';
    default:
      return "Something is wrong. Please try again or reach out";
  }
};

const ErrorBox = () => {
  const { inputs } = useUserInputs();
  const { error } = inputs;

  if (!error) return null;

  const { type, message } = error;

  return (
    <div className={`flexbox ${styles.container}`}>
      <div className="flexbox">
        <FiAlertOctagon
          color="#F04A44"
          size={20}
          style={{ marginRight: "10px", marginBottom: "8px" }}
        />

        <p className={`semi-bold-text ${styles["title-text"]}`}>{message}</p>
      </div>

      <p className={styles["body-text"]}>{getErrorBodyText(type)}</p>
    </div>
  );
};

export default ErrorBox;
