"use client";

import { ComponentProps, MouseEventHandler, ReactNode } from "react";
import styles from "./button.module.scss";
import { ButtonColor, ButtonSize, ButtonStyle } from "./button.types";

type Props = {
  children?: ReactNode;
  onClick?: MouseEventHandler;
  style?: ButtonStyle;
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
} & Pick<ComponentProps<"button">, "type">;

const Button = ({ children, onClick, style, color, size, disabled }: Props) => {
  return (
    <div className={styles.container}>
      <button
        className={`${styles[style || ButtonStyle.SOLID]} ${
          styles[color || ButtonColor.PRIMARY]
        } ${styles[size || ButtonSize.NORMAL]}
        `}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </div>
  );
};

export default Button;
