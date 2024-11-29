"use client";
import { get_restaurant_by_id } from "@/utils/prisma/restaurants";
import { Restaurant } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await get_restaurant_by_id(Number(id));
        setRestaurant(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      }
    };
    fetchRestaurant();
  }, [id]);
  if (error) return <div>Error: {error}</div>;
  return (
  <h1>{restaurant?.name}</h1>
);
};

export default RestaurantPage;
