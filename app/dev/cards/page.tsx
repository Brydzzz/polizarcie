import DishCard from "@/components/cards/dish-card.component";
import RestaurantCard from "@/components/cards/restaurant-card.component";
import { Address, Dish, Restaurant } from "@prisma/client";

const TEST_REST: Partial<Restaurant & { address: Partial<Address> }>[] = [
  {
    name: "Marszałkowski Bar Mleczny",
    address: {
      name: "ul. Czekoladowa 55",
    },
    description:
      "Marszałkowski Bar Mleczny to klasyczna polska restauracja typu bar mleczny, która oferuje tradycyjne dania kuchni polskiej w przystępnych cenach.",
  },
  {
    name: "Marszałkowski Bar Mleczny",
    address: {
      name: "ul. Czekoladowa 55",
    },
    description:
      "Marszałkowski Bar Mleczny to klasyczna polska restauracja typu bar mleczny, która oferuje tradycyjne dania kuchni polskiej w przystępnych cenach.",
  },
];

const TEST_DISH: Partial<Dish>[] = [
  {
    name: "Kebab średni",
    description: "Baranina/Kurczak, surówka, pita, sosy",
    price: 23
  }
];

const CardPage = () => {
  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "600px" }}>
        {TEST_REST.map((rest, i) => (
          <RestaurantCard key={i} data={rest}></RestaurantCard>
        ))}
        {TEST_DISH.map((dish, i) => (
          <DishCard key = {i} data = {dish}></DishCard>
        ))}
      </div>
    </div>
  );
};

export default CardPage;
