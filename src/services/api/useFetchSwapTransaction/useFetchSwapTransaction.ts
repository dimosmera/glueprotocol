import { useMutation } from "react-query";

import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";

import http from "services/api/config/http";
import { SwapRoute } from "services/api/useFetchRoutes/useFetchRoutes";

interface Body {
  route: SwapRoute;
}

const useFetchSwapTransaction = () => {
  const { publicKey } = useGetPhantomContext();

  return useMutation(async ({ route }: Body) =>
    http().post("https://quote-api.jup.ag/v4/swap", {
      userPublicKey: publicKey,
      route,
    })
  );
};

export default useFetchSwapTransaction;
