import RestaurantCard from "@/components/cards/restaurant-card.component";

const CardPage = () => {
  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "600px" }}>
        <RestaurantCard
          name="Marszałkowski Bar Mleczny"
          address="ul. Czekoladowa 55"
          description="Marszałkowski Bar Mleczny to klasyczna polska restauracja
          typu bar mleczny, która oferuje tradycyjne dania kuchni polskiej w przystępnych cenach."
        ></RestaurantCard>
        <RestaurantCard
          name="Marszałkowski Bar Mleczny"
          address="ul. Czekoladowa 55"
        ></RestaurantCard>
      </div>
    </div>
  );
};

export default CardPage;
