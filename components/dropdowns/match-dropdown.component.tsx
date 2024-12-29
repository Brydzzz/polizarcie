"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./match-dropdown.module.scss";

const MatchDropdown = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = (toggle: boolean | undefined = undefined) => {
    setVisible(toggle || !visible);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.icon} onClick={() => toggleVisible()}>
        Poznajmy się
      </h2>
      <div
        className={`${styles.dropdown} ${visible ? "" : styles.hidden}`}
        onClick={() => toggleVisible(false)}
      >
        <span className={styles.item}>
          <Link href={"/match/"} className={styles.option}>
            <p>Matchowanie</p>
          </Link>
        </span>
        <span className={styles.item}>
          <Link href={"/match-list/"} className={styles.option}>
            <p>Kontakty</p>
          </Link>
        </span>
      </div>
    </div>
  );
};

export default MatchDropdown;
