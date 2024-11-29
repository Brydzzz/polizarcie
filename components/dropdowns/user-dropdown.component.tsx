"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./user-dropdown.module.scss";

const UserDropdown = () => {
  const { data: session } = useSession();
  const [signedIn, setSignedIn] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setSignedIn(session?.user != null);
  }, [session]);

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
        {signedIn ? (
          <>
            <h2>{session?.user?.name}</h2>
            <span
              className={styles.item}
              onClick={() => signOut({ redirect: true, redirectTo: "/" })}
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
