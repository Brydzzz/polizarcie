"use client";
import { Restaurant, User } from "@prisma/client";
import SupabaseImage from "../images/supabase-image.component";
import styles from "./match-card.module.scss";
import UserCard from "./user-desc-card-component";
type Props = {
  data: Partial<User>;
  likedRests: Partial<Restaurant>[];
};

const MatchCard = ({ data, likedRests }: Props) => {
  const { id } = data;
  return (
    <div className={styles.container}>
      <div className={styles.photoBox}>
        {data.image ? (
          data.image.includes("https") ? (
            <img src={data.image} width={162} height={162} alt="Zdjęcie" />
          ) : (
            <SupabaseImage
              src={data.image}
              width={162}
              height={162}
              quality={100}
              alt="Zdjęcie"
            />
          )
        ) : null}
      </div>
      <div className={styles.details}>
        <div className={styles.restaurants}>
          <p> Lubię jeść: </p>
          {likedRests ? (
            <ul>
              {likedRests.map((rest, idx) => (
                <p key={idx}>
                  {idx + 1}. {rest.name || null}
                </p>
              ))}
            </ul>
          ) : null}
        </div>
        <div className={styles.desc}>
          <UserCard data={data} socials={false}></UserCard>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
