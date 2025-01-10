"use client";
import BigMapView from "@/components/misc/big-map-view.component";
import SearchSection from "@/components/sections/search-section.component";
import { RestaurantFull } from "@/lib/db/restaurants";
import { useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { ViewportSize } from "@/lib/store/ui/ui.slice";
import { useState } from "react";
import styles from "./page.module.scss";
const MapPage = () => {
  const size = useAppSelector(selectViewportWidth);
  const [restaurants, updateRestaurants] = useState<RestaurantFull[]>([]);

  const handleUpdateRestaurants = (updatedRestaurants: RestaurantFull[]) => {
    updateRestaurants(updatedRestaurants);
  };

  return (
    <main className={styles.content}>
      <div className={styles.layout}>
        <div className={styles.mapContainer}>
          <div className={styles.roundEdges}>
            <BigMapView data={restaurants} />
          </div>
        </div>
        <div className={styles.searchContainer}>
          <SearchSection
            onUpdateRestaurants={handleUpdateRestaurants}
            forceOneRowRestaurantList
            forceCompactRestaurantList={size < 1420 && size > ViewportSize.MD}
            forceSmallSearchBar
            forceSmallHeader
            cardsOrigin="map"
          ></SearchSection>
        </div>
      </div>
    </main>
  );
};

export default MapPage;
