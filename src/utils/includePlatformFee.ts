import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  Token,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { LastChanged } from "context/UserInputsProvider/reducer";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";
import getMainnetConnection from "./getMainnetConnection";

const PLATFORM_FEE_ADDRESS = "6vLq3M5wrxRjU3UEiowyUppZwapsa5PGi4VqAzkm6EyJ";
const PLATFORM_FEE_BPS = 50;

const includePlatformFee = async (
  lastChanged: LastChanged,
  inputToken: IToken,
  outputToken: IToken
) => {
  const connection = getMainnetConnection();

  const platformPublicKey = new PublicKey(PLATFORM_FEE_ADDRESS);

  // ExactIn - collect fee in the output token
  // ExactOut - in the input token
  const tokenAddress =
    lastChanged === "input" ? outputToken.address : inputToken.address;
  const tokenMint = new PublicKey(tokenAddress);

  const platformFeeTokenAccount = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    tokenMint,
    platformPublicKey
  );
  const accountInfo = await connection.getAccountInfo(platformFeeTokenAccount);

  return {
    includeFee: accountInfo !== null,
    platformFeeAccount: platformFeeTokenAccount.toString(),
    platformFee: PLATFORM_FEE_BPS,
  };
};

export default includePlatformFee;
