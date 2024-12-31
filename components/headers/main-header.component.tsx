"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { ViewportSize } from "@/lib/store/ui/ui.slice";
import Link from "next/link";
import { LegacyRef, useRef, useState } from "react";
import MatchDropdown from "../dropdowns/match-dropdown.component";
import UserDropdown from "../dropdowns/user-dropdown.component";
import styles from "./main-header.module.scss";

const MainHeader = () => {
  const menuRef = useRef<HTMLDivElement>();
  const size = useAppSelector(selectViewportWidth);
  const [menuVisible, setMenuVisible] = useState(false);

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
