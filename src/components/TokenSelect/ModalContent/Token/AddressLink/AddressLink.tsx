import { FiExternalLink } from "react-icons/fi";

import displayAddress from "utils/displayAddress";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";

import styles from "./AddressLink.module.css";

interface Props {
  address: IToken["address"];
}

const AddressLink = ({ address }: Props) => {
  const handleClickOnAddressLink = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.stopPropagation();
  };

  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={`https://solscan.io/token/${address}`}
      className={`flexbox ${styles.container}`}
      onClick={handleClickOnAddressLink}
    >
      <p className={styles["address-text"]}>{displayAddress(address)}</p>

      <FiExternalLink
        color="#B7BECB"
        size={10}
        style={{ marginBottom: "2px" }}
      />
    </a>
  );
};

export default AddressLink;
