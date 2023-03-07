import Image from "components/Image";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";

import styles from "./TokenTag.module.css";

interface Props {
  symbol: IToken["symbol"];
  logoURI: IToken["logoURI"];
  address: IToken["address"];
  onTokenSelect: (address: IToken["address"]) => void;
}

const TokenTag = ({ symbol, logoURI, address, onTokenSelect }: Props) => {
  return (
    <div
      className={`flexbox ${styles.container}`}
      onClick={() => onTokenSelect(address)}
    >
      <Image
        src={logoURI}
        alt={`${symbol} token logo`}
        width={25}
        height={25}
      />

      <p className={styles["symbol-text"]}>{symbol}</p>
    </div>
  );
};

export default TokenTag;
