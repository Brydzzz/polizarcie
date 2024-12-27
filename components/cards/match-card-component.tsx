"use client";
import { Restaurant, User } from "@prisma/client";
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
        <div className={styles.photo}></div>
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
