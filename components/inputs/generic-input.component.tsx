import { ComponentProps } from "react";
import styles from "./generic-inputs.module.scss";
import { InputSize, InputStyle } from "./input.types";

type Props = Omit<ComponentProps<"input">, "className" | "size"> & {
  label: string;
  error?: boolean | undefined;
  style?: InputStyle;
  size?: InputSize;
};
const Input = (props: Props) => {
  const { label, style, size, error, required, value } = props;

  return (
    <div
      className={`${styles.container} ${required ? styles.required : ""}  ${
        error ? styles.error : ""
      } ${styles[style || InputStyle.INPUT_LIKE]} ${
        styles[size || InputSize.SMALL]
      }`}
    >
      <input
        {...{ ...props, error: undefined, style: undefined, size: undefined }}
      />
      <label
        className={value && value.toString().length > 0 ? styles.shrink : ""}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
