import { IToken } from "services/api/useFetchTokens/useFetchTokens";

import TokenTag from "./TokenTag";
import styles from "./MostUsedTokens.module.css";

interface Props {
  onTokenSelect: (address: IToken["address"]) => void;
}

const MostUsedTokens = ({ onTokenSelect }: Props) => {
  return (
    <div className={styles.container}>
      <TokenTag
        symbol="SOL"
        address="So11111111111111111111111111111111111111112"
        onTokenSelect={onTokenSelect}
        logoURI="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
      />

      <TokenTag
        symbol="USDC"
        address="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        onTokenSelect={onTokenSelect}
        logoURI="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
      />

      <TokenTag
        symbol="USDH"
        address="USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX"
        onTokenSelect={onTokenSelect}
        logoURI="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX/usdh.svg"
      />

      <TokenTag
        symbol="Bonk"
        address="DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
        onTokenSelect={onTokenSelect}
        logoURI="https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I?ext=png"
      />
    </div>
  );
};

export default MostUsedTokens;
