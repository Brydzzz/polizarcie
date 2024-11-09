import { LegacyRef, useEffect, useRef } from "react";
import styles from "./generic-inputs.module.scss";

type Props = Omit<React.ComponentProps<"textarea">, "className"> & {
  label: string;
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
      className={`${styles.container} ${props.required ? styles.required : ""}`}
    >
      <textarea ref={ref as LegacyRef<HTMLTextAreaElement>} {...props} />
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
