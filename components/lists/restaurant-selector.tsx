import { getRestaurantsByQuery, RestaurantFull } from "@/lib/db/restaurants";
import { useAppDispatch } from "@/lib/store/hooks";
import { makeRequest } from "@/utils/misc";
import { Restaurant } from "@prisma/client";
import { useEffect, useState } from "react";
import { InputSize, InputStyle } from "../inputs/input.types";
import Searchbar from "../inputs/searchbar.component";
import styles from "./restaurant-selector.module.scss";

type Props = {
  onSelected?: (selected: RestaurantFull | undefined) => void | Promise<void>;
};

const RestaurantSelector = ({ onSelected }: Props) => {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState<RestaurantFull[]>([]);
  const [active, setActive] = useState<Restaurant | undefined>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (query === "") {
      setRestaurants([]);
      return;
    }
    const exec = async () => {
      const result = await makeRequest(
        getRestaurantsByQuery,
        [query],
        dispatch
      );
      setRestaurants(result);
    };
    exec();
  }, [query]);

  return (
    <div className={styles.container}>
      <Searchbar
        size={InputSize.SMALL}
        style={InputStyle.INPUT_LIKE}
        placeholder="Wyszukaj restaurację"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onCancelButtonClick={() => {
          setActive(undefined);
          if (onSelected) onSelected(undefined);
          setQuery("");
        }}
      />
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className={styles.item}
          onClick={() => {
            setActive(restaurant);
            if (onSelected) onSelected(restaurant);
            setQuery("");
          }}
        >
          {restaurant.name}
        </div>
      ))}
      <div className={styles.selected}>
        {active ? (
          <>
            Wybrano: <span>{active.name}</span>
          </>
        ) : (
          "Nie wybrano"
        )}
      </div>
    </div>
  );
};

export default RestaurantSelector;
