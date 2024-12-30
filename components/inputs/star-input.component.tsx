"use client";

import { useEffect, useState } from "react";
import styles from "./star-input.module.scss";

type Props = {
  id?: string;
  name?: string;
  value: number;
  max: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  starSize?: string;
};

const StarInput = ({
  id,
  name,
  value,
  max,
  onChange,
  disabled,
  starSize,
}: Props) => {
  const [stars, setStars] = useState<boolean[]>([]);
  const [partial, setPartial] = useState(0);

  useEffect(() => {
    const new_stars: boolean[] = [];
    for (let i = 0; i < max; i++) new_stars.push(i + 1 <= value);
    setStars(new_stars);
    setPartial(value - Math.floor(value));
  }, [value, max]);

  const handleClick = (i: number) => {
    if (disabled) return;
    if (value !== i + 1) value = i + 1;
    else if (i !== 0) value = i;
    if (onChange) onChange(value);
  };

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      {stars.map((star, i) => (
        <span
          key={i}
          className={styles.star}
          onClick={() => handleClick(i)}
          style={{ fontSize: starSize }}
        >
          {star ? (
            <i className="fa-solid fa-star"></i>
          ) : value > i ? (
            <div className={styles.partial}>
              <i className="fa-regular fa-star"></i>
              <i
                className="fa-solid fa-star"
                style={{
                  width: `${partial * 90 + 10}%`,
                }}
              ></i>
            </div>
          ) : (
            <i className="fa-regular fa-star"></i>
          )}
        </span>
      ))}
      <input
        className={styles.invisible}
        id={id}
        name={name}
        type="number"
        value={value}
        disabled
      />
    </div>
  );
};

export default StarInput;
