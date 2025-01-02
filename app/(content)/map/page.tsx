"use client";
import BigMapView from "@/components/misc/big-map-view.component";
import SearchSection from "@/components/sections/search-section.component";
import { RestaurantFull } from "@/lib/db/restaurants";
import { useState } from "react";
import styles from "./page.module.scss";
const MapPage = () => {
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
            forceCompactRestaurantList
            forceSmallSearchBar
            forceSmallHeader
          ></SearchSection>
        </div>
      </div>
    </main>
  );
};

export default MapPage;
