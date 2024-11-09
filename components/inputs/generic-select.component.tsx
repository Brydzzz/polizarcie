import styles from "./generic-inputs.module.scss";

type Props = Omit<React.ComponentProps<"select">, "className"> & {
  label: string;
  options: {
    name: string;
    value: string;
  }[];
};

const SelectBox = (props: Props) => {
  return (
    <div
      className={`${styles.container} ${props.required ? styles.required : ""}`}
    >
      <select {...{ ...props, options: undefined }}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
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

export default SelectBox;
