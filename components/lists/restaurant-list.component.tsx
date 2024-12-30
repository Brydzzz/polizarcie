"use client";

import useViewportSize from "@/hooks/use-viewport-size";
import { RestaurantFull } from "@/lib/db/restaurants";
import RestaurantCard from "../cards/restaurant-card.component";
import styles from "./restaurant-list.module.scss";

type Props = {
  data: RestaurantFull[];
};

const RestaurantList = ({ data }: Props) => {
  const size = useViewportSize();

  return (
    <div className={`${styles.container} ${size < 1020 ? styles.oneRow : ""}`}>
      {data.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          data={restaurant}
          mode={size < 500 ? "compact" : "normal"}
          width={size < 500 ? size : undefined}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
