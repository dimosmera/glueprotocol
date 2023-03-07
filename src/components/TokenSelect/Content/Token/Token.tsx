import Image from "components/Image";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";

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
  const { logoURI, name, symbol } = token;

  const handleSelect = () => {
    onSelect(index);
  };

  return (
    <div
      style={style}
      className={`flexbox ${styles.container}`}
      onClick={handleSelect}
    >
      <Image src={logoURI} alt="Token logo" width={35} height={35} />

      <div className={`flexbox ${styles["text-container"]}`}>
        <p className={styles["token-symbol"]}>{symbol}</p>

        <p className={styles["token-name"]}>{name}</p>
      </div>
    </div>
  );
};

export default Token;