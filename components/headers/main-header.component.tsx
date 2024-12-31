"use client";

import useViewportSize, { ViewportSize } from "@/hooks/use-viewport-size";
import Link from "next/link";
import { LegacyRef, useRef, useState } from "react";
import MatchDropdown from "../dropdowns/match-dropdown.component";
import UserDropdown from "../dropdowns/user-dropdown.component";
import styles from "./main-header.module.scss";

const MainHeader = () => {
  const size = useViewportSize();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>();

  const toggleMenuVisible = (toggle?: boolean) => {
    if (toggle === undefined) {
      setMenuVisible(!menuVisible);
    } else {
      setMenuVisible(toggle);
    }
  };

  const links = () => (
    <>
      <Link className={styles.option} href={"/browse/"}>
        <h2>Przeglądaj</h2>
      </Link>
      <Link className={styles.option} href={"/map/"}>
        <h2>Mapka</h2>
      </Link>
      <div className={styles.option}>
        <MatchDropdown />
      </div>
    </>
  );

  return (
    <>
      <header
        className={`${styles.container} ${
          size < ViewportSize.SM ? styles.compact : ""
        }`}
      >
        {size < ViewportSize.MD && (
          <>
            <i
              className={`${styles.menuButton} fa-solid fa-bars`}
              onClick={() => toggleMenuVisible()}
            ></i>
            {menuVisible && (
              <div
                ref={menuRef as LegacyRef<HTMLDivElement>}
                className={styles.menu}
                onClick={() => toggleMenuVisible(false)}
              >
                <h1>Poliżarcie</h1>
                {links()}
              </div>
            )}
          </>
        )}
        <Link href={"/"} className={styles.title}>
          <h1>Poliżarcie</h1>
        </Link>
        {size >= ViewportSize.MD && (
          <div className={styles.options}>{links()}</div>
        )}

        <div className={styles.buttons}>
          <UserDropdown />
        </div>
      </header>
      <div
        className={`${styles.placeholder} ${
          size < ViewportSize.SM ? styles.compact : ""
        }`}
      ></div>
    </>
  );
};

export default MainHeader;
