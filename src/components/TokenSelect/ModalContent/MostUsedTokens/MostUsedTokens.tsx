import TokenTag from "./TokenTag";

import styles from "./MostUsedTokens.module.css";

const MostUsedTokens = () => {
  return (
    <div className={styles.container}>
      <TokenTag
        symbol="SOL"
        logoURI="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
      />

      <TokenTag
        symbol="USDC"
        logoURI="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
      />

      <TokenTag
        symbol="USDH"
        logoURI="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX/usdh.svg"
      />

      <TokenTag
        symbol="Bonk"
        logoURI="https://quei6zhlcfsxdfyes577gy7bkxmuz7qqakyt72xlbkyh7fysmoza.arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I?ext=png"
      />
    </div>
  );
};

export default MostUsedTokens;
