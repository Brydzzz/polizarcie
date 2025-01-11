"use client";
import { User, UserMedia } from "@prisma/client";
import Link from "next/link";
import LinkCard from "./link-card.component";
import styles from "./user-desc-card.module.scss";
type Props = {
  data: Partial<User & { medias: Partial<UserMedia>[] }>;
  socials: boolean;
};

const UserCard = ({ data, socials }: Props) => {
  const { name, description, medias } = data;
  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <Link className={styles.name} href={`/profile/${data.id}`}>
          <b>{data.name}</b>
        </Link>
        <p className={styles.description}>
          {description ? description : "Użytkownik nie posiada opisu"}
        </p>
        {socials ? (
          <ol className={styles.medias}>
            {medias?.map((link, type) => (
              <LinkCard key={type} data={link}></LinkCard>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
};

export default UserCard;
