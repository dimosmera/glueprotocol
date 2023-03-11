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
import {
  transact,
  SolanaMobileWalletAdapterProtocolErrorCode,
} from "@solana-mobile/mobile-wallet-adapter-protocol";
import bs58 from "bs58";

import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";
import getMainnetConnection from "utils/getMainnetConnection";
import useFetchSwapTransaction from "services/api/useFetchSwapTransaction";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";
import isSolToken from "utils/isSolToken";
import getDestinationPubKey from "utils/getDestinationPubKey";
import fireSuccessAlert from "components/SuccessAlert/fireSuccessAlert";
import { fireLoadingAlert, fireErrorAlert } from "components/SweetAlerts";
import includePlatformFee from "utils/includePlatformFee";
import isAndroid from "utils/isAndroid";

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

    const inputToken = tokens.input;
    const outputToken = tokens.output;

    if (isDisabled || loadingTransferTx) return;

    fireLoadingAlert();
    setLoadingTransferTx(true);

    // @ts-ignore - Surprisingly, TS cannot infer we are checking for this
    const { route, amount: transferAmount } = swapTransactionInputs;

    try {
      const connection = getMainnetConnection();

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

      console.log("Before transaction.message");
      console.log('transaction: ', transaction);

      // compile the message and update the transaction
      transaction.message = message.compileToV0Message(
        addressLookupTableAccounts
      );

      if (isAndroid()) {
        console.log("It's android. Lets go in");
        try {
          await transact(async (wallet) => {
            const { accounts } = await wallet.authorize({
              cluster: "mainnet-beta",
              identity: {
                uri: "https://www.glueprotocol.com/",
                icon: "/glue-icon.png",
                name: "Glue Protocol",
              },
            });

            const bufferData = Buffer.from(accounts[0].address, "base64");
            const publicKey = bs58.encode(bufferData);
            console.log("publicKey: ", publicKey);

            await wallet
              .signAndSendTransactions({
                payloads: [transaction.serialize().toString()],
              })
              .then((results) => {
                console.log("results: ", results);
                window.alert(results);
                // fireSuccessAlert(txSignature);
              })
              .catch((error: any) => {
                console.error(error);

                if (error) {
                  if (
                    error.code ===
                    SolanaMobileWalletAdapterProtocolErrorCode.ERROR_NOT_SIGNED
                  ) {
                    fireErrorAlert("Sign request declined");

                    return;
                  }
                }

                fireErrorAlert();
              });
          });
        } catch (error: any) {
          console.log("error: ", error);
          console.error(error);

          if (error) {
            if (
              error.code ===
              SolanaMobileWalletAdapterProtocolErrorCode.ERROR_AUTHORIZATION_FAILED
            ) {
              fireErrorAlert("Connection rejected");
              return;
            }
          }

          fireErrorAlert();
        }

        return;
      }

      console.log("outside of android");

      const txResult = await signAndSendTransaction(transaction);
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
