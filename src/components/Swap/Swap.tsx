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
import useFetchRoutes from "services/api/useFetchRoutes";
import useFetchSwapTransaction from "services/api/useFetchSwapTransaction";

const Swap = () => {
  const { publicKey, signAndSendTransaction, detectPhantom, connect } =
    useGetPhantomContext();

  // input
  const mSOL_ADDRESS = "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So";
  // output
  const SAMO_ADDRESS = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU";

  const { mutateAsync: fetchSwapTransactions } = useFetchSwapTransaction();

  const inputTokenAmount = 0.005 * Math.pow(10, 9);

  // has to be called just before they hit send
  const { data, isError, isLoading } = useFetchRoutes(
    mSOL_ADDRESS,
    SAMO_ADDRESS,
    inputTokenAmount
  );
  console.log("isLoading: ", isLoading);
  console.log("data: ", data);

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

    if (!data) return;

    const { routes } = data;
    if (!routes || routes.length <= 0) {
      console.log("No routes found");
      return;
    }

    // By default select the 1st and cheapest route
    const route = routes[0];
    const { outAmount } = route;

    try {
      const connection = getMainnetConnection();

      const result = await fetchSwapTransactions({
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

      const SAMO_MINT = new PublicKey(SAMO_ADDRESS);

      const destinationWallet = new PublicKey(
        "7mMpGVExvzzdyv17Fnoq8DiWU5EKwec7yfee4Dp4hbVU"
      );

      const userDestinationTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        SAMO_MINT,
        publicKey
      );

      const merchantTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        SAMO_MINT,
        destinationWallet
      );

      const receiverAccount = await connection.getAccountInfo(
        merchantTokenAccount
      );

      console.log("receiverAccount: ", receiverAccount);

      // Create token account for receiver if it does not exist
      if (receiverAccount === null) {
        message.instructions.push(
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            SAMO_MINT,
            merchantTokenAccount,
            // owner
            destinationWallet,
            // fee payer
            publicKey
          )
        );
      }

      // Transfer slightly less than the output amount to account for slippage
      const outAmountNumber = parseFloat(outAmount);
      const slippageBps = 100;
      const transferAmountAfterSlippage =
        (outAmountNumber * (10000 - slippageBps)) / 10000;
      // it could also be outAmountNumber * (1 - slippageBps * 0.0001);
      // They have the same result which is outAmountNumber * 0.99

      console.log("transferAmountAfterSlippage: ", transferAmountAfterSlippage);
      console.log(
        "typeof   transferAmountAfterSlippage: ",
        typeof transferAmountAfterSlippage
      );

      message.instructions.push(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          // source
          userDestinationTokenAccount,
          // destination
          merchantTokenAccount,
          // owner
          publicKey,
          [],
          transferAmountAfterSlippage
        )
      );

      // compile the message and update the transaction
      transaction.message = message.compileToV0Message(
        addressLookupTableAccounts
      );

      console.log("ready");

      const signature = await signAndSendTransaction(transaction);
      console.log("signature: ", signature);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleSwap}>
      {!publicKey ? "Connect Wallet" : "Swap"}
    </button>
  );
};

export default Swap;
