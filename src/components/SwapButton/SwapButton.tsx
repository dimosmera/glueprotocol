import { useState } from "react";

import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";
import useFetchSwapTransaction from "services/api/useFetchSwapTransaction";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import fireSuccessAlert from "components/SuccessAlert/fireSuccessAlert";
import { fireLoadingAlert, fireErrorAlert } from "components/SweetAlerts";
import includePlatformFee from "utils/includePlatformFee";

import prepareSwapTransaction from "./prepareSwapTransaction";
import styles from "./SwapButton.module.css";

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

      const txResult = await signAndSendTransaction(transaction);
      if (!txResult) throw Error();

      fireSuccessAlert(txResult.signature);
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
