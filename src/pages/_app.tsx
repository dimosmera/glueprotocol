import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

import "styles/globals.css";

import AppQueryClientProvider from "context/AppQueryClientProvider";
import PhantomProvider from "context/PhantomProvider";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppQueryClientProvider>
      <PhantomProvider>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </PhantomProvider>
    </AppQueryClientProvider>
  );
}
