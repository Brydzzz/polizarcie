"use client";
import { User, UserMedia } from "@prisma/client";
import styles from "./contact-card.module.scss";
import LinkCard from "./link-card.component";
type Props = {
  data: Partial<User>;
  medias: Partial<UserMedia>[];
};

const ContactCard = ({ data, medias }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.photoBox}>
          <div className={styles.photo}></div>
        </div>
        <div className={styles.namebox}>
          {data ? <p className={styles.name}>{data.name}</p> : null}
        </div>
      </div>
      <ol className={styles.medias}>
        {medias?.map((link, type) => (
          <LinkCard key={type} data={link}></LinkCard>
        ))}
      </ol>
    </div>
  );
};

export default ContactCard;
