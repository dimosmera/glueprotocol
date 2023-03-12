import { useMutation } from "react-query";

import http from "services/api/config/http";

const useCreateDroplink = () => {
  return useMutation(async () =>
    http().post(
      "https://droplinks.io/api/v1/drop-links/create/",
      { campaign: "glow-test", dropLinkType: "SPL" },
      { headers: { "X-API-KEY": process.env.NEXT_PUBLIC_DROPLINKS_API_KEY } }
    )
  );
};

export default useCreateDroplink;
