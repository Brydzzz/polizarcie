"use client";

import { MouseEventHandler } from "react";
import styles from "./searchbar.module.scss";

type Props = Omit<React.ComponentProps<"input">, "className"> & {
  onCancelButtonClick?: MouseEventHandler;
  onSubmitButtonClick?: MouseEventHandler;
  onFilterButtonClick?: MouseEventHandler;
};

const Searchbar = ({
  id,
  name,
  placeholder,
  value,
  onCancelButtonClick,
  onSubmitButtonClick,
  onFilterButtonClick,
}: Props) => {
  return (
    <div className={styles.container}>
      <input
        type="search"
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
      />
      <div className={styles.buttons}>
        <span onClick={onCancelButtonClick}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <span onClick={onSubmitButtonClick}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <span onClick={onFilterButtonClick}>
          <i className="fa-solid fa-sliders"></i>
        </span>
      </div>
    </div>
  );
};

export default Searchbar;
