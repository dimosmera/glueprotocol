import { useMutation } from "react-query";

import { SwapRoute } from "types";
import http from "services/api/config/http";
import useGetWalletContext from "context/WalletProvider/useGetWalletContext";

interface Body {
  route: SwapRoute;
  feeAccount?: string;
}

const useFetchSwapTransaction = () => {
  const { publicKey } = useGetWalletContext();

  return useMutation(async ({ route, feeAccount }: Body) =>
    http().post("https://quote-api.jup.ag/v4/swap", {
      userPublicKey: publicKey,
      route,
      feeAccount,
    })
  );
};

export default useFetchSwapTransaction;
