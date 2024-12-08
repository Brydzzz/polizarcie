"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import styles from "./user-dropdown.module.scss";

const UserDropdown = () => {
  const user = useAppSelector(selectCurrentUser);
  const [visible, setVisible] = useState(false);

  const toggleVisible = (toggle: boolean | undefined = undefined) => {
    setVisible(toggle || !visible);
  };

  return (
    <div className={styles.container}>
      <span className={styles.icon} onClick={() => toggleVisible()}>
        <i className="fa-solid fa-user"></i>
      </span>
      <div
        className={`${styles.dropdown} ${visible ? "" : styles.hidden}`}
        onClick={() => toggleVisible(false)}
      >
        {user ? (
          <>
            <h2>{user.name}</h2>
            <span
              className={styles.item}
              onClick={() => signOut({ redirect: true, redirectTo: "/browse" })}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              &nbsp; &nbsp; Wyloguj się
            </span>
          </>
        ) : (
          <Link className={styles.item} href="/auth/sign-in">
            <i className="fa-solid fa-right-to-bracket"></i>
            &nbsp; &nbsp; Zaloguj się
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;
