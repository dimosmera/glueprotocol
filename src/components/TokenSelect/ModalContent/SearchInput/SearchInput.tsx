import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import classList from "utils/classList";

import styles from "./SearchInput.module.css";

interface Props {
  onInputChange: (value: string) => void;
}

const SearchInput = ({ onInputChange }: Props) => {
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sets the focus on the input when the component is mounted
  useEffect(() => {
    if (!inputRef.current) return;

    inputRef.current.focus();
  }, []);

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
        ref={inputRef}
        placeholder="Search by token or address"
        className={styles["search-input"]}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

export default SearchInput;
