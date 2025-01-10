"use client";

import { parseBigNumber } from "@/utils/misc";
import { LegacyRef, MouseEvent, TouchEvent, useRef, useState } from "react";
import styles from "./sliders.module.scss";

type Range = {
  min: number;
  max: number;
};

type Props = {
  id?: string;
  name?: string;
  value: Range;
  limit: Range;
  onChange: (value: Range) => void;
  step?: number;
  suffix?: string;
  label?: string;
  disabled?: boolean;
};

const RangeInput = ({
  id,
  name,
  value,
  limit,
  onChange,
  step,
  suffix,
  label,
  disabled,
}: Props) => {
  const axisRef = useRef<HTMLDivElement>();
  const [selectedDot, setSelectedDot] = useState(false); // false for min, true for max

  const axisValueAt = (clientX: number): number => {
    const axis = axisRef.current;
    if (!axis) return 0;
    const left = axis.getBoundingClientRect().left;
    const width = axis.getBoundingClientRect().right - left;
    const percentage = Math.max(0, Math.min((clientX - left) / width, 1));
    return (
      Math.round(
        Math.round(((limit.max - limit.min) * percentage) / (step || 1)) *
          (step || 1)
      ) + limit.min
    );
  };

  const minClamp = (value: number): number =>
    Math.max(limit.min, Math.min(value, limit.max - 1));
  const maxClamp = (value: number): number =>
    Math.max(limit.min + 1, Math.min(value, limit.max));

  const updateValue = (dotValue: number) => {
    const newValue: Range = {
      min: value.min,
      max: value.max,
    };

    if (selectedDot) {
      newValue.min = minClamp(dotValue);
      if (dotValue >= newValue.max) newValue.max = maxClamp(dotValue + 1);
    } else {
      newValue.max = maxClamp(dotValue);
      if (dotValue <= newValue.min) newValue.min = minClamp(dotValue - 1);
    }

    onChange(newValue);
  };

  const handleOnMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.buttons !== 1) return; // if left mouse button not clicked
    const dotValue = axisValueAt(e.clientX);

    if (Math.abs(dotValue - value.min) > Math.abs(dotValue - value.max))
      setSelectedDot(false);
    else setSelectedDot(true);
  };

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.buttons === 1) return; // if left mouse button still clicked
    const dotValue = axisValueAt(e.clientX);
    updateValue(dotValue);
  };

  const handleOnMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.buttons !== 1) return; // if left mouse button not clicked
    const dotValue = axisValueAt(e.clientX);
    updateValue(dotValue);
  };

  const handleOnTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    const dotValue = axisValueAt(e.touches.item(0)?.clientX || 0);
    updateValue(dotValue);
  };

  const handleOnTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    const dotValue = axisValueAt(e.touches.item(0)?.clientX || 0);
    if (Math.abs(dotValue - value.min) > Math.abs(dotValue - value.max))
      setSelectedDot(false);
    else setSelectedDot(true);
  };

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      <div
        className={styles.range}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleOnMouseMove}
        onTouchMove={handleOnTouchMove}
        onTouchStart={handleOnTouchStart}
      >
        <span className={styles.limit}>{parseBigNumber(limit.min)}</span>
        <span className={styles.value}>
          {parseBigNumber(value.min)}
          {suffix}
        </span>
        <div className={styles.axis} ref={axisRef as LegacyRef<HTMLDivElement>}>
          <div
            className={styles.dot}
            style={{
              left: `${
                ((value.min - limit.min) / (limit.max - limit.min)) * 100
              }%`,
            }}
          >
            <i className="fa-solid fa-caret-right"></i>
          </div>
          <div
            className={styles.dot}
            style={{
              left: `${
                ((value.max - limit.min) / (limit.max - limit.min)) * 100
              }%`,
            }}
          >
            <i className="fa-solid fa-caret-left"></i>
          </div>
        </div>
        <span className={styles.value}>
          {parseBigNumber(value.max)}
          {suffix}
        </span>
        <span className={styles.limit}>{parseBigNumber(limit.max)}</span>
      </div>
      <input
        className={styles.invisible}
        id={`${id}Min`}
        name={`${name}Min`}
        type="number"
        value={value.min}
        disabled
      />
      <input
        className={styles.invisible}
        id={`${id}Max`}
        name={name && `${name}Max`}
        type="number"
        value={value.max}
        disabled
      />
      {label && <label>{label}</label>}
    </div>
  );
};

export default RangeInput;
