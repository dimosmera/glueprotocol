import { SolanaMobileWalletAdapterProtocolErrorCode } from "@solana-mobile/mobile-wallet-adapter-protocol";

import { fireErrorAlert } from "components/SweetAlerts";

/**
 * MWA has more error codes. If you need them, add them to the switch
 */
const dealWithMWAErrors = (error: { code: number } | undefined) => {
  if (!error) {
    fireErrorAlert();
    return;
  }

  console.log("error.code: ", error.code);

  switch (error.code) {
    case SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED:
      fireErrorAlert("Connection rejected");
      break;

    case SolanaMobileWalletAdapterProtocolErrorCode.ERROR_NOT_SIGNED:
      fireErrorAlert("Sign request declined");
      break;

    default:
      fireErrorAlert();
      break;
  }
};

export default dealWithMWAErrors;
