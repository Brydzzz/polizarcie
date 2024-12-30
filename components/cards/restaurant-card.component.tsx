import { RestaurantFull } from "@/lib/db/restaurants";
import { isRestaurantOpen } from "@/utils/restaurants";
import Link from "next/link";
import { MouseEventHandler } from "react";
import SupabaseImage from "../images/supabase-image.component";
import StarInput from "../inputs/star-input.component";
import styles from "./restaurant-card.module.scss";

type Props = {
  data: RestaurantFull;
  onClickAddress?: MouseEventHandler;
  mode?: "normal" | "compact";
  width?: number;
};

const RestaurantCard = ({ data, onClickAddress, mode, width }: Props) => {
  const {
    name,
    slug,
    address,
    description,
    images,
    averageStars,
    averageAmountSpent,
  } = data;
  const isOpen = isRestaurantOpen(data);

  return (
    <Link href={`/restaurant/${slug}`}>
      <div
        className={`${styles.container} ${
          mode === "compact" ? styles.compact : ""
        }`}
      >
        <div className={styles.photo}>
          {images.length === 0 ? (
            <p>Brak zdjęcia</p>
          ) : (
            <SupabaseImage
              src={images[0].path}
              width={width ? width : 140}
              height={140}
              quality={50}
              alt="Zdjęcie"
            />
          )}
          {averageStars && (
            <div className={styles.stars}>
              <StarInput
                max={5}
                value={averageStars}
                starSize="12pt"
                disabled
              />
            </div>
          )}
        </div>
        <div className={styles.details}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.address} onClick={onClickAddress}>
            {address?.name}
          </span>
          <p className={styles.description}>{description}</p>
          {averageAmountSpent && (
            <span className={styles.price}>
              Średnia cena na osobę: <b>{averageAmountSpent}&nbsp;zł</b>
            </span>
          )}
          {<span className={styles.open}>Otwarte teraz!</span>}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
