import React from "react";
import { Inter } from "next/font/google";
import { FixedSizeList as List } from "react-window";

import classList from "utils/classList";
import { IToken } from "services/api/useFetchTokens/useFetchTokens";

import styles from "./Content.module.css";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  tokens: IToken[];
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    tokens: IToken[];
    onSelect: (index: number) => void;
  };
}

const Row = ({ index, style, data }: RowProps) => {
  const { tokens, onSelect } = data;

  const item = tokens[index];
  // console.log('item: ', item);

  const handleSelect = () => {
    onSelect(index);
  };

  return (
    <div
      style={style}
      className={`flexbox ${styles.item}`}
      onClick={handleSelect}
    >
      {item.symbol}
    </div>
  );
};

/**
 * Rendered within SweetAlert's custom HTML
 */
const Content = ({ tokens }: Props) => {
  console.log("tokens: ", tokens);

  const handleTokenSelect = (index: number) => {
    console.log("index: ", index);
  };

  return (
    <div className={classList([inter.className, "flexbox", styles.container])}>
      <div>
        HTML <u>example</u>
      </div>

      <List
        height={500}
        itemCount={tokens.length}
        itemSize={55}
        width="100%"
        itemData={{ tokens, onSelect: handleTokenSelect }}
      >
        {Row}
      </List>
    </div>
  );
};

export default Content;
