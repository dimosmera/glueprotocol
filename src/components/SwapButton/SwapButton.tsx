import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import {
  AddressLookupTableAccount,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

import useGetPhantomContext from "context/PhantomProvider/useGetPhantomContext";
import getMainnetConnection from "utils/getMainnetConnection";
import useFetchSwapTransaction from "services/api/useFetchSwapTransaction";
import { useUserInputs } from "context/UserInputsProvider/UserInputsProvider";

import styles from "./SwapButton.module.css";

const SwapButton = () => {
  const { publicKey, signAndSendTransaction, detectPhantom, connect } =
    useGetPhantomContext();

  const { inputs } = useUserInputs();

  const { mutateAsync: fetchSwapTransaction } = useFetchSwapTransaction();

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

    const { swapTransactionInputs, destinationAddress, tokens } = inputs;
    const outputToken = tokens.output;

    if (
      !swapTransactionInputs ||
      !destinationAddress ||
      destinationAddress === ""
    )
      return;

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

      const TOKEN_MINT = new PublicKey(outputToken.address);

      const destinationWallet = new PublicKey(destinationAddress);

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

      // compile the message and update the transaction
      transaction.message = message.compileToV0Message(
        addressLookupTableAccounts
      );

      const signature = await signAndSendTransaction(transaction);
      console.log("signature: ", signature);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleSwap} className={styles.button}>
      {!publicKey ? "Connect Wallet" : "Swap & Transfer"}
    </button>
  );
};

export default SwapButton;
