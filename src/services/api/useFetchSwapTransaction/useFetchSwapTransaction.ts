import { useMutation } from "react-query";

import { SwapRoute } from "types";
import http from "services/api/config/http";
import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";

interface Body {
  route: SwapRoute;
  feeAccount?: string;
}

const useFetchSwapTransaction = () => {
  const { publicKey } = useGetPhantomContext();

  return useMutation(async ({ route, feeAccount }: Body) =>
    http().post("https://quote-api.jup.ag/v4/swap", {
      userPublicKey: publicKey,
      route,
      feeAccount,
    })
  );
};

export default useFetchSwapTransaction;
