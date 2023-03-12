import React, { createContext, useContext, useReducer } from "react";

import { Action, Inputs, reducer } from "./reducer";

interface IContext {
  inputs: Inputs;
  dispatch: React.Dispatch<Action>;
}

// @ts-ignore
const UserInputsContext = createContext<IContext>(undefined);

interface Props {
  children: React.ReactElement;
}

/**
 * Keeps the state for user inputs (input token, output token, amounts and destination)
 * Provides it to the components that need it
 */
const UserInputsProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    lastChanged: undefined,
    tokens: {
      input: {
        address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        name: "USD Coin",
        symbol: "USDC",
        decimals: 6,
        logoURI:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
      },
      output: {
        address: "So11111111111111111111111111111111111111112",
        name: "Wrapped SOL",
        symbol: "SOL",
        decimals: 9,
        logoURI:
          "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      },
    },
    amounts: {
      input: "",
      output: "",
    },
    destinationAddress: "",
    swapTransactionInputs: undefined,
    error: undefined,
    paymentLinkVisible: false,
    paymentLinkURL: "",
  });

  return (
    <UserInputsContext.Provider value={{ inputs: state, dispatch }}>
      {children}
    </UserInputsContext.Provider>
  );
};

/**
 * Use this function to get/set the user inputs
 */
export const useUserInputs = () => {
  const { inputs, dispatch } = useContext(UserInputsContext);
  return { inputs, dispatch };
};

export default UserInputsProvider;
