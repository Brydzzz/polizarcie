import { getRestaurantsLike } from "@/actions/restaurants";
import { getCurrentUser } from "@/actions/users";
import DishCard from "@/components/cards/dish-card.component";
import RestaurantCard from "@/components/cards/restaurant-card.component";
import ReviewCard from "@/components/cards/review-card.component";
import {
  Address,
  Dish,
  Prisma,
  Restaurant,
  RestaurantReview,
  User,
} from "@prisma/client";

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
    price: new Prisma.Decimal(23),
  },
];

const CardPage = async () => {
  const TEST_REV: Partial<
    RestaurantReview & { restaurant: Partial<Restaurant> } & {
      user: Partial<User>;
    }
  >[] = [
    {
      content:
        "Bardzo dobry kebsik, aaaaa ale długa recenzja o moj boze ale ona jest dluga niech ktos ja powstrzyma",
      stars: 4,
      amountSpent: new Prisma.Decimal(23),
      createdDate: new Date("2024-11-23"),
      restaurant: (await getRestaurantsLike("dubai")).at(0),
      user: (await getCurrentUser()) || undefined,
    },
  ];

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
          <DishCard key={i} data={dish}></DishCard>
        ))}
        {TEST_REV.map((rev, i) => (
          <ReviewCard key={i} data={rev}></ReviewCard>
        ))}
      </div>
    </div>
  );
};

export default CardPage;
