import Transfer from "pages-lib/Transfer";
import TokensProvider from "context/TokensProvider";
import UserInputsProvider from "context/UserInputsProvider";
import Layout from "components/Layout";

export default function TransferPage() {
  return (
    <Layout>
      <TokensProvider>
        <UserInputsProvider>
          <Transfer />
        </UserInputsProvider>
      </TokensProvider>
    </Layout>
  );
}
