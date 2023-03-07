import { IToken } from "services/api/useFetchTokens/useFetchTokens";

export interface Inputs {
  tokens: {
    input: IToken;
    output: IToken;
  };
  inputAmount: number;
  outputAmount: number;
  destinationAddress: string;
}

export enum ActionTypes {
  SET_INPUT_TOKEN = "SET_INPUT_TOKEN",
  SET_OUTPUT_TOKEN = "SET_OUTPUT_TOKEN",
  SET_INPUT_AMOUNT = "SET_INPUT_AMOUNT",
  SET_OUTPUT_AMOUNT = "SET_OUTPUT_AMOUNT",
  SET_DESTINATION_ADDRESS = "SET_DESTINATION_ADDRESS",
}

export type Action =
  | { type: ActionTypes.SET_INPUT_TOKEN; inputToken: IToken }
  | { type: ActionTypes.SET_OUTPUT_TOKEN; outputToken: IToken }
  | { type: ActionTypes.SET_INPUT_AMOUNT; inputAmount: number }
  | { type: ActionTypes.SET_OUTPUT_AMOUNT; outputAmount: number }
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
      return { ...state, inputAmount: action.inputAmount };
    case ActionTypes.SET_OUTPUT_AMOUNT:
      return { ...state, outputAmount: action.outputAmount };
    case ActionTypes.SET_DESTINATION_ADDRESS:
      return { ...state, destinationAddress: action.destinationAddress };
    default:
      return state;
  }
};
