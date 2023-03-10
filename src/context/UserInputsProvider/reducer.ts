import { IToken } from "services/api/useFetchTokens/useFetchTokens";
import { SwapRoute } from "types";

export type LastChanged = "input" | "output" | undefined;

export interface Inputs {
  lastChanged: LastChanged;
  tokens: {
    input: IToken;
    output: IToken;
  };
  amounts: {
    input: string;
    output: string;
  };
  destinationAddress: string;
  /**
   * Can be either ExactIn or ExactOut
   */
  swapTransactionInputs:
    | {
        route: SwapRoute;
        amount: number;
      }
    | undefined;
}

export enum ActionTypes {
  SET_INPUT_TOKEN = "SET_INPUT_TOKEN",
  SET_OUTPUT_TOKEN = "SET_OUTPUT_TOKEN",
  SET_INPUT_AMOUNT = "SET_INPUT_AMOUNT",
  SET_OUTPUT_AMOUNT = "SET_OUTPUT_AMOUNT",
  SET_DESTINATION_ADDRESS = "SET_DESTINATION_ADDRESS",
  CLEAR_AMOUNTS = "CLEAR_AMOUNTS",
}

export type Action =
  | {
      type: ActionTypes.SET_INPUT_TOKEN;
      inputToken: IToken;
    }
  | {
      type: ActionTypes.SET_OUTPUT_TOKEN;
      outputToken: IToken;
    }
  | {
      type: ActionTypes.SET_INPUT_AMOUNT;
      inputAmount: string;
      lastChanged?: LastChanged;
      swapTransactionInputs?: { route: SwapRoute; amount: number };
    }
  | {
      type: ActionTypes.SET_OUTPUT_AMOUNT;
      outputAmount: string;
      lastChanged?: LastChanged;
      swapTransactionInputs?: { route: SwapRoute; amount: number };
    }
  | {
      type: ActionTypes.CLEAR_AMOUNTS;
      // Will either be "" or "0"
      clearValue: string;
    }
  | { type: ActionTypes.SET_DESTINATION_ADDRESS; destinationAddress: string };

export type Dispatch = (action: Action) => void;

export const reducer = (state: Inputs, action: Action): Inputs => {
  switch (action.type) {
    case ActionTypes.SET_INPUT_TOKEN:
      return {
        ...state,
        tokens: { ...state.tokens, input: action.inputToken },
      };
    case ActionTypes.SET_OUTPUT_TOKEN:
      return {
        ...state,
        tokens: { ...state.tokens, output: action.outputToken },
      };
    case ActionTypes.SET_INPUT_AMOUNT:
      return {
        ...state,
        lastChanged: action.lastChanged || state.lastChanged,
        amounts: { ...state.amounts, input: action.inputAmount },
        swapTransactionInputs:
          action.swapTransactionInputs || state.swapTransactionInputs,
      };
    case ActionTypes.SET_OUTPUT_AMOUNT:
      return {
        ...state,
        lastChanged: action.lastChanged || state.lastChanged,
        amounts: { ...state.amounts, output: action.outputAmount },
        swapTransactionInputs:
          action.swapTransactionInputs || state.swapTransactionInputs,
      };
    case ActionTypes.CLEAR_AMOUNTS:
      return {
        ...state,
        lastChanged: undefined,
        amounts: { input: action.clearValue, output: action.clearValue },
        swapTransactionInputs: undefined,
      };
    case ActionTypes.SET_DESTINATION_ADDRESS:
      return { ...state, destinationAddress: action.destinationAddress };
    default:
      return state;
  }
};
