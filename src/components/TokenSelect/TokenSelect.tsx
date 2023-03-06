import { fireSweetAlert } from "components/SweetAlerts";
import { useGetTokens } from "context/TokensProvider/TokensProvider";

import Content from "./Content";
import styles from "./TokenSelect.module.css";

const TokenSelect = () => {
  const { tokens } = useGetTokens();

  if (!tokens) {
    return <div className={`flexbox ${styles.container}`} />;
  }

  const handleOpenList = () => {
    fireSweetAlert({
      html: <Content tokens={tokens} />,
      showConfirmButton: false,
      background: "#0E1C37",
    });
  };

  return (
    <div
      className={`flexbox ${styles.container}`}
      onClick={handleOpenList}
    ></div>
  );
};

export default TokenSelect;
