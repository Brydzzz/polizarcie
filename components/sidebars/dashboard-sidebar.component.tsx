"use client";

import defaultProfile from "@/assets/defaultProfile.svg";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import SupabaseImage from "../images/supabase-image.component";
import styles from "./dashboard-sidebar.module.scss";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const currentUser = useAppSelector(selectCurrentUser);
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") redirect("/auth/sign-in");
  }, [session]);

  return (
    <div className={styles.sidebar}>
      <h2>
        {currentUser?.localProfileImagePath ? (
          <SupabaseImage
            width={30}
            height={30}
            src={currentUser.localProfileImagePath}
            alt="Profilowe"
            quality={75}
          />
        ) : (
          <Image
            width={30}
            height={30}
            alt="Profilowe"
            src={currentUser?.image || defaultProfile}
          />
        )}
        Twój panel
      </h2>
      <Link
        className={`${styles.item} ${
          pathname.includes("/my-profile") ? styles.active : ""
        }`}
        href="/dashboard/my-profile"
      >
        <i className="fa-solid fa-user"></i>
        &nbsp; &nbsp; Twój profil
      </Link>
      <Link
        className={`${styles.item} ${
          pathname.includes("/dashboard/settings") ? styles.active : ""
        }`}
        href="/dashboard/settings"
      >
        <i className="fa-solid fa-gear"></i>
        &nbsp; &nbsp; Twoje ustawienia
      </Link>
      <Link
        className={`${styles.item} ${
          pathname.includes("/favorite") ? styles.active : ""
        }`}
        href="/dashboard/favorite"
      >
        <i className="fa-solid fa-heart"></i>
        &nbsp; &nbsp; Twoje ulubione
      </Link>
    </div>
  );
};

export default DashboardSidebar;
