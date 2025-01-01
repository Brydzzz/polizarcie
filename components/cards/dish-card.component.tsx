import { Dish } from "@prisma/client";
import styles from "./dish-card.module.scss";
type Props = {
  data: Partial<Dish>;
};

const DishCard = ({ data }: Props) => {
  const { name, description, priceZl, priceGr } = data;
  return (
    <div className={styles.container}>
      <span className={styles.name}>{name}</span>
      <p className={styles.description}>{description}</p>
      <div className={styles.price}>{`${priceZl}.${priceGr} zł`}</div>
    </div>
  );
};

export default DishCard;
