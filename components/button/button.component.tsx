"use client";

import { ReactNode } from "react";
import styles from "./button.module.scss";
import { ButtonColor, ButtonSize, ButtonStyle } from "./button.types";

type Props = {
  children?: ReactNode;
  onClick?: CallableFunction;
  style?: ButtonStyle;
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
};

const Button = ({ children, onClick, style, color, size, disabled }: Props) => {
  function onClickHandler() {
    if (onClick) onClick();
  }

  return (
    <div className={styles.container}>
      <button
        className={`${styles[style || ButtonStyle.SOLID]} ${
          styles[color || ButtonColor.PRIMARY]
        } ${styles[size || ButtonSize.NORMAL]}
        `}
        onClick={onClickHandler}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
