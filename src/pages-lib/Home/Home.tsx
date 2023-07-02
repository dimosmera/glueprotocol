import { useState } from "react";

import Transfer from "pages-lib/Transfer";
import TokensProvider from "context/TokensProvider";
import UserInputsProvider from "context/UserInputsProvider";
import Layout from "components/Layout";
import ModeSelect, { SelectMode } from "components/ModeSelect/ModeSelect";
import ElusivTransfer from "pages-lib/ElusivTransfer";
import ElusivInputsProvider from "context/ElusivInputsProvider";

import styles from "./Home.module.css";

export default function Home() {
  const [mode, setMode] = useState<SelectMode>("default");

  const handleModeSelect = (selectedMode: SelectMode) => {
    if (mode === selectedMode) return;

    setMode(selectedMode);
  };

  return (
    <Layout>
      <div className={`flexbox ${styles.container}`}>
        <div className={`flexbox ${styles.caption}`}>
          <p>
            Private sending is disabled until the team fixes an issue with the
            Elusiv SDK. See
            <a
              href="https://github.com/elusiv-privacy/elusiv-sdk/issues/15"
              target="_blank"
              rel="noopener"
              style={{ marginLeft: "4px", marginRight: "4px" }}
            >
              Issue #15
            </a>
            for more.
          </p>
        </div>
        <ModeSelect mode={mode} onModeSelect={handleModeSelect} />

        {mode === "default" ? (
          <TokensProvider>
            <UserInputsProvider>
              <Transfer />
            </UserInputsProvider>
          </TokensProvider>
        ) : (
          <ElusivInputsProvider>
            <ElusivTransfer />
          </ElusivInputsProvider>
        )}
      </div>
    </Layout>
  );
}
