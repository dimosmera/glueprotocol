import { Connection } from "@solana/web3.js";

const connection = new Connection(
  process.env.NEXT_PUBLIC_RPC_ENDPOINT
    ? process.env.NEXT_PUBLIC_RPC_ENDPOINT
    : "https://api.mainnet-beta.solana.com"
);

const getMainnetConnection = (): Connection => connection;

export default getMainnetConnection;
