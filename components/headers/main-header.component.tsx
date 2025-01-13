"use client";

import { hasPermission } from "@/lib/permissions";
import { useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { ViewportSize } from "@/lib/store/ui/ui.slice";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import Link from "next/link";
import { LegacyRef, useRef, useState } from "react";
import MatchDropdown from "../dropdowns/match-dropdown.component";
import UserDropdown from "../dropdowns/user-dropdown.component";
import styles from "./main-header.module.scss";

const MainHeader = () => {
  const menuRef = useRef<HTMLDivElement>();
  const size = useAppSelector(selectViewportWidth);
  const [menuVisible, setMenuVisible] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);

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
  const linksMobile = () => (
    <>
      <Link className={styles.option} href={"/browse/"}>
        <h2>Wyszukaj</h2>
      </Link>
      <Link className={styles.option} href={"/map/"}>
        <h2>Mapka</h2>
      </Link>
      <div className={styles.group}>
        <h2>Poznajmy się</h2>
        <Link className={styles.option} href={"/match/"}>
          <h2> - Matchowanie </h2>
        </Link>
        <Link className={styles.option} href={"/match-list/"}>
          <h2> - Kontakty </h2>
        </Link>
      </div>
      {currentUser && (
        <div className={styles.group}>
          <h2>Twój panel</h2>
          <Link className={styles.option} href={"/dashboard/my-profile"}>
            <h2> - Profil </h2>
          </Link>
          <Link className={styles.option} href={"/dashboard/settings"}>
            <h2> - Ustawienia </h2>
          </Link>
          <Link className={styles.option} href={"/dashboard/favorite"}>
            <h2> - Ulubione </h2>
          </Link>
          {hasPermission(currentUser, "ui", "adminDashboard") && (
            <Link
              className={`${styles.option} ${styles.admin}`}
              href="/dashboard/admin/restaurants"
            >
              <h2> - Restauracje </h2>
            </Link>
          )}
        </div>
      )}
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
                {linksMobile()}
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
