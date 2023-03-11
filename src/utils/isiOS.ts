/**
 * Testing for user agent is not ideal
 * So make sure that returning <false> is not a big problem for you
 * The Mozilla/5.0 part is for Google chrome on iOS
 */
const isiOS = () => {
  try {
    if (!navigator || !navigator.userAgent) return false;

    if (
      /iPhone|iPad|iPod|Mozilla\/5.0 \(iPad|Mozilla\/5.0 \(iPod|Mozilla\/5.0 \(iPhone/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export default isiOS;
