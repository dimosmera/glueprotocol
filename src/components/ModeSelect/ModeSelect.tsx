import classList from "utils/classList";

import styles from "./ModeSelect.module.css";

export type SelectMode = "default" | "elusiv";

interface Props {
  mode: SelectMode;
  onModeSelect: (mode: SelectMode) => void;
}

const ModeSelect = ({ mode, onModeSelect }: Props) => {
  return (
    <div className={`flexbox ${styles.container}`}>
      <div
        className={classList([
          `flexbox ${styles.box}`,
          mode === "default" ? styles["box-selected"] : "",
        ])}
        onClick={() => onModeSelect("default")}
      >
        <p
          className={classList([
            `semi-bold-text ${styles["option-text"]}`,
            mode === "default" ? styles["option-text-selected"] : "",
          ])}
        >
          Send
        </p>
      </div>

      <div
        className={classList([
          `flexbox ${styles.box}`,
          mode === "elusiv" ? styles["box-selected"] : "",
        ])}
        onClick={() => onModeSelect("elusiv")}
      >
        <p
          className={classList([
            `semi-bold-text ${styles["option-text"]}`,
            mode === "elusiv" ? styles["option-text-selected"] : "",
          ])}
        >
          Elusiv
        </p>
      </div>
    </div>
  );
};

export default ModeSelect;
