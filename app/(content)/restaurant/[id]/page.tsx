"use client";
import Button from "@/components/button/button.component";
import {
  ButtonColor,
  ButtonSize,
  ButtonStyle,
} from "@/components/button/button.types";
import StarInput from "@/components/inputs/star-input.component";
import MapView from "@/components/map-view.component";
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
  if (loading)
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );

  if (error) return <div>Error: {error}</div>;

  const hours = [
    {
      day: "Pon",
      opening: restaurant?.opening_hour_mon,
      closing: restaurant?.closing_hour_mon,
    },
    {
      day: "Wt",
      opening: restaurant?.opening_hour_tue,
      closing: restaurant?.closing_hour_tue,
    },
    {
      day: "Śr",
      opening: restaurant?.opening_hour_wen,
      closing: restaurant?.closing_hour_wen,
    },
    {
      day: "Czw",
      opening: restaurant?.opening_hour_thu,
      closing: restaurant?.closing_hour_thu,
    },
    {
      day: "Pt",
      opening: restaurant?.opening_hour_fri,
      closing: restaurant?.closing_hour_fri,
    },
    {
      day: "Sob",
      opening: restaurant?.opening_hour_sat,
      closing: restaurant?.closing_hour_sat,
    },
    {
      day: "Nd",
      opening: restaurant?.opening_hour_sun,
      closing: restaurant?.closing_hour_sun,
    },
  ];

  return (
    <main className={styles.restaurantPage}>
      <div className={styles.header}>
        <p>{restaurant?.name}</p>
        {/* TODO: heart input for adding to favorite restaurants */}
        <span>
          <i className="fa-regular fa-heart fa-2x"></i>
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.mapContainer}>
            <MapView
              X_coord={Number(restaurant?.address?.X_coords)}
              Y_coord={Number(restaurant?.address?.Y_coords)}
            ></MapView>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.rating}>
            {/* TODO: get actual rating for restaurant */}
            <StarInput value={4} max={5} disabled></StarInput>
            <p>4,2</p>
          </div>
          <div className={styles.info}>
            <h3>Adres:</h3>
            <p>{restaurant?.address?.name}</p>
            <h3>Opis:</h3>
            <p>{restaurant?.description}</p>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.hours}>
            <h3>Godziny Otwarcia:</h3>
            <ul>
              {hours.map((hour, index) => (
                <li key={index}>
                  <div className={styles.open_hours}>
                    <p>
                      <strong>{hour.day}:</strong>
                    </p>
                    <p>
                      {hour.opening}:00 - {hour.closing}:00
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* TODO: button OnClick */}
          <Button
            style={ButtonStyle.SOLID}
            color={ButtonColor.PRIMARY}
            size={ButtonSize.NORMAL}
          >
            Napisz Opinię
          </Button>
        </div>
      </div>
    </main>
  );
};

export default RestaurantPage;
