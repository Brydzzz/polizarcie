"use client";

import { ComponentProps, useState } from "react";
import Input from "./generic-input.component";
import { InputSize, InputStyle } from "./input.types";
import styles from "./password-input.module.scss";

type Props = Omit<ComponentProps<typeof Input>, "type">;

const PasswordInput = (props: Props) => {
  const { style, size } = props;
  const [visible, setVisible] = useState(false);

  const toggleVisible = (toggle: boolean) => {
    setVisible(toggle);
  };

  return (
    <div
      className={`${styles.container} ${
        styles[style || InputStyle.INPUT_LIKE]
      } ${styles[size || InputSize.SMALL]}`}
    >
      <Input type={visible ? "text" : "password"} {...props} />
      <span
        className={`${styles.eye} ${props.disabled ? styles.disabled : ""}`}
        onMouseDown={() => {
          toggleVisible(true);
        }}
        onMouseUp={() => {
          toggleVisible(false);
        }}
        onMouseLeave={() => {
          toggleVisible(false);
        }}
      >
        {visible ? (
          <i className="fa-solid fa-eye"></i>
        ) : (
          <i className="fa-solid fa-eye-slash"></i>
        )}
      </span>
    </div>
  );
};

export default PasswordInput;
