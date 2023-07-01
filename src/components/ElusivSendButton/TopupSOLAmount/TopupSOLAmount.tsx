import { ChangeEvent, useState } from "react";
import { Inter } from "next/font/google";

import Image from "components/Image";

import styles from "./TopupSOLAmount.module.css";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  onTopUp: (solAmount: number) => void;
}

const MIN_AMOUNT = 0.0001;

const TopupSOLAmount = ({ onTopUp }: Props) => {
  const [sol, setSol] = useState(0.5);

  const handleOnBlurForSol = () => {
    if (!sol || sol < MIN_AMOUNT) setSol(MIN_AMOUNT);
  };

  return (
    <div className={`flexbox ${inter.className} ${styles.container}`}>
      <div className={`flexbox ${styles["row-container"]}`}>
        <div className={`flexbox ${styles["symbol-container"]}`}>
          <div className={`flexbox ${styles["logo-container"]}`}>
            <Image
              src={"https://solana.com/src/img/branding/solanaLogoMark.png"}
              alt="SOL token image"
              width="100%"
              height="100%"
            />
          </div>
        </div>

        <div className={`flexbox ${styles["input-container"]}`}>
          <input
            className={`semi-bold-text ${styles["sol-input"]}`}
            value={sol}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSol(parseFloat(e.target.value))
            }
            onBlur={handleOnBlurForSol}
            type="number"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]*$"
            min={MIN_AMOUNT}
          />
        </div>
      </div>

      <div className={`flexbox ${styles["tags-container"]}`}>
        <div className={`flexbox ${styles["tag"]}`} onClick={() => setSol(1)}>
          <p>◎ 1</p>
        </div>

        <div className={`flexbox ${styles["tag"]}`} onClick={() => setSol(5)}>
          <p>◎ 5</p>
        </div>

        <div className={`flexbox ${styles["tag"]}`} onClick={() => setSol(10)}>
          <p>◎ 10</p>
        </div>
      </div>

      <div className={styles["topup-button"]} onClick={() => onTopUp(sol)}>
        <p>Top Up</p>
      </div>
    </div>
  );
};

export default TopupSOLAmount;
