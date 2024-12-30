"use client";
import { User, UserMedia } from "@prisma/client";
import SupabaseImage from "../images/supabase-image.component";
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
          {data.image ? (
            data.image.includes("https") ? (
              <img src={data.image} width={30} height={30} alt="Zdjęcie" />
            ) : (
              <SupabaseImage
                src={data.image}
                width={30}
                height={30}
                quality={50}
                alt="Zdjęcie"
              />
            )
          ) : null}
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
