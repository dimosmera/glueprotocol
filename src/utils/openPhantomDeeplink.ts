/**
 * Send the whole URI
 */
const openPhantomDeeplink = (uri: string) => {
  window.open(
    `https://phantom.app/ul/browse/${encodeURI(uri)}?ref=${encodeURI(
      "https://www.glueprotocol.com/"
    )}`,
    "_blank"
  );
};

export default openPhantomDeeplink;
