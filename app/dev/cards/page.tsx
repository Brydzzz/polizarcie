import RestaurantCard from "@/components/cards/restaurant-card.component";
import { Address, Restaurant } from "@prisma/client";

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
      </div>
    </div>
  );
};

export default CardPage;
