import { useEffect, useState } from "react";
import { Elusiv, SEED_MESSAGE } from "@elusiv/sdk";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";
import { useUserInputs } from "context/ElusivInputsProvider/ElusivInputsProvider";
import fireSuccessAlert from "components/SuccessAlert/fireSuccessAlert";
import { fireLoadingAlert, fireErrorAlert } from "components/SweetAlerts";
import getMainnetConnection from "utils/getMainnetConnection";
import classList from "utils/classList";

import styles from "./ElusivSwapButton.module.css";

const ElusivSwapButton = () => {
  const { publicKey, signMessage, signTransaction, detectPhantom, connect } =
    useGetPhantomContext();

  const [loadingTransferTx, setLoadingTransferTx] = useState(false);
  const [loadingTopupTx, setLoadingTopupTx] = useState(false);
  const [elusivInstance, setElusivInstance] = useState<null | Elusiv>(null);
  const [elusivPrivateBalance, setElusivPrivateBalance] = useState(0);

  const { inputs } = useUserInputs();
  const { destinationAddress, amount, token } = inputs;

  const isSendDisabled =
    (publicKey &&
      elusivInstance &&
      (!amount || !destinationAddress || destinationAddress === "")) ||
    loadingTransferTx ||
    loadingTopupTx;

  const isTopupDisabled =
    !publicKey || loadingTransferTx || loadingTopupTx || !elusivInstance;

  const getElusivInstance = async (pK: PublicKey) => {
    const connection = getMainnetConnection();

    try {
      const signedMessage = await signMessage(
        Buffer.from(SEED_MESSAGE, "utf-8")
      );
      const { signature } = signedMessage;

      const elusiv = await Elusiv.getElusivInstance(
        signature,
        pK,
        connection,
        "mainnet-beta"
      );

      setElusivInstance(elusiv);
    } catch (err: any) {
      console.error(err);

      if (err && err === "Transaction cancelled") {
        fireErrorAlert("Canceled");
      } else {
        fireErrorAlert("Failed. Please try again.");
      }
    }
  };

  const getPrivateBalance = async (elusiv: Elusiv) => {
    const privateBalance = await elusiv.getLatestPrivateBalance("LAMPORTS");
    setElusivPrivateBalance(Number(privateBalance) / LAMPORTS_PER_SOL);
  };

  useEffect(() => {
    if (!elusivInstance) return;

    getPrivateBalance(elusivInstance);
  }, [elusivInstance]);

  const handleTopup = async () => {
    if (!detectPhantom()) {
      window.open("https://solflare.com/", "_blank");
      return;
    }

    if (isTopupDisabled) return;

    fireLoadingAlert("Topping up");
    setLoadingTopupTx(true);

    try {
      const topupTxData = await elusivInstance.buildTopUpTx(
        LAMPORTS_PER_SOL / 100,
        "LAMPORTS"
      );

      // @ts-ignore
      topupTxData.tx = await signTransaction(topupTxData.tx);

      const storeSig = await elusivInstance.sendElusivTx(topupTxData);

      fireSuccessAlert({ txId: storeSig.signature });

      await getPrivateBalance(elusivInstance);
    } catch (err: any) {
      console.error(err);

      if (err && err.message === "Failed to sign transaction") {
        fireErrorAlert("Canceled");
      } else {
        fireErrorAlert("Failed. Please try again.");
      }
    }

    setLoadingTopupTx(false);
  };

  const handleElusivSend = async () => {
    if (!publicKey) {
      connect();

      return;
    }

    if (!elusivInstance) {
      getElusivInstance(publicKey);

      return;
    }

    if (isSendDisabled) return;

    if (Number(amount) > elusivPrivateBalance) {
      fireErrorAlert("Not enough in your private balance. Please top up");

      return;
    }

    fireLoadingAlert("Sending.. This may take a while. Please hold");
    setLoadingTransferTx(true);

    const destPublicKey = new PublicKey(destinationAddress);

    try {
      const sendTx = await elusivInstance.buildSendTx(
        Math.round(parseFloat(amount) * Math.pow(10, token.decimals)),
        destPublicKey,
        "LAMPORTS"
      );

      const sendSig = await elusivInstance.sendElusivTx(sendTx);

      fireSuccessAlert({ txId: sendSig.signature });

      await getPrivateBalance(elusivInstance);
    } catch (err: any) {
      console.error(err);

      fireErrorAlert("Failed. Please try again.");
    }

    setLoadingTransferTx(false);
  };

  return (
    <>
      <div className={`flexbox ${styles["topup-row"]}`}>
        <p
          className={classList([
            styles["balance-text"],
            !elusivInstance ? styles["balance-text-disabled"] : "",
          ])}
        >
          {!elusivInstance
            ? "Private balance: -"
            : `Private balance: ${elusivPrivateBalance} SOL`}
        </p>

        <button
          className={styles["topup-button"]}
          onClick={handleTopup}
          disabled={isTopupDisabled}
        >
          Top up
        </button>
      </div>

      <button
        onClick={
          !elusivInstance && publicKey
            ? () => getElusivInstance(publicKey)
            : handleElusivSend
        }
        className={styles.button}
        disabled={isSendDisabled}
      >
        {!publicKey
          ? "Connect Wallet"
          : !elusivInstance
          ? "Get started with Elusiv"
          : "Send Privately"}
      </button>
    </>
  );
};

export default ElusivSwapButton;
