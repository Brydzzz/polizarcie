"use client";
import MenuList from "@/components/lists/menu-list.component";
import { getAllRestaurants, getMenuByRestaurantId } from "@/lib/db/restaurants";

const ListsPage = async () => {
  const restaurant = (await getAllRestaurants())[0];
  const menu = await getMenuByRestaurantId(restaurant.id);

  return (
    <div
      className="centralized-x"
      style={{ width: "900px", margin: "auto", paddingTop: "50px" }}
    >
      <MenuList data={menu} restaurantSlug={restaurant.slug} />
    </div>
  );
};

export default ListsPage;
