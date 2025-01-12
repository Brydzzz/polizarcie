"use client";
import defaultProfile from "@/assets/defaultProfile.svg";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import ModalableImage from "../images/modalable-image.component";
import styles from "./our-pending-card.module.scss";
type Props = {
  data: Partial<User>;
};

const OurPendingCard = ({ data }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.photoBox}>
          {data.localProfileImagePath ? (
            <ModalableImage
              width={35}
              height={35}
              src={data.localProfileImagePath}
              alt="Profilowe"
              quality={100}
            />
          ) : (
            <Image
              width={35}
              height={35}
              alt="Profilowe"
              src={data.image || defaultProfile}
            />
          )}
        </div>
        <div className={styles.namebox}>
          {data ? (
            <Link className={styles.name} href={`/profile/${data.id}`}>
              <b>{data.name}</b>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OurPendingCard;
