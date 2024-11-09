"use client";

import { useEffect, useState } from "react";
import styles from "./star-input.module.scss";

type Props = {
  value: number;
  max: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
};

const StarInput = ({ value, max, onChange, disabled }: Props) => {
  const [stars, setStars] = useState<boolean[]>([]);

  useEffect(() => {
    const new_stars: boolean[] = [];
    for (let i = 0; i < max; i++) new_stars.push(i < value);
    setStars(new_stars);
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
        <span key={i} className={styles.star} onClick={() => handleClick(i)}>
          {star ? (
            <i className="fa-solid fa-star"></i>
          ) : (
            <i className="fa-regular fa-star"></i>
          )}
        </span>
      ))}
    </div>
  );
};

export default StarInput;
