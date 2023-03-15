import { useState } from "react";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol";
import bs58 from "bs58";

import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";
import useFetchSwapTransaction from "services/api/useFetchSwapTransaction";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import fireSuccessAlert from "components/SuccessAlert/fireSuccessAlert";
import { fireLoadingAlert, fireErrorAlert } from "components/SweetAlerts";
import includePlatformFee from "utils/includePlatformFee";
import isAndroid from "utils/isAndroid";
import dealWithMWAErrors from "utils/dealWithMWAErrors";
import isSolToken from "utils/isSolToken";

import prepareSwapTransaction from "./prepareSwapTransaction";
import styles from "./SwapButton.module.css";

const SwapButton = () => {
  const {
    publicKey,
    signAndSendTransaction,
    detectPhantom,
    connect,
    authoriseWithMobileWallet,
  } = useGetPhantomContext();

  const { mutateAsync: fetchSwapTransaction } = useFetchSwapTransaction();

  const [loadingTransferTx, setLoadingTransferTx] = useState(false);

  const { inputs } = useUserInputs();
  const {
    swapTransactionInputs,
    destinationAddress,
    tokens,
    lastChanged,
    error,
    paymentLink,
    paymentLinkVisible,
  } = inputs;

  const isDisabled =
    publicKey &&
    (!swapTransactionInputs ||
      (!paymentLinkVisible &&
        (!destinationAddress || destinationAddress === "")) ||
      (paymentLinkVisible && (!paymentLink.url || paymentLink.url === "")) ||
      error !== undefined);

  const handleSwap = async () => {
    if (!publicKey) {
      connect();
      return;
    }

    const inputToken = tokens.input;
    const outputToken = tokens.output;

    if (isDisabled || loadingTransferTx) return;

    // @ts-ignore - TS cannot infer we are checking for this
    const { route, amount: transferAmount } = swapTransactionInputs;

    if (
      isSolToken(outputToken.address) &&
      paymentLinkVisible &&
      transferAmount < 10_000_000
    ) {
      fireErrorAlert(
        "When using payment links, the minimum transfer amount is 0.01 SOL",
        10_000
      );
      return;
    }

    fireLoadingAlert();
    setLoadingTransferTx(true);

    try {
      const { includeFee, platformFeeAccount } = await includePlatformFee(
        lastChanged,
        inputToken,
        outputToken
      );

      const result = await fetchSwapTransaction({
        route,
        feeAccount: includeFee ? platformFeeAccount : undefined,
      });
      const { swapTransaction } = result.data;

      const destination = paymentLinkVisible
        ? paymentLink.publicKey
        : destinationAddress;

      const transaction = await prepareSwapTransaction(
        swapTransaction,
        destination,
        outputToken,
        publicKey,
        transferAmount
      );
      if (!transaction) return;

      if (!detectPhantom()) {
        if (isAndroid()) {
          try {
            await transact(async (wallet) => {
              await authoriseWithMobileWallet(wallet);

              const serializedVersionedTx = transaction.serialize();
              const bufferTx = Buffer.from(
                serializedVersionedTx.buffer,
                serializedVersionedTx.byteOffset,
                serializedVersionedTx.byteLength
              );

              const {
                signatures: [txSignature],
              } = await wallet.signAndSendTransactions({
                payloads: [bufferTx.toString("base64")],
              });

              const txBuffer = Buffer.from(txSignature, "base64");
              const decodedSignature = bs58.encode(txBuffer);
              fireSuccessAlert({ txId: decodedSignature });
            });
          } catch (error: any) {
            console.log("MWA signAndSendTransactions error: ", error);
            console.error(error);

            dealWithMWAErrors(error);
          }

          return;
        }
      }

      // skipPreflight defaults to false, but there's a phantom bug on mobile where it crashes if options passed are empty
      // maybe they fix it in the future, then the options can be removed from here
      const txResult = await signAndSendTransaction(transaction, {
        skipPreflight: false,
      });
      fireSuccessAlert({ txId: txResult.signature });
    } catch (error: any) {
      console.error(error);

      if (error && error.code === 4001) {
        fireErrorAlert("Canceled");
      } else {
        fireErrorAlert("Failed. Please try again");
      }
    } finally {
      setLoadingTransferTx(false);
    }
  };

  return (
    <button
      onClick={handleSwap}
      className={styles.button}
      disabled={isDisabled || loadingTransferTx}
    >
      {!publicKey ? "Connect Wallet" : "Swap & Transfer"}
    </button>
  );
};

export default SwapButton;
