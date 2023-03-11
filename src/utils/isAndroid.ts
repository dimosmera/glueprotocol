/**
 * Testing for user agent is not ideal
 * So make sure that returning <false> is not a big problem for you
 */
const isAndroid = () => {
  try {
    if (!navigator || !navigator.userAgent) return false;

    if (/Android/i.test(navigator.userAgent)) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export default isAndroid;
