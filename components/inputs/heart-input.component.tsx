"use client";

import styles from "./heart-input.module.scss";

type Props = {
  id?: string;
  name?: string;
  value: boolean;
  onChange?: (liked: boolean) => void;
  disabled?: boolean;
  heartSize?: string;
};

const HeartInput = ({
  id,
  name,
  value,
  onChange,
  disabled,
  heartSize,
}: Props) => {
  const handleClick = () => {
    if (disabled) return;
    if (onChange) onChange(!value);
  };

  return (
    <div className={`${styles.container} ${disabled ? styles.disabled : ""}`}>
      <input
        id={id}
        type="checkbox"
        value={value ? "true" : "false"}
        name={name}
        className={styles.invisible}
        disabled
      />
      <span style={{ fontSize: heartSize }} onClick={() => handleClick()}>
        {value ? (
          <i className="fa-solid fa-heart"></i>
        ) : (
          <i className="fa-regular fa-heart"></i>
        )}
      </span>
    </div>
  );
};

export default HeartInput;
