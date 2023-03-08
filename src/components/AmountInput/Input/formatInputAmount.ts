import { IToken } from "services/api/useFetchTokens/useFetchTokens";

/**
 * Format integer part with commas
 * Surprisingly complex to do in the input onChange since the cursor moves to the end
 * https://github.com/facebook/react/issues/955, https://stackoverflow.com/a/60131033/11688901
 */
const formatInputAmount = (value: string, symbol: IToken["symbol"]) => {
  const parts = value.split(".");
  const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimal = parts.length > 1 ? `.${parts[1]}` : "";

  return `${integer}${decimal} ${symbol}`;
};

export default formatInputAmount;
