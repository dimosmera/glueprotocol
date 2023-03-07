import Image from "components/Image";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";

import AddressLink from "./AddressLink";
import styles from "./Token.module.css";

interface Props {
  index: number;
  style: React.CSSProperties;
  data: {
    tokens: IToken[];
    onSelect: (index: number) => void;
  };
}

const Token = ({ index, style, data }: Props) => {
  const { tokens, onSelect } = data;

  const token = tokens[index];
  const { logoURI, name, symbol, address } = token;

  const handleSelect = () => {
    onSelect(index);
  };

  return (
    <div
      style={style}
      className={`flexbox ${styles.container}`}
      onClick={handleSelect}
    >
      <Image src={logoURI} alt={`${name} token logo"`} width={35} height={35} />

      <div className={`flexbox ${styles["text-container"]}`}>
        <div className="flexbox">
          <p className={styles["token-symbol"]}>{symbol}</p>

          <AddressLink address={address} />
        </div>

        <p className={styles["token-name"]}>{name}</p>
      </div>
    </div>
  );
};

export default Token;
