import { Dish } from "@prisma/client";
import Link from "next/link";
import StarInput from "../inputs/star-input.component";
import styles from "./dish-card.module.scss";
type Props = {
  data: Dish;
  restaurantSlug: string;
};

const DishCard = ({ data, restaurantSlug }: Props) => {
  const { name, description, priceZl, priceGr, slug } = data;
  return (
    <div className={styles.container}>
      <Link
        href={`/restaurant/${restaurantSlug}/${slug}`}
        className={styles.name}
      >
        {name}
      </Link>
      <div className={styles.column}>
        {data.averageStars && (
          <StarInput
            max={5}
            value={data.averageStars}
            disabled
            starSize="12pt"
          />
        )}
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.price}>{`${priceZl}.${priceGr} zł`}</div>
    </div>
  );
};

export default DishCard;
