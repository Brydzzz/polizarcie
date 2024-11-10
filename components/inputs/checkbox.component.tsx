"use client";

import { LegacyRef, useRef } from "react";
import styles from "./checkbox.module.scss";

type Props = Omit<
  React.ComponentProps<"input">,
  "className" | "type" | "value" | "checked" | "ref"
> & {
  value?: boolean;
  label: string;
};

const Checkbox = (props: Props) => {
  const { value, label, required } = props;
  const inputRef = useRef<HTMLInputElement>();

  const handleClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  return (
    <div
      className={`${styles.container} ${required ? styles.required : ""}`}
      onClick={handleClick}
    >
      <input
        className={styles.invisible}
        type="checkbox"
        {...{ ...props, value: undefined }}
        checked={value === undefined ? false : value}
        ref={inputRef as LegacyRef<HTMLInputElement>}
      />
      <label>{label}</label>
      <i className="fa-regular fa-square"></i>
      {value && <i className="fa-solid fa-check"></i>}
    </div>
  );
};

export default Checkbox;
