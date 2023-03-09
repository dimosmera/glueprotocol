import { useEffect } from "react";

import useFetchRoutes from "services/api/useFetchRoutes";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import { SwapRoute, TokenType } from "types";
import { ActionTypes } from "context/UserInputsProvider/reducer";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";
import useDebouncedValue from "utils/useDebouncedValue";

/**
 * By default select the 1st and cheapest route
 */
const getFirstRoute = (routes: SwapRoute[]) => routes[0];

const getAmountToDispatch = (decimals: IToken["decimals"], amount: string) =>
  (parseFloat(amount) / Math.pow(10, decimals)).toString();

const getAmountForRoutes = (decimals: IToken["decimals"], amount: string) =>
  Math.round(parseFloat(amount) * Math.pow(10, decimals));

const useRoutes = () => {
  const { mutateAsync: fetchRoutes } = useFetchRoutes();

  const { inputs, dispatch } = useUserInputs();

  const { tokens: stateTokens, amounts, lastChanged } = inputs;

  const fireRequestForRoutes = async (type: TokenType, value: string) => {
    const { input, output } = stateTokens;

    if (type === "input") {
      try {
        const result = await fetchRoutes({
          swapMode: "ExactIn",
          slippageBps: 100,
          inputMint: input.address,
          outputMint: output.address,
          amount: getAmountForRoutes(input.decimals, value),
        });

        const { data: routes } = result.data;
        const { outAmount } = getFirstRoute(routes);

        dispatch({
          type: ActionTypes.SET_OUTPUT_AMOUNT,
          outputAmount: getAmountToDispatch(output.decimals, outAmount),
        });
      } catch (error) {
        console.error(error);
      }

      return;
    }

    try {
      const result = await fetchRoutes({
        swapMode: "ExactOut",
        slippageBps: 1,
        inputMint: input.address,
        outputMint: output.address,
        amount: getAmountForRoutes(output.decimals, value),
      });

      const { data: routes } = result.data;
      const { inAmount } = getFirstRoute(routes);

      dispatch({
        type: ActionTypes.SET_INPUT_AMOUNT,
        inputAmount: getAmountToDispatch(input.decimals, inAmount),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedInputAmount = useDebouncedValue(amounts.input, 500);
  useEffect(() => {
    if (
      !debouncedInputAmount ||
      debouncedInputAmount === "0" ||
      lastChanged !== "input"
    )
      return;

    fireRequestForRoutes("input", debouncedInputAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInputAmount, stateTokens]);

  const debouncedOutputAmount = useDebouncedValue(amounts.output, 500);
  useEffect(() => {
    if (
      !debouncedOutputAmount ||
      debouncedOutputAmount === "0" ||
      lastChanged !== "output"
    )
      return;

    fireRequestForRoutes("output", debouncedOutputAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedOutputAmount, stateTokens]);
};

export default useRoutes;
