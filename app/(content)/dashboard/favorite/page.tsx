"use client";

import FavoriteRestaurantManager from "@/components/draggable/favorite-restaurant-manager.component";

function Favorite() {
  return (
    <div>
      <FavoriteRestaurantManager cardsOrigin="favorite"/>
    </div>
  );
}

export default Favorite;
