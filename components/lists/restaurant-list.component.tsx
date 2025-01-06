"use client";

import { RestaurantFull } from "@/lib/db/restaurants";
import { useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { ViewportSize } from "@/lib/store/ui/ui.slice";
import RestaurantCard from "../cards/restaurant-card.component";
import styles from "./restaurant-list.module.scss";

type Props = {
  data: RestaurantFull[];
  forceOneRow?: boolean;
  forceCompact?: boolean;
};

const RestaurantList = ({ data, forceOneRow, forceCompact }: Props) => {
  const size = useAppSelector(selectViewportWidth);

  return (
    <div
      className={`${styles.container} ${
        forceOneRow || size < 1080 ? styles.oneRow : ""
      }`}
    >
      {data.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          data={restaurant}
          mode={forceCompact || size < ViewportSize.XS ? "compact" : "normal"}
          width={size < ViewportSize.XS ? size : undefined}
        />
      ))}
    </div>
  );
};

export default RestaurantList;
