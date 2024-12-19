"use client";
import { getTopLikedRests } from "@/lib/db/users";
import { Restaurant, User } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./match-card.module.scss";
import UserCard from "./user-desc-card-component";
type Props = {
  data: Partial<User>;
};

const MatchCard = ({ data }: Props) => {
  const [likedRests, setLikedRests] = useState<Restaurant[]>([]);
  const { id } = data;
  useEffect(() => {
    const update = async () => {
      const restaurants = await getTopLikedRests(String(id));
      setLikedRests(restaurants);
    };
    update();
  }, []);
  // const likedRests = await getTopLikedRests(String(id));
  console.log(likedRests);
  return (
    <div className={styles.container}>
      <div className={styles.photoBox}>
        <div className={styles.photo}></div>
      </div>
      <div className={styles.details}>
        <div className={styles.restaurants}>
          <p> Lubię jeść: </p>
          <ul>
            {likedRests.map((rest, idx) => (
              <p key={idx}>
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
