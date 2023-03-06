import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import classList from "utils/classList";

import styles from "./SearchInput.module.css";

interface Props {
  onInputChange: (value: string) => void;
}

const SearchInput = ({ onInputChange }: Props) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div
      className={classList([
        `flexbox ${styles["search-input-container"]}`,
        focused ? styles["blue-outline"] : "",
      ])}
    >
      <AiOutlineSearch
        size={24}
        opacity={0.4}
        style={{ marginRight: "10px" }}
      />

      <input
        type="text"
        placeholder="Find tokens by name"
        className={styles["search-input"]}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default SearchInput;
