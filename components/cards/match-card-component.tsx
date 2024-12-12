"use server";

import { getTopLikedRests } from "@/lib/db/users";
import { User } from "@prisma/client";
import styles from "./match-card.module.scss";
import UserCard from "./user-desc-card-component";
type Props = {
  data: Partial<User>;
};

const MatchCard = async ({ data }: Props) => {
  const { name, description, id } = data;
  if (!data) return;
  const likedRests = await getTopLikedRests(String(id));
  console.log(likedRests);
  return (
    <div className={styles.container}>
      <div className={styles.photoBox}>
        <div className={styles.photo}></div>
      </div>
      <div className={styles.details}>
        <div className={styles.films}>
          <p> Lubię jeść: </p>
          <ul>
            {likedRests.map((rest, idx) => (
              <p>
                {idx + 1}. {rest.name}
              </p>
            ))}
          </ul>
        </div>
        <div className={styles.desc}>
          <UserCard data={data} socials={false}></UserCard>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
