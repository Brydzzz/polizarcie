"use client"

import Searchbar from "@/components/inputs/searchbar.component";
import styles from "./page.module.scss";
import { get_restaurants } from "@/actions/get_restaurants";
import { useState, useEffect } from "react";
import { Restaurant } from "@prisma/client";
import { get_restaurants_by_name } from "@/actions/get_restaurants_by_name";
import Button from "@/components/button/button.component";
import {
  ButtonColor,
  ButtonSize,
  ButtonStyle,
} from "@/components/button/button.types";

const SearchPage = () => {
  const [rests, updateRestaurants] = useState<Restaurant[]>([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    const update = async () => {
      const data = await get_restaurants_by_name(input);
      updateRestaurants(data);
      return data;
    }
    update();

  }, [input])
  const middleIndex = Math.ceil(rests.length / 2);
  const [first_half, second_half] = [rests.slice(0, middleIndex), rests.slice(middleIndex)];
  return (
    <main className={styles.container}>
      <h1>Jedzonko w okolicy</h1>
      <Searchbar id="search" placeholder="Co byś dziś przekąsił?" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className={styles.matrix}>
      <ul>
        {first_half.map((rest, index) => (
          <li key = {index}><Button style={ButtonStyle.OUTLINE} color={ButtonColor.TEXT} size={ButtonSize.LARGE}>{rest.name}</Button>  </li>
        ))}
      </ul>
      <ul>
        {second_half.map((rest, index) => (
          <li key = {index}><Button style={ButtonStyle.OUTLINE} color={ButtonColor.TEXT} size={ButtonSize.LARGE}>{rest.name}</Button>  </li>
        ))}
        </ul>
        </div>


    </main>
  );
};

export default SearchPage;
