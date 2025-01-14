"use client";

import FavoriteRestaurantManager from "@/components/draggable/favorite-restaurant-manager.component";
import styles from "./page.module.scss";

function Favorite() {
  return (
    <div className={styles.container}>
      <FavoriteRestaurantManager cardsOrigin="favorite" />
    </div>
  );
}

export default Favorite;
