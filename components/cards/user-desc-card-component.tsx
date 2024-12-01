"use server";
import { User, UserMedia } from "@prisma/client";
import LinkCard from "./link-card.component";
import styles from "./user-desc-card.module.scss";
type Props = {
  data: Partial<User & { medias: Partial<UserMedia>[] }>;
};

const UserCard = ({ data }: Props) => {
  const { name, description, medias } = data;
  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <p className={styles.name}>{name}</p>
        <p className={styles.description}>{description}</p>
        {/* TODO fix the error below*/}
        <ol className={styles.medias}>
          {medias.map((link, type) => (
            <LinkCard key={type} data={link}></LinkCard>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default UserCard;
