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
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [fourth, setFourth] = useState("");
  useEffect(() => {
    const update = async () => {
      const data = await get_restaurants_by_name(input);
      updateRestaurants(data);
      return data;
    }
    update();

    if (rests.length === 1) {
      console.log(1)
      setFirst(rests[0].name);
      setSecond("...");
      setThird("...");
      setFourth("...");
    }
    else if (rests.length === 2) {
      console.log(2)
      setFirst(rests[0].name);
      setSecond(rests[1].name);
      setThird("...");
      setFourth("...");
    }
    else if (rests.length === 3) {
      console.log(3)
      setFirst(rests[0].name);
      setSecond(rests[1].name);
      setThird(rests[2].name);
      setFourth("...");
    }
    else if (rests.length === 4) {
      console.log(4)
      setFirst(rests[0].name);
      setSecond(rests[1].name);
      setThird(rests[2].name);
      setFourth(rests[3].name);
    }
    else {
      setFirst("...");
      setSecond("...");
      setThird("...");
      setFourth("...");
    };
  }, [input])
  return (
    <main className={styles.container}>
      <h1>Jedzonko w okolicy</h1>
      <Searchbar id="search" placeholder="Co byś dziś przekąsił?" value={input} onChange={(e) => setInput(e.target.value)} />
        <table className={styles.matrix}>
          <tbody>
          <tr>
            <td><Button style={ButtonStyle.OUTLINE} color={ButtonColor.TEXT} size={ButtonSize.LARGE}>{first}</Button></td>
            <td><Button style={ButtonStyle.OUTLINE} color={ButtonColor.TEXT} size={ButtonSize.LARGE}>{third}</Button></td>
          </tr>
          <tr>
            <td><Button style={ButtonStyle.OUTLINE} color={ButtonColor.TEXT} size={ButtonSize.LARGE}>{second}</Button></td>
            <td><Button style={ButtonStyle.OUTLINE} color={ButtonColor.TEXT} size={ButtonSize.LARGE}>{fourth}</Button></td>
          </tr>
          </tbody>
        </table>
    </main>
  );
};

export default SearchPage;
