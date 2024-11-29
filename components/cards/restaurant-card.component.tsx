import { Address, Restaurant } from "@prisma/client";
import Link from "next/link";
import { MouseEventHandler } from "react";
import styles from "./restaurant-card.module.scss";

type Props = {
  data: Partial<Restaurant & { address: Partial<Address> }>;
  onClickAddress?: MouseEventHandler;
};

const RestaurantCard = ({ data, onClickAddress }: Props) => {
  const { name, address, description } = data;
  return (
    <Link href={`/restaurant/${data.id}`}>
      <div className={styles.container}>
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
    </Link>
  );
};

export default RestaurantCard;
