"use client";

import RestaurantCard from "@/components/cards/restaurant-card.component";
import Searchbar from "@/components/inputs/searchbar.component";
import type { Filters } from "@/components/modals/filter-modal.component";
import FilterModal from "@/components/modals/filter-modal.component";
import { getRestaurantsLike, RestaurantFull } from "@/lib/db/restaurants";
import { transferWithJSON } from "@/utils/misc";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const SearchPage = () => {
  const filters_default: Filters = {
    priceRange: { min: 0, max: 100 },
    isOpen: false,
    minRating: 0,
    sortOption: "name-asc",
    faculty: { value: "none", x: undefined, y: undefined },
  };
  const [filters, setFilters] = useState(filters_default);
  const [rests, updateRestaurants] = useState<RestaurantFull[]>([]);
  const [input, setInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setIsModalVisible(false);
  };

  useEffect(() => {
    const update = async () => {
      const data = await transferWithJSON(getRestaurantsLike, [input, filters]);
      updateRestaurants(data);
      return data;
    };
    update();
  }, [input, filters]);
  const [firstColumn, secondColumn] = rests.reduce(
    ([col1, col2], rest, index) => {
      if (index % 2 === 0) {
        col1.push(rest);
      } else {
        col2.push(rest);
      }
      return [col1, col2];
    },
    [[], []] as [RestaurantFull[], RestaurantFull[]]
  );
  return (
    <main className={styles.container}>
      {isModalVisible && (
        <div className={`${isModalVisible ? styles.overlay : ""}`}>
          <div className={styles.filterModal}>
            <FilterModal
              filters={filters}
              onApplyButtonClick={handleFilterChange}
              onCancelButtonClick={() => setIsModalVisible(false)}
            />
          </div>
        </div>
      )}
      <h1>Jedzonko w okolicy</h1>
      <Searchbar
        id="search"
        placeholder="Co byś dziś przekąsił?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onCancelButtonClick={() => setInput("")}
        filters
        onFilterButtonClick={(e) => setIsModalVisible(!isModalVisible)}
      />
      <div className={styles.matrix}>
        <div className={styles.column}>
          {firstColumn.map((rest, index) => (
            <RestaurantCard key={index} data={rest}></RestaurantCard>
          ))}
        </div>
        <div className={styles.column}>
          {secondColumn.map((rest, index) => (
            <RestaurantCard key={index} data={rest}></RestaurantCard>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
