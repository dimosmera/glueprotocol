import type { AppProps } from "next/app";

import AppQueryClientProvider from "context/AppQueryClientProvider";
import "styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppQueryClientProvider>
      <Component {...pageProps} />
    </AppQueryClientProvider>
  );
}
