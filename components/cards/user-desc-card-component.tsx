"use client";
import { User, UserMedia } from "@prisma/client";
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
        <p className={styles.name}>{name}</p>
        <p className={styles.description}>{description}</p>
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
