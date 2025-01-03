"use client";
import { User } from "@prisma/client";
import SupabaseImage from "../images/supabase-image.component";
import styles from "./our-pending-card.module.scss";
type Props = {
  data: Partial<User>;
};

const OurPendingCard = ({ data }: Props) => {
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
    </div>
  );
};

export default OurPendingCard;
