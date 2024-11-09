"use client";

import { LegacyRef, MouseEvent, useEffect, useRef, useState } from "react";
import styles from "./range-input.module.scss";

type Range = {
  min: number;
  max: number;
};

type Props = {
  value: Range;
  limit: Range;
  onChange: (value: Range) => void;
  suffix?: string;
};

const RangeInput = ({ value, limit, onChange, suffix }: Props) => {
  const [message, setMessage] = useState("");
  const axisRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (value.min >= value.max) setMessage("Błędny zakres");
    else if (value.min < limit.min) setMessage("Wartość zbyt mała");
    else if (value.max > limit.max) setMessage("Wartość zbyt duża");
    else setMessage("");
  }, [value, limit]);

  const updateValues = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // if left mouse button not clicked
    const target = axisRef.current;
    if (!target) return;
    const left = target.getBoundingClientRect().left;
    const width = target.getBoundingClientRect().right - left;
    const percentage = Math.max(0, Math.min((e.clientX - left) / width, 1));
    const new_value = Math.round((limit.max - limit.min) * percentage);
    console.log(left, width, new_value);

    if (Math.abs(new_value - value.min) < Math.abs(new_value - value.max))
      value = {
        min: new_value,
        max: value.max,
      };
    else
      value = {
        min: value.min,
        max: new_value,
      };

    onChange(value);
  };

  return (
    <div
      className={styles.container}
      onMouseMove={updateValues}
      onMouseDown={updateValues}
    >
      <span className={styles.limit}>{limit.min}</span>
      <span className={styles.value}>
        {value.min}
        {suffix}
      </span>
      <div className={styles.axis} ref={axisRef as LegacyRef<HTMLDivElement>}>
        <div
          className={styles.dot}
          style={{ left: `${(value.min / (limit.max - limit.min)) * 100}%` }}
        >
          <i className="fa-solid fa-caret-right"></i>
        </div>
        <div
          className={styles.dot}
          style={{ left: `${(value.max / (limit.max - limit.min)) * 100}%` }}
        >
          <i className="fa-solid fa-caret-left"></i>
        </div>
      </div>
      <span className={styles.value}>
        {value.max}
        {suffix}
      </span>
      <span className={styles.limit}>{limit.max}</span>
      <span className={styles.error}>{message}</span>
    </div>
  );
};

export default RangeInput;
