"use client";

import { ReactNode } from "react";
import styles from "./button.module.scss";

type Props = {
  children?: ReactNode;
  onClick?: CallableFunction;
};

const Button = ({ children, onClick }: Props) => {
  function onClickHandler() {
    if (onClick) onClick();
  }

  return (
    <button className={styles.container} onClick={onClickHandler}>
      {children}
    </button>
  );
};

export default Button;
