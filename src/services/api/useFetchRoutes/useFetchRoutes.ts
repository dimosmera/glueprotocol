import { useMutation } from "react-query";

import http from "services/api/config/http";

interface Body {
  inputMint: string;
  outputMint: string;
  amount: number;
  swapMode: "ExactIn" | "ExactOut";
  /**
   * This is in basis points (1/100th of a percent). So 100 = 1%.
   * Transactions will revert if the price changes unfavorably by more than this percentage
   * For ExactOut, keep this low to ensure you get at least the amount specified
   */
  slippageBps: number;
}

/**
 * ExactIn vs ExactOut swapMode
 * For <ExactIn> <amount> should be <inputMint>: How much of the input token do we want to swap?
 * For <ExactOut> <amount> should be <outputMint>: How much should the receiver get of their token of choice?
 * ---,---
 * For <ExactIn> you need to pass <outAmount> to the transfer ix
 * For <ExactOut> you also need to pass <outAmount>!
 */
const useFetchRoutes = () => {
  return useMutation(
    async ({ swapMode, inputMint, outputMint, amount, slippageBps }: Body) =>
      http().get(
        `https://quote-api.jup.ag/v4/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}&swapMode=${swapMode}`
      )
  );
};

export default useFetchRoutes;
