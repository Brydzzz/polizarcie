"use client";
import { Match, User } from "@prisma/client";
import styles from "./match-request.module.scss";
type Props = {
  data: Partial<Match>;
  UserOne: Partial<User>;
};

const MatchRequestCard = ({ data, UserOne }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.details}>
        {UserOne ? <p className={styles.name}>{UserOne.name}</p> : null}
      </div>
    </div>
  );
};

export default MatchRequestCard;
