import { ComponentProps } from "react";
import styles from "./generic-inputs.module.scss";

type Props = Omit<ComponentProps<"input">, "className"> & {
  label: string;
  error?: boolean | undefined;
};
const Input = (props: Props) => {
  return (
    <div
      className={`${styles.container} ${
        props.required ? styles.required : ""
      }  ${props.error ? styles.error : ""}`}
    >
      <input {...{ ...props, error: undefined }} />
      <label
        className={
          props.value && props.value.toString().length > 0 ? styles.shrink : ""
        }
      >
        {props.label}
      </label>
    </div>
  );
};

export default Input;
