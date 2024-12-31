"use client";

import FilterCard, {
  FilterCardStyle,
} from "@/components/cards/filter-card.component";
import { InputSize } from "@/components/inputs/input.types";
import Searchbar from "@/components/inputs/searchbar.component";
import RestaurantList from "@/components/lists/restaurant-list.component";
import type { Filters } from "@/components/modals/filter-modal.component";
import FilterModal, {
  facultyOptions,
} from "@/components/modals/filter-modal.component";
import { getRestaurantsLike, RestaurantFull } from "@/lib/db/restaurants";
import { useAppSelector } from "@/lib/store/hooks";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { ViewportSize } from "@/lib/store/ui/ui.slice";
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
  const [restaurants, updateRestaurants] = useState<RestaurantFull[]>([]);
  const [input, setInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const size = useAppSelector(selectViewportWidth);

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
      <h1 className={`${size < ViewportSize.SM ? styles.compact : ""}`}>
        Jedzonko w okolicy
      </h1>
      <Searchbar
        id="search"
        placeholder="Co byś dziś przekąsił?"
        size={
          size > ViewportSize.LG
            ? InputSize.LARGE
            : size > ViewportSize.XS
            ? InputSize.MEDIUM
            : InputSize.SMALL
        }
        value={input}
        cssStyle={
          size <= ViewportSize.XS
            ? { width: "min(500px, calc(100vw - 40px))" }
            : undefined
        }
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
      <RestaurantList data={restaurants} />
    </main>
  );
};

export default SearchPage;
