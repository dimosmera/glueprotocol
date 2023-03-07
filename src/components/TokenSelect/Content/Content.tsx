import React, { useState } from "react";
import { Inter } from "next/font/google";
import { FixedSizeList as List } from "react-window";

import classList from "utils/classList";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";

import SearchInput from "./SearchInput";
import Token from "./Token";

import styles from "./Content.module.css";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  tokens: IToken[];
}

/**
 * Rendered within SweetAlert's custom HTML
 */
const Content = ({ tokens }: Props) => {
  const [search, setSearch] = useState("");

  console.log("tokens: ", tokens);

  const handleTokenSelect = (index: number) => {
    console.log("index: ", index);
  };

  const handleSeachChange = (value: string) => {
    setSearch(value);
  };

  console.log("search: ", search);

  return (
    <div className={classList([inter.className, "flexbox", styles.container])}>
      <SearchInput onInputChange={handleSeachChange} />

      <List
        height={500}
        itemCount={tokens.length}
        itemSize={55}
        width="100%"
        itemData={{ tokens, onSelect: handleTokenSelect }}
      >
        {Token}
      </List>
    </div>
  );
};

export default Content;
