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

import prepareSwapTransaction from "./prepareSwapTransaction";
import styles from "./SwapButton.module.css";

// TODO: disconnect when MWA
// auth token

const SwapButton = () => {
  const { publicKey, signAndSendTransaction, detectPhantom, connect } =
    useGetPhantomContext();

  const { mutateAsync: fetchSwapTransaction } = useFetchSwapTransaction();

  const [loadingTransferTx, setLoadingTransferTx] = useState(false);

  const { inputs } = useUserInputs();
  const {
    swapTransactionInputs,
    destinationAddress,
    tokens,
    lastChanged,
    error,
  } = inputs;

  const isDisabled =
    publicKey &&
    (!swapTransactionInputs ||
      !destinationAddress ||
      destinationAddress === "" ||
      error !== undefined);

  const handleSwap = async () => {
    if (!publicKey) {
      connect();
      return;
    }

    const inputToken = tokens.input;
    const outputToken = tokens.output;

    if (isDisabled || loadingTransferTx) return;

    fireLoadingAlert();
    setLoadingTransferTx(true);

    // @ts-ignore - TS cannot infer we are checking for this
    const { route, amount: transferAmount } = swapTransactionInputs;

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

      const transaction = await prepareSwapTransaction(
        swapTransaction,
        destinationAddress,
        outputToken,
        publicKey,
        transferAmount
      );
      if (!transaction) return;

      if (!detectPhantom()) {
        if (isAndroid()) {
          try {
            await transact(async (wallet) => {
              const { auth_token: authToken } = await wallet.authorize({
                cluster: "mainnet-beta",
                identity: {
                  uri: "https://www.glueprotocol.com/",
                  icon: "/glue-icon.png",
                  name: "Glue Protocol",
                },
              });

              // TODO: authToken logic
              console.log("authToken: ", authToken);

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

              console.log('txSignature: ', txSignature);

              const txBuffer = Buffer.from(txSignature, "base64");

              const base58EncodedSignature = bs58.encode(txBuffer);
              console.log('base58EncodedSignature: ', base58EncodedSignature);

              const one = txBuffer.toString("ascii");
              console.log('one: ', one);
              const two = txBuffer.toString("base64");
              console.log('two: ', two);
              const four = txBuffer.toString("binary");
              console.log('four: ', four);
              const five = txBuffer.toString("hex");
              console.log('five: ', five);
              const six = txBuffer.toString("latin1");
              console.log('six: ', six);
              const seen = txBuffer.toString("ucs-2");
              console.log('seen: ', seen);
              const eig = txBuffer.toString("ucs2");
              console.log('eig: ', eig);
              const nine = txBuffer.toString("utf-8");
              console.log('nine: ', nine);
              const ten = txBuffer.toString("utf16le");
              console.log('ten: ', ten);
              const ele = txBuffer.toString("utf8");
              console.log('ele: ', ele);
              const twi = txBuffer.toString();
              console.log('twi: ', twi);

              fireSuccessAlert(txSignature);
            });
          } catch (error: any) {
            console.log("error: ", error);
            console.error(error);

            dealWithMWAErrors(error);
          }

          return;
        }
      }

      const txResult = await signAndSendTransaction(transaction);
      fireSuccessAlert(txResult.signature);
    } catch (error: any) {
      console.error(error);

      window.alert(JSON.stringify(error));

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
