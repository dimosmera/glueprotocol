import { useState } from "react";

import Transfer from "pages-lib/Transfer";
import TokensProvider from "context/TokensProvider";
import UserInputsProvider from "context/UserInputsProvider";
import Layout from "components/Layout";
import ModeSelect, { SelectMode } from "components/ModeSelect/ModeSelect";

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
        <ModeSelect mode={mode} onModeSelect={handleModeSelect} />

        {mode === "default" ? (
          <TokensProvider>
            <UserInputsProvider>
              <Transfer />
            </UserInputsProvider>
          </TokensProvider>
        ) : (
          <div>Private</div>
        )}
      </div>
    </Layout>
  );
}
