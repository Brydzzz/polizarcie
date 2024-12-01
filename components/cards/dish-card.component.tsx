import { Dish } from "@prisma/client";
import styles from "./dish-card.module.scss";
type Props = {
  data: Partial<Dish>;
};

const DishCard = ({ data }: Props) => {
  const { name, description, priceZl, priceGr } = data;
  return (
    <div className={styles.container}>
      <div className={styles.details}>
        <p className={styles.name}>{name}</p>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.right}>
        <p className={styles.price}>{`${priceZl}.${priceGr} zł`}</p>
      </div>
    </div>
  );
};

export default DishCard;
