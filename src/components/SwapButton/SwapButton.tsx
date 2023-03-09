import { useState } from "react";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import {
  AddressLookupTableAccount,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";
import getMainnetConnection from "utils/getMainnetConnection";
import useFetchSwapTransaction from "services/api/useFetchSwapTransaction";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import isSolToken from "utils/isSolToken";
import getDestinationPubKey from "utils/getDestinationPubKey";
import fireSuccessAlert from "components/SuccessAlert/fireSuccessAlert";
import { fireLoadingAlert, fireErrorAlert } from "components/SweetAlerts";

import styles from "./SwapButton.module.css";

const SwapButton = () => {
  const { publicKey, signAndSendTransaction, detectPhantom, connect } =
    useGetPhantomContext();

  const { mutateAsync: fetchSwapTransaction } = useFetchSwapTransaction();

  const [loadingTransferTx, setLoadingTransferTx] = useState(false);

  const { inputs } = useUserInputs();
  const { swapTransactionInputs, destinationAddress, tokens } = inputs;

  const isDisabled =
    publicKey &&
    (!swapTransactionInputs ||
      !destinationAddress ||
      destinationAddress === "");

  const handleSwap = async () => {
    if (!publicKey) {
      const isPhantomInstalled = detectPhantom();
      if (!isPhantomInstalled) {
        // if (shouldDeeplink) {
        //   openPhantomDeeplink(window.location.href);
        //   return;
        // }

        window.open("https://phantom.app/", "_blank");
        return;
      }

      connect();
      return;
    }

    const outputToken = tokens.output;

    if (isDisabled || loadingTransferTx) return;

    fireLoadingAlert();
    setLoadingTransferTx(true);

    // @ts-ignore - Surprisingly, TS cannot infer we are checking for this
    const { route, amount: transferAmount } = swapTransactionInputs;

    try {
      const connection = getMainnetConnection();

      const result = await fetchSwapTransaction({
        route,
      });
      const { swapTransaction } = result.data;

      // deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      const addressLookupTableAccounts = await Promise.all(
        transaction.message.addressTableLookups.map(async (lookup) => {
          return new AddressLookupTableAccount({
            key: lookup.accountKey,
            state: AddressLookupTableAccount.deserialize(
              await connection
                .getAccountInfo(lookup.accountKey)
                // @ts-ignore
                .then((res) => res.data)
            ),
          });
        })
      );

      // decompile transaction message and add transfer instruction
      const message = TransactionMessage.decompile(transaction.message, {
        addressLookupTableAccounts: addressLookupTableAccounts,
      });

      const destinationWallet = await getDestinationPubKey(destinationAddress);
      if (destinationWallet === null) {
        fireErrorAlert("Failed. Check the recipient address");
        return;
      }

      if (isSolToken(outputToken.address)) {
        message.instructions.push(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: destinationWallet,
            lamports: transferAmount,
          })
        );
      } else {
        const TOKEN_MINT = new PublicKey(outputToken.address);

        const initiatorTokenAccount = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          TOKEN_MINT,
          publicKey
        );

        const recipientTokenAccount = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          TOKEN_MINT,
          destinationWallet
        );

        const recipientAccountInfo = await connection.getAccountInfo(
          recipientTokenAccount
        );

        // Create token account for receiver if it does not exist
        if (recipientAccountInfo === null) {
          message.instructions.push(
            Token.createAssociatedTokenAccountInstruction(
              ASSOCIATED_TOKEN_PROGRAM_ID,
              TOKEN_PROGRAM_ID,
              TOKEN_MINT,
              recipientTokenAccount,
              // owner
              destinationWallet,
              // fee payer
              publicKey
            )
          );
        }

        message.instructions.push(
          Token.createTransferInstruction(
            TOKEN_PROGRAM_ID,
            // source
            initiatorTokenAccount,
            // destination
            recipientTokenAccount,
            // owner
            publicKey,
            [],
            transferAmount
          )
        );
      }

      // compile the message and update the transaction
      transaction.message = message.compileToV0Message(
        addressLookupTableAccounts
      );

      const txResult = await signAndSendTransaction(transaction);
      fireSuccessAlert(txResult.signature);
    } catch (error: any) {
      console.log('error: ', error);
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
