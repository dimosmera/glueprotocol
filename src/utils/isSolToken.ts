import { IToken } from "services/api/useFetchTokens/useFetchTokens";

/**
 * Checks if a given token address is the address of the SOL token
 */
const isSolToken = (tokenAddress: IToken["address"]) =>
  tokenAddress === "So11111111111111111111111111111111111111112";

export default isSolToken;
