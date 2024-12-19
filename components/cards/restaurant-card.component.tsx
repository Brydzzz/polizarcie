import { RestaurantFull } from "@/lib/db/restaurants";
import Link from "next/link";
import { MouseEventHandler } from "react";
import SupabaseImage from "../misc/supabase-image";
import styles from "./restaurant-card.module.scss";

type Props = {
  data: RestaurantFull;
  onClickAddress?: MouseEventHandler;
};

const RestaurantCard = ({ data, onClickAddress }: Props) => {
  const { name, slug, address, description, images } = data;
  return (
    <Link href={`/restaurant/${slug}`}>
      <div className={styles.container}>
        <div className={styles.photo}>
          {images.length === 0 ? (
            <p>Brak zdjęcia</p>
          ) : (
            <SupabaseImage
              src={images[0].path}
              width={140}
              height={140}
              quality={50}
              alt="Zdjęcie"
            />
          )}
        </div>
        <div className={styles.details}>
          <p className={styles.name}>{name}</p>
          <p className={styles.address} onClick={onClickAddress}>
            {address?.name}
          </p>
          <div className={styles.description}>
            <p>{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
