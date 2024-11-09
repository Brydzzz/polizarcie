"use client";

import { MouseEventHandler } from "react";
import styles from "./searchbar.module.scss";
import { SearchbarSize, SearchbarStyle } from "./searchbar.types";

type Props = Omit<
  React.ComponentProps<"input">,
  "className" | "type" | "size"
> & {
  onCancelButtonClick?: MouseEventHandler;
  onSubmitButtonClick?: MouseEventHandler;
  onFilterButtonClick?: MouseEventHandler;
  style?: SearchbarStyle;
  size?: SearchbarSize;
  filters?: boolean;
};

const Searchbar = ({
  id,
  name,
  value,
  placeholder,
  onChange,
  disabled,
  required,
  onCancelButtonClick,
  onSubmitButtonClick,
  onFilterButtonClick,
  style,
  size,
  filters,
}: Props) => {
  return (
    <div
      className={`${styles.container} ${styles[style || SearchbarStyle.HERO]} ${
        styles[size || SearchbarSize.LARGE]
      }
        `}
    >
      <input
        type="search"
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      />
      <div className={styles.buttons}>
        <span onClick={onCancelButtonClick}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <span onClick={onSubmitButtonClick}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        {filters && (
          <span onClick={onFilterButtonClick}>
            <i className="fa-solid fa-sliders"></i>
          </span>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
