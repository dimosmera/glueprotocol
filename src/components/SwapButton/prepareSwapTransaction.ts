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

import isSolToken from "utils/isSolToken";
import getDestinationPubKey from "utils/getDestinationPubKey";
import getMainnetConnection from "utils/getMainnetConnection";
import { fireErrorAlert } from "components/SweetAlerts";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";

const prepareSwapTransaction = async (
  swapTransaction: string,
  destinationAddress: string,
  outputToken: IToken,
  publicKey: PublicKey,
  transferAmount: number
) => {
  const connection = getMainnetConnection();

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
  transaction.message = message.compileToV0Message(addressLookupTableAccounts);

  return transaction;
};

export default prepareSwapTransaction;
