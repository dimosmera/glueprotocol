/**
 * Returns an address with 3 dots in the middle
 */
const displayAddress = (address: string) =>
  `${address.substring(0, 4)}...${address.substring(
    address.length - 4,
    address.length
  )}`;

export default displayAddress;
