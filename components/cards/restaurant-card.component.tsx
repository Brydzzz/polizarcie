import { MouseEventHandler } from "react";
import styles from "./restaurant-card.module.scss";

type Props = {
  name: string;
  address: string;
  description?: string;
  onClickCard?: MouseEventHandler;
  onClickAddress?: MouseEventHandler;
};

const RestaurantCard = ({
  name,
  address,
  description,
  onClickCard,
  onClickAddress,
}: Props) => {
  return (
    <div className={styles.container} onClick={onClickCard}>
      <div className={styles.photo}>
        <p>Restaurant Photo</p>
      </div>
      <div className={styles.details}>
        <p className={styles.name}>{name}</p>
        <p className={styles.address} onClick={onClickAddress}>
          {address}
        </p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
