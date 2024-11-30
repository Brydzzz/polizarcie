import { getRestaurantsLike } from "@/actions/restaurants";
import { getCurrentUser } from "@/actions/users";
import ReviewCard from "@/components/cards/review-card.component";
import { Prisma, Restaurant, RestaurantReview, User } from "@prisma/client";

const Page = async () => {
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
        {TEST_REV.map((rev, i) => (
          <ReviewCard key={i} data={rev}></ReviewCard>
        ))}
      </div>
    </div>
  );
};

export default Page;
