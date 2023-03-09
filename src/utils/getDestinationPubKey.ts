import { PublicKey } from "@solana/web3.js";
import { getDomainKeySync, NameRegistryState } from "@bonfida/spl-name-service";

import getMainnetConnection from "utils/getMainnetConnection";

const translateBonfidaDomainToPublicAddress = async (domain: string) => {
  const connection = getMainnetConnection();

  const { pubkey } = getDomainKeySync(domain.replace(".sol", ""));

  try {
    return (
      await NameRegistryState.retrieve(connection, pubkey)
    ).registry.owner.toBase58();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getDestinationPubKey = async (destinationAddress: string) => {
  if (destinationAddress.endsWith(".sol") || destinationAddress.length < 30) {
    const recipientAddressFromDomain =
      await translateBonfidaDomainToPublicAddress(destinationAddress);

    if (recipientAddressFromDomain != null) {
      return new PublicKey(recipientAddressFromDomain);
    }

    return null;
  }

  return new PublicKey(destinationAddress);
};

export default getDestinationPubKey;
