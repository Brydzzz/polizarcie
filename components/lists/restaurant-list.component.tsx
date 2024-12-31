"use client";

import useViewportSize, { ViewportSize } from "@/hooks/use-viewport-size";
import { RestaurantFull } from "@/lib/db/restaurants";
import RestaurantCard from "../cards/restaurant-card.component";
import styles from "./restaurant-list.module.scss";

type Props = {
  data: RestaurantFull[];
};

const RestaurantList = ({ data }: Props) => {
  const size = useViewportSize();

  return (
    <div
      className={`${styles.container} ${
        size < ViewportSize.LG ? styles.oneRow : ""
      }`}
    >
      {data.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          data={restaurant}
          mode={size < ViewportSize.XS ? "compact" : "normal"}
          width={size < ViewportSize.XS ? size : undefined}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
