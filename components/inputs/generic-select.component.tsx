"use client";

import { useState } from "react";
import styles from "./generic-inputs.module.scss";

type Props = Omit<React.ComponentProps<"select">, "className"> & {
  label: string;
  options: {
    name: string;
    value: string;
  }[];
};

const SelectBox = (props: Props) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = (toggle: boolean) => {
    setExpanded(toggle);
  };

  return (
    <div
      className={`${styles.container} ${props.required ? styles.required : ""}`}
      onClick={() => toggleExpanded(!expanded)}
      onBlur={() => toggleExpanded(false)}
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
      <span className={`${styles.arrow} ${expanded ? styles.rotate : ""}`}>
        <i className="fa-solid fa-chevron-down"></i>
      </span>
    </div>
  );
};

export default SelectBox;
