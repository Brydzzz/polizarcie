"use client";

import FilterCard, {
  FilterCardStyle,
} from "@/components/cards/filter-card.component";
import RestaurantCard from "@/components/cards/restaurant-card.component";
import Searchbar from "@/components/inputs/searchbar.component";
import type { Filters } from "@/components/modals/filter-modal.component";
import FilterModal, {
  facultyOptions,
} from "@/components/modals/filter-modal.component";
import { getRestaurantsLike, RestaurantFull } from "@/lib/db/restaurants";
import { transferWithJSON } from "@/utils/misc";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const SearchPage = () => {
  const filters_default: Filters = {
    priceRange: { min: 0, max: 100 },
    isOpen: false,
    minRating: 1,
    sortOption: "name-asc",
    faculty: { value: "none", x: undefined, y: undefined },
    facultyDistance: 400,
  };
  const [filters, setFilters] = useState(filters_default);
  const [rests, updateRestaurants] = useState<RestaurantFull[]>([]);
  const [input, setInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setIsModalVisible(false);
  };

  const handleFilterCancel = <K extends keyof Filters>(cancelledFilter: K) => {
    let newFilters = { ...filters };
    newFilters[cancelledFilter] = filters_default[cancelledFilter];
    setFilters(newFilters);
  };

  const areFiltersDefault =
    JSON.stringify(filters) === JSON.stringify(filters_default);

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
      <div className={`${isModalVisible ? styles.overlay : ""}`}></div>
      {isModalVisible && (
        <div className={styles.filterModal}>
          <FilterModal
            filters={filters}
            onApplyButtonClick={handleFilterChange}
            onCancelButtonClick={() => setIsModalVisible(false)}
          />
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
      <div className={styles.filterCards}>
        {!areFiltersDefault && (
          <FilterCard
            name={"Wyczyść wszystkie filtry"}
            value={""}
            style={FilterCardStyle.BACKDROP}
            onCardClick={() => setFilters(filters_default)}
          ></FilterCard>
        )}
        {!(
          filters.priceRange.min === filters_default.priceRange.min &&
          filters.priceRange.max === filters_default.priceRange.max
        ) && (
          <FilterCard
            name={"Cena na osobę"}
            value={`${filters.priceRange.min}zł - ${filters.priceRange.max}zł`}
            onCancelButtonClick={() => handleFilterCancel("priceRange")}
          ></FilterCard>
        )}
        {filters.minRating !== 1 && (
          <FilterCard
            name={"Minimalna Ocena"}
            value={filters.minRating}
            onCancelButtonClick={() => handleFilterCancel("minRating")}
          ></FilterCard>
        )}
        {filters.isOpen && (
          <FilterCard
            name={"Otwarte Teraz"}
            value={"Tak"}
            onCancelButtonClick={() => handleFilterCancel("isOpen")}
          ></FilterCard>
        )}
        {filters.faculty.value !== "none" && (
          <FilterCard
            name={"Wydział"}
            value={`${
              facultyOptions.find((f) => f.value === filters.faculty.value)
                ?.name
            } ≤ ${filters.facultyDistance}m`}
            onCancelButtonClick={() => handleFilterCancel("faculty")}
          ></FilterCard>
        )}
      </div>
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
