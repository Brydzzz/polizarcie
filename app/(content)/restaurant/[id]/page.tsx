"use client";
import StarInput from "@/components/inputs/star-input.component";
import { get_restaurant_by_id } from "@/utils/prisma/restaurants";
import { Address, Restaurant } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const RestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<
    Restaurant & { address: Partial<Address> | null }
  >();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data_str = await get_restaurant_by_id(Number(id));
        const data = JSON.parse(data_str);
        setRestaurant(data);
        setLoading(false);
      } catch (err: unknown) {
        setError((err as Error).message);
      }
    };
    fetchRestaurant();
  }, [id]);
  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;
  return (
    <main className={styles.restaurantPage}>
      <div className={styles.header}>
        <p>{restaurant?.name}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.mapContainer}>Map</div>
        <div className={styles.rating}>
          <StarInput value={4} max={5} disabled></StarInput>
          <p>4,2</p>
        </div>
        <div className={styles.info}>
          <p>
            <strong>Adres:</strong> {restaurant?.address?.name}
          </p>
          <p>
            <strong>Opis:</strong> {restaurant?.description}
          </p>
        </div>
        <div className={styles.hours}></div>
      </div>
    </main>
  );
};

export default RestaurantPage;
