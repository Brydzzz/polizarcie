"use client";

import defaultProfile from "@/assets/defaultProfile.svg";
import { useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { ViewportSize } from "@/lib/store/ui/ui.slice";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SupabaseImage from "../images/supabase-image.component";
import styles from "./user-dropdown.module.scss";

const UserDropdown = () => {
  const user = useAppSelector(selectCurrentUser);
  const [visible, setVisible] = useState(false);
  const size = useAppSelector(selectViewportWidth);
  const [imageSize, setImageSize] = useState(50);

  useEffect(() => {
    setImageSize(size < ViewportSize.SM ? 40 : 50);
  }, [size]);

  const toggleVisible = (toggle: boolean | undefined = undefined) => {
    setVisible(toggle || !visible);
  };

  return (
    <div className={styles.container}>
      <span className={styles.icon} onClick={() => toggleVisible()}>
        {user ? (
          user.localProfileImagePath ? (
            <SupabaseImage
              width={imageSize}
              height={imageSize}
              src={user.localProfileImagePath}
              alt="Profilowe"
              quality={75}
            />
          ) : (
            <Image
              width={imageSize}
              height={imageSize}
              alt="Profilowe"
              src={user?.image || defaultProfile}
            />
          )
        ) : (
          <i className="fa-solid fa-user"></i>
        )}
      </span>
      <div
        className={`${styles.dropdown} ${visible ? "" : styles.hidden}`}
        onClick={() => toggleVisible(false)}
      >
        {user ? (
          <>
            <h2>{user.name}</h2>
            <Link className={styles.item} href="/dashboard/my-profile">
              <i className="fa-solid fa-user"></i>
              &nbsp; &nbsp; Profil
            </Link>
            <Link className={styles.item} href={"/dashboard/settings"}>
              <i className="fa-solid fa-gear"></i>
              &nbsp; &nbsp; Ustawienia
            </Link>
            <span
              className={styles.item}
              onClick={() => signOut({ redirect: false })}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              &nbsp; &nbsp; Wyloguj się
            </span>
          </>
        ) : (
          <span className={styles.item} onClick={() => signIn()}>
            <i className="fa-solid fa-right-to-bracket"></i>
            &nbsp; &nbsp; Zaloguj się
          </span>
        )}
      </div>
    </div>
  );
};

export default UserDropdown;
