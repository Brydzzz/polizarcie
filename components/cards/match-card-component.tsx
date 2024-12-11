"use server";

import { getTopLikedRests } from "@/lib/db/users";
import { User } from "@prisma/client";
import styles from "./match-card.module.scss";
type Props = {
  data: Partial<User>;
};

const MatchCard = async ({ data }: Props) => {
  const { name, description, id } = data;
  if (!data) return;
  const likedRests = await getTopLikedRests(String(id));
  return (
    <div className={styles.container}>
      <div className={styles.photo}></div>
    </div>
  );
};

export default MatchCard;
