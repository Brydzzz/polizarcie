"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { removeSnackbar, SnackbarData } from "@/lib/store/ui/ui.slice";
import { useEffect, useState } from "react";
import styles from "./snackbar.module.scss";

const Snackbar = ({ id, message, timeout, type }: SnackbarData) => {
  const dispatch = useAppDispatch();
  const [life, setLife] = useState(100);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    let timeLeft = timeout;
    const anim = setInterval(() => {
      timeLeft -= 10;
      setLife((timeLeft / timeout) * 100);
      if (timeLeft <= 300) setExit(true);
    }, 10);
    setTimeout(kill, timeout);

    return () => {
      clearInterval(anim);
    };
  }, [id]);

  const kill = () => {
    dispatch(removeSnackbar(id));
  };

  return (
    <div
      className={`${styles.container} ${exit ? styles.exit : ""} ${
        styles[type]
      }`}
    >
      {message}
      <i onClick={kill} className="fa-solid fa-xmark"></i>
      <div className={`${styles.lifeBar} ${styles.full}`}></div>
      <div style={{ width: `${life}%` }} className={styles.lifeBar}></div>
    </div>
  );
};

export default Snackbar;
