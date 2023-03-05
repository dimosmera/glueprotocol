import { useQuery, UseQueryOptions } from "react-query";

import http from "services/api/config/http";

export interface SwapRoute {
  inAmount: string;
  outAmount: string;
}

interface APIResults {
  data: {
    data: SwapRoute[];
  };
}

const useFetchRoutes = (
  inputMint: string,
  outputMint: string,
  amount: number,
  queryOptions?: UseQueryOptions<
    unknown,
    unknown,
    {
      routes: SwapRoute[];
    },
    (string | number | null)[]
  >
) => {
  return useQuery(
    ["routes", inputMint, outputMint, amount],
    async () =>
      http().get(
        `https://quote-api.jup.ag/v4/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=100`
      ),
    {
      // @ts-ignore
      select: (results: APIResults) => {
        const { data } = results.data;

        return { routes: data };
      },
      ...queryOptions,
    }
  );
};

export default useFetchRoutes;
