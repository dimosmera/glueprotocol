import { IToken } from "services/api/useFetchTokens/useFetchTokens";

export type LastChanged = "input" | "output" | undefined;

export interface Inputs {
  token: IToken;
  amount: string;
  destinationAddress: string;
}

export enum ActionTypes {
  SET_TOKEN = "SET_TOKEN",
  SET_AMOUNT = "SET_AMOUNT",
  SET_DESTINATION_ADDRESS = "SET_DESTINATION_ADDRESS",
  CLEAR_AMOUNT = "CLEAR_AMOUNT",
}

export type Action =
  | {
      type: ActionTypes.SET_TOKEN;
      token: IToken;
    }
  | {
      type: ActionTypes.SET_AMOUNT;
      amount: string;
    }
  | {
      type: ActionTypes.CLEAR_AMOUNT;
      // Will either be "" or "0"
      clearValue: string;
    }
  | { type: ActionTypes.SET_DESTINATION_ADDRESS; destinationAddress: string };

export type Dispatch = (action: Action) => void;

export const reducer = (state: Inputs, action: Action): Inputs => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case ActionTypes.SET_AMOUNT:
      return {
        ...state,
        amount: action.amount,
      };
    case ActionTypes.CLEAR_AMOUNT:
      return {
        ...state,
        amount: action.clearValue,
      };
    case ActionTypes.SET_DESTINATION_ADDRESS:
      return { ...state, destinationAddress: action.destinationAddress };

    default:
      return state;
  }
};
