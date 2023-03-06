import React, { createContext, useContext } from "react";

import useFetchTokens, {
  IToken,
} from "services/api/useFetchTokens/useFetchTokens";

const TokensContext = createContext<{ tokens: IToken[] | undefined }>({
  tokens: undefined,
});

interface Props {
  children: React.ReactNode;
}

// TODO: Change discord URL

const TokensProvider = ({ children }: Props) => {
  const { data, isError } = useFetchTokens();

  return (
    <TokensContext.Provider value={{ tokens: data?.tokens }}>
      {isError ? (
        <p>
          Something went wrong. Please{" "}
          <a
            href="https://discord.gg/GKbBazkvN2"
            target="_blank"
            rel="noopener"
            style={{ textDecoration: "underline", color: "#2669F5" }}
          >
            reach out
          </a>
        </p>
      ) : (
        children
      )}
    </TokensContext.Provider>
  );
};

export default TokensProvider;

const error =
  "Seems like tokens are not defined but that should never be the case, since we are gracefully handling Error and Loading states.";

/**
 * Use this function to retrieve the available tokens
 */
export const useGetTokens = (): { tokens: IToken[] | undefined } => {
  const results = useContext(TokensContext);
  if (!results) throw new Error(error);

  return { tokens: results.tokens };
};
