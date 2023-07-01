import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import "styles/designTokens.css";
import "styles/globals.css";
import "styles/utilities.css";

import AppQueryClientProvider from "context/AppQueryClientProvider";
import WalletProvider from "context/WalletProvider";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppQueryClientProvider>
      <WalletProvider>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </WalletProvider>
    </AppQueryClientProvider>
  );
}
