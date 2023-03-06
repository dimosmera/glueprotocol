import { useQuery, UseQueryOptions } from "react-query";

import http from "services/api/config/http";

export interface IToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

interface APIResults {
  data: IToken[];
}

const useFetchTokens = (
  queryOptions?: UseQueryOptions<
    unknown,
    unknown,
    {
      tokens: IToken[];
    },
    (string | number | null)[]
  >
) => {
  return useQuery(
    ["tokens", "all"],
    async () => http().get("https://token.jup.ag/all"),
    {
      // @ts-ignore
      select: (results: APIResults) => {
        return { tokens: results.data };
      },
      ...queryOptions,
    }
  );
};

export default useFetchTokens;
