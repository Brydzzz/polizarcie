import { getCurrentUser } from "@/actions/users";
import { parseDate } from "@/utils/date-time";
import { Restaurant, RestaurantReview, User } from "@prisma/client";
import { MouseEventHandler } from "react";
import StarInput from "../inputs/star-input.component";
import styles from "./review-card.module.scss";

type Props = {
  data: RestaurantReview & { restaurant: Restaurant; user: User };
  onClickUser?: MouseEventHandler;
  onClickRestaurant?: MouseEventHandler;
};

const ReviewCard = async ({ data, onClickUser, onClickRestaurant }: Props) => {
  const { restaurant, user, amountSpent, content, createdDate, stars } = data;
  const currentUser = await getCurrentUser();

  return (
    <div className={styles.container}>
      <div className={styles.spaceBetween}>
        <div className={styles.stack}>
          <span className={styles.title} onClick={onClickRestaurant}>
            {restaurant.name}
          </span>
          <StarInput value={stars} max={5} starSize={"18pt"} disabled />
          <span
            className={styles.amountSpent}
          >{`Cena na osobę: ${amountSpent} zł`}</span>
        </div>
        <div className={styles.stack}>
          <span className={styles.date}>{parseDate(createdDate)}</span>
          <span
            className={styles.user}
            onClick={onClickUser}
            style={{
              color:
                currentUser && currentUser.id == user.id
                  ? "var(--primary)"
                  : undefined,
            }}
          >
            {user.name}
          </span>
        </div>
      </div>
      <p className={styles.content}>{content}</p>
    </div>
  );
};

export default ReviewCard;
