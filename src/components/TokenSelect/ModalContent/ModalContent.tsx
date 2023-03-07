import React, { useState } from "react";
import { Inter } from "next/font/google";
import { FixedSizeList as List } from "react-window";
import { FiX } from "react-icons/fi";

import classList from "utils/classList";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";
import { closeAlert } from "components/SweetAlerts";

import SearchInput from "./SearchInput";
import Token from "./Token";
import MostUsedTokens from "./MostUsedTokens";

import styles from "./ModalContent.module.css";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  tokens: IToken[];
  onTokenSelect: (selectedToken: IToken) => void;
}

/**
 * Rendered within SweetAlert's custom HTML
 */
const ModalContent = ({ tokens, onTokenSelect }: Props) => {
  const [search, setSearch] = useState("");

  const handleTokenSelect = (selectedTokenAddress: IToken["address"]) => {
    const selectedToken = tokens.find(
      (token) => token.address === selectedTokenAddress
    );
    if (!selectedToken) throw new Error("Token not found after selected?");

    onTokenSelect(selectedToken);
  };

  const handleSeachChange = (value: string) => {
    setSearch(value);
  };

  const handleCloseModal = () => {
    closeAlert();
  };

  // Using <for-loop> instead of <filter> (avoids creating a new array until it's needed)
  // and <indexOf> instead of <includes> (faster searching a string within another string)
  const filteredTokens = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (
      token.name.toLowerCase().indexOf(search.toLocaleLowerCase()) !== -1 ||
      token.symbol.toLowerCase().indexOf(search.toLocaleLowerCase()) !== -1 ||
      token.address.toLowerCase().indexOf(search.toLocaleLowerCase()) !== -1
    ) {
      filteredTokens.push(token);
    }
  }

  return (
    <div className={classList([inter.className, "flexbox", styles.container])}>
      <div className={`flexbox ${styles["title-container"]}`}>
        <p className={`semi-bold-text ${styles["title-text"]}`}>
          Select a token
        </p>

        <FiX color="#B7BECB" cursor="pointer" onClick={handleCloseModal} />
      </div>

      <SearchInput onInputChange={handleSeachChange} />

      <MostUsedTokens onTokenSelect={handleTokenSelect} />

      <List
        height={500}
        itemCount={filteredTokens.length}
        itemSize={55}
        width="100%"
        itemData={{ tokens: filteredTokens, onSelect: handleTokenSelect }}
      >
        {Token}
      </List>
    </div>
  );
};

export default ModalContent;
