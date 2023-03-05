import type { AppProps } from "next/app";

import "styles/globals.css";

import AppQueryClientProvider from "context/AppQueryClientProvider";
import PhantomProvider from "context/PhantomProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppQueryClientProvider>
      <PhantomProvider>
        <Component {...pageProps} />
      </PhantomProvider>
    </AppQueryClientProvider>
  );
}
