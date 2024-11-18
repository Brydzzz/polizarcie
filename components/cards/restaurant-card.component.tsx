import { Address, Restaurant } from "@prisma/client";
import { MouseEventHandler } from "react";
import styles from "./restaurant-card.module.scss";

type Props = {
  data: Partial<Restaurant & { address: Partial<Address> }>;
  onClickCard?: MouseEventHandler;
  onClickAddress?: MouseEventHandler;
};

const RestaurantCard = ({ data, onClickCard, onClickAddress }: Props) => {
  const { name, address, description } = data;
  return (
    <div className={styles.container} onClick={onClickCard}>
      <div className={styles.photo}>
        <p>Restaurant Photo</p>
      </div>
      <div className={styles.details}>
        <p className={styles.name}>{name}</p>
        <p className={styles.address} onClick={onClickAddress}>
          {address?.name}
        </p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
