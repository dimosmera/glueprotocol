import { IToken } from "services/api/useFetchTokens/useFetchTokens";
import { SwapRoute } from "types";

export type LastChanged = "input" | "output" | undefined;

export interface InputError {
  type: "General" | "ExactInLiquidity" | "ExactOutLiquidity";
  message: string;
}

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
  error: InputError | undefined;
  paymentLinkVisible: boolean;
  paymentLinkURL: string;
}

export enum ActionTypes {
  SET_INPUT_TOKEN = "SET_INPUT_TOKEN",
  SET_OUTPUT_TOKEN = "SET_OUTPUT_TOKEN",
  SET_INPUT_AMOUNT = "SET_INPUT_AMOUNT",
  SET_OUTPUT_AMOUNT = "SET_OUTPUT_AMOUNT",
  SET_DESTINATION_ADDRESS = "SET_DESTINATION_ADDRESS",
  SET_ERROR = "SET_ERROR",
  CLEAR_ERRORS = "CLEAR_ERRORS",
  CLEAR_AMOUNTS = "CLEAR_AMOUNTS",
  SET_PAYMENT_LINK_VISIBILITY = "SET_PAYMENT_LINK_VISIBILITY",
  SET_PAYMENT_LINK_URL = "SET_PAYMENT_LINK_URL",
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
  | {
      type: ActionTypes.SET_ERROR;
      error: InputError;
    }
  | {
      type: ActionTypes.CLEAR_ERRORS;
    }
  | {
      type: ActionTypes.SET_PAYMENT_LINK_VISIBILITY;
    }
  | {
      type: ActionTypes.SET_PAYMENT_LINK_URL;
      paymentLinkURL: string;
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
    case ActionTypes.CLEAR_ERRORS:
      return { ...state, error: undefined };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.error };
    case ActionTypes.SET_PAYMENT_LINK_VISIBILITY:
      return { ...state, paymentLinkVisible: !state.paymentLinkVisible };
    case ActionTypes.SET_PAYMENT_LINK_URL:
      return { ...state, paymentLinkURL: action.paymentLinkURL };

    default:
      return state;
  }
};
