import { useEffect } from "react";

import useFetchRoutes from "services/api/useFetchRoutes";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import { SwapRoute, TokenType } from "types";
import {
  ActionTypes,
  Dispatch,
  InputError,
} from "context/UserInputsProvider/reducer";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";
import useDebouncedValue from "utils/useDebouncedValue";
import includePlatformFee from "utils/includePlatformFee";
import useParseRequestURL from "hooks/useParseRequestURL";

/**
 * By default select the 1st and cheapest route
 */
const getFirstRoute = (routes: SwapRoute[]) => routes[0];

export const getAmountToDispatch = (
  decimals: IToken["decimals"],
  amount: string
) => (parseFloat(amount) / Math.pow(10, decimals)).toString();

const getAmountForRoutes = (decimals: IToken["decimals"], amount: string) =>
  Math.round(parseFloat(amount) * Math.pow(10, decimals));

const dealWithLiquidityErrors = (
  routes: SwapRoute[],
  errorFromState: InputError | undefined,
  errorType: InputError["type"],
  dispatch: Dispatch
) => {
  if (!routes || routes.length === 0) {
    dispatch({
      type: ActionTypes.SET_ERROR,
      error: { type: errorType, message: "No liquidity on this asset pair" },
    });

    return "ErrorSet";
  }

  if (
    errorFromState &&
    (errorFromState.type === "ExactOutLiquidity" ||
      errorFromState.type === "ExactInLiquidity")
  ) {
    dispatch({ type: ActionTypes.CLEAR_ERRORS });

    return "ErrorClear";
  }
};

const useRoutes = () => {
  const { mutateAsync: fetchRoutes } = useFetchRoutes();

  const { inputs, dispatch } = useUserInputs();

  const { tokens: stateTokens, amounts, lastChanged, error } = inputs;

  useParseRequestURL();

  const fireRequestForRoutes = async (type: TokenType, value: string) => {
    const { input, output } = stateTokens;

    const { includeFee, platformFee } = await includePlatformFee(
      type,
      input,
      output
    );

    if (type === "input") {
      try {
        const result = await fetchRoutes({
          swapMode: "ExactIn",
          slippageBps: 100,
          inputMint: input.address,
          outputMint: output.address,
          amount: getAmountForRoutes(input.decimals, value),
          platformFee: includeFee ? platformFee : undefined,
        });

        const { data: routes } = result.data;

        const errorAction = dealWithLiquidityErrors(
          routes,
          error,
          "ExactInLiquidity",
          dispatch
        );
        if (errorAction === "ErrorSet") return;

        const route = getFirstRoute(routes);
        const { outAmount } = route;

        dispatch({
          type: ActionTypes.SET_OUTPUT_AMOUNT,
          outputAmount: getAmountToDispatch(output.decimals, outAmount),
          swapTransactionInputs: { route, amount: parseFloat(outAmount) },
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
        platformFee: includeFee ? platformFee : undefined,
      });

      const { data: routes } = result.data;

      const errorAction = dealWithLiquidityErrors(
        routes,
        error,
        "ExactOutLiquidity",
        dispatch
      );
      if (errorAction === "ErrorSet") return;

      const route = getFirstRoute(routes);
      const { inAmount, outAmount } = route;

      dispatch({
        type: ActionTypes.SET_INPUT_AMOUNT,
        inputAmount: getAmountToDispatch(input.decimals, inAmount),
        swapTransactionInputs: { route, amount: parseFloat(outAmount) },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedInputAmount = useDebouncedValue(amounts.input, 500);
  useEffect(() => {
    if (
      !debouncedInputAmount ||
      parseFloat(debouncedInputAmount) === 0 ||
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
      parseFloat(debouncedOutputAmount) === 0 ||
      lastChanged !== "output"
    )
      return;

    fireRequestForRoutes("output", debouncedOutputAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedOutputAmount, stateTokens]);
};

export default useRoutes;
