import React, { createContext, useContext, useReducer } from "react";

import { Action, Inputs, reducer } from "./reducer";

interface IContext {
  inputs: Inputs;
  dispatch: React.Dispatch<Action>;
}

// @ts-ignore
const ElusivInputsContext = createContext<IContext>(undefined);

interface Props {
  children: React.ReactElement;
}

/**
 * Keeps the state for user inputs (token, amount and destination)
 * Provides it to the components that need it
 */
const ElusivInputsProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    token: {
      address: "So11111111111111111111111111111111111111112",
      name: "Wrapped SOL",
      symbol: "SOL",
      decimals: 9,
      logoURI:
        "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    },
    amount: "",
    destinationAddress: "",
  });

  return (
    <ElusivInputsContext.Provider value={{ inputs: state, dispatch }}>
      {children}
    </ElusivInputsContext.Provider>
  );
};

/**
 * Use this function to get/set the user inputs
 */
export const useUserInputs = () => {
  const { inputs, dispatch } = useContext(ElusivInputsContext);
  return { inputs, dispatch };
};

export default ElusivInputsProvider;
