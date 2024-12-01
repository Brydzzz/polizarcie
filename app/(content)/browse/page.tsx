"use client";

import RestaurantCard from "@/components/cards/restaurant-card.component";
import Searchbar from "@/components/inputs/searchbar.component";
import { getRestaurantsLike } from "@/lib/db/restaurants";
import { Restaurant } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const SearchPage = () => {
  const [rests, updateRestaurants] = useState<Restaurant[]>([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    const update = async () => {
      const data = await getRestaurantsLike(input);
      updateRestaurants(data);
      return data;
    };
    update();
  }, [input]);
  const middleIndex = Math.ceil(rests.length / 2);
  const [first_half, second_half] = [
    rests.slice(0, middleIndex),
    rests.slice(middleIndex),
  ];
  return (
    <main className={styles.container}>
      <h1>Jedzonko w okolicy</h1>
      <Searchbar
        id="search"
        placeholder="Co byś dziś przekąsił?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onCancelButtonClick={() => setInput("")}
      />
      <div className={styles.matrix}>
        <div className={styles.column}>
          {first_half.map((rest, index) => (
            <RestaurantCard key={index} data={rest}></RestaurantCard>
          ))}
        </div>
        <div className={styles.column}>
          {second_half.map((rest, index) => (
            <RestaurantCard key={index} data={rest}></RestaurantCard>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
