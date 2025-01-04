"use client";
import MenuList from "@/components/lists/menu-list.component";
import { Dish } from "@prisma/client";

const TEST_MENU: Partial<Dish>[] = [
  {
    id: "8",
    name: "Surówka",
    description: "Z kapusty",
    priceZl: 6,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "STARTER",
  },
  {
    id: "7",
    name: "Frytki",
    description: "Z keczupem",
    priceZl: 12,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "STARTER",
  },
  {
    id: "3",
    name: "Kebab duży",
    description: "Baranina/wołowina, surówka, pita",
    priceZl: 26,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "MAIN_DISH",
  },
  {
    id: "5",
    name: "Fryto kebab",
    description: "Baranina/wołowina, surówka i, frytki, w picie",
    priceZl: 25,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "MAIN_DISH",
  },
  {
    id: "1",
    name: "Kebab średni",
    description: "Baranina/wołowina, surówka, pita",
    priceZl: 23,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "MAIN_DISH",
  },
  {
    id: "4",
    name: "Talerz kebab",
    description: "Baranina/wołowina, surówka i frytki razem na talerzu",
    priceZl: 30,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "MAIN_DISH",
  },
  {
    id: "2",
    name: "Kebab mały",
    description: "Baranina/wołowina, surówka, pita",
    priceZl: 20,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "MAIN_DISH",
  },
  {
    id: "6",
    name: "Baklawa",
    description: "Tradycyjne tureckie ciastko",
    priceZl: 7,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "DESSERT",
  },
  {
    id: "9",
    name: "Ciastko",
    description: "Czekoladowe",
    priceZl: 4,
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "DESSERT",
  },
  {
    id: "10",
    name: "Coca-Cola",
    priceZl: 6,
    description: "0.5l",
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "DRINK",
  },
  {
    id: "11",
    name: "Ajran",
    priceZl: 7,
    description: "1l",
    totalStars: 0,
    restaurantId: "5",
    hidden: false,
    type: "DRINK",
  },
];
const ListsPage = () => {
  return (
    <div
      className="centralized-x"
      style={{ width: "900px", margin: "auto", paddingTop: "50px" }}
    >
      <MenuList data={TEST_MENU} />
    </div>
  );
};

export default ListsPage;
