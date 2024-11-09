import { ComponentProps, LegacyRef, useEffect, useRef } from "react";
import styles from "./generic-inputs.module.scss";

type Props = Omit<ComponentProps<"textarea">, "className"> & {
  label: string;
  error?: boolean | undefined;
};
const TextArea = (props: Props) => {
  const ref = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    const textarea = ref.current as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + 10 + "px";
  }, [props.value]);

  return (
    <div
      className={`${styles.container} ${
        props.required ? styles.required : ""
      } ${props.error ? styles.error : ""}`}
    >
      <textarea
        ref={ref as LegacyRef<HTMLTextAreaElement>}
        {...{ ...props, error: undefined }}
      />
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

export default TextArea;
