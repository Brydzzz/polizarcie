"use client";

import { ChangeEvent } from "react";
import styles from "./multiselect.module.scss";

type Props = Omit<
  React.ComponentProps<"select">,
  "className" | "multiple" | "value" | "onChange" | "defaultValue"
> & {
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  options: {
    name: string;
    value: string;
  }[];
};

const Multiselect = (props: Props) => {
  const { value, options, onChange, label } = props;

  const internalOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange)
      onChange(
        Object.values(e.target.options).reduce<string[]>((acc, v) => {
          if (v.selected) acc.push(v.value);
          return acc;
        }, [])
      );
  };

  const onOptionClick = (optionValue: string) => {
    const idx = value.find((v) => v === optionValue);
    if (idx === undefined) onChange([...value, optionValue]);
    else onChange(value.filter((v) => v !== optionValue));
  };

  return (
    <div className={styles.container}>
      <select
        className={styles.invisible}
        {...{
          ...props,
          options: undefined,
          onChange: internalOnChange,
          disabled: true,
        }}
        multiple
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}></option>
        ))}
      </select>
      <div className={styles.options}>
        {options.map((option) => (
          <span key={option.value} onClick={() => onOptionClick(option.value)}>
            {option.name}
            <i className="fa-regular fa-square"></i>
            {value.find((v) => v === option.value) !== undefined && (
              <i className="fa-solid fa-check"></i>
            )}
          </span>
        ))}
      </div>
      <label>{label}</label>
    </div>
  );
};

export default Multiselect;
