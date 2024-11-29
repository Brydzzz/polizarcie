import { Restaurant, Review, User } from "@prisma/client";
import { MouseEventHandler } from "react";
import StarInput from "../inputs/star-input.component";
import styles from "./review-card.module.scss";

type Props = {
  data: Partial<
    Review & { restaurant: Partial<Restaurant> } & { user: Partial<User> }
  >;
  onClickUser?: MouseEventHandler;
  onClickRestaurant?: MouseEventHandler;
};

function formatDate(date: Date | undefined) {
  if (!date) {
    return "undefined";
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  {
    /* TODO: change date to how long ago */
  }
  return `${day}-${month}-${year}`;
}

const ReviewCard = ({ data, onClickUser, onClickRestaurant }: Props) => {
  const { restaurant, user, spent_per_person, content, date, points } = data;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.restaurant} onClick={onClickRestaurant}>
          {restaurant?.name}
        </p>
        <p className={styles.date}>{formatDate(date)}</p>
      </div>
      <div className={styles.details}>
        <p className={styles.user} onClick={onClickUser}>
          {user?.name}
        </p>
        <div className={styles.stars}>
          <StarInput value={points || 0} max={5} starSize={"25pt"} disabled />
        </div>
        <p
          className={styles.spent_per_person}
        >{`Cena na osobę: ${spent_per_person} zł`}</p>
        <p className={styles.content}>{content}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
