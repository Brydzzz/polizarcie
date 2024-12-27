"use client";
import { Match, User } from "@prisma/client";
import styles from "./match-request.module.scss";
type Props = {
  data: Partial<Match & { UserOne: Partial<User> }>;
};

const MatchRequestCard = ({ data }: Props) => {
  const { UserOne } = data;
  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <p className={styles.name}>{UserOne?.name}</p>
      </div>
    </div>
  );
};

export default MatchRequestCard;
