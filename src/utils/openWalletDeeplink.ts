/**
 * Send the whole URI
 */
const openWalletDeeplink = (uri: string) => {
  window.open(
    `https://solflare.com/ul/browse/${encodeURI(uri)}?ref=${encodeURI(
      "https://www.glueprotocol.com/"
    )}`,
    "_blank"
  );
};

export default openWalletDeeplink;
