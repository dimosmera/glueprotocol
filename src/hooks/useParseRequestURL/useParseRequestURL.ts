import { useEffect } from "react";

import { useGetTokens } from "context/TokensProvider/TokensProvider";
import { getAmountToDispatch } from "components/AmountInput/Input/useRoutes";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import { ActionTypes } from "context/UserInputsProvider/reducer";

const useParseRequestURL = () => {
  const { tokens } = useGetTokens();

  const { dispatch } = useUserInputs();

  useEffect(() => {
    try {
      if (!window.location || !tokens) return;

      const urlParams = new URLSearchParams(window.location.search);

      const address = urlParams.get("address");
      const amount = urlParams.get("amount");
      const token = urlParams.get("token");

      if (!amount || !address || !token) return;

      const requestToken = tokens.find((t) => t.address === token);

      if (!requestToken) return;

      const amountToDispatch = getAmountToDispatch(
        requestToken.decimals,
        amount
      );

      dispatch({
        type: ActionTypes.SET_OUTPUT_AMOUNT,
        outputAmount: amountToDispatch,
        lastChanged: "output",
      });

      dispatch({
        type: ActionTypes.SET_OUTPUT_TOKEN,
        outputToken: requestToken,
      });

      dispatch({
        type: ActionTypes.SET_DESTINATION_ADDRESS,
        destinationAddress: address,
      });
    } catch (error) {
      console.error(error);
    }
  }, [tokens, dispatch]);
};

export default useParseRequestURL;
