"use client";
import Button from "@/components/button/button.component";
import {
  ButtonColor,
  ButtonSize,
  ButtonStyle,
} from "@/components/button/button.types";
import StarInput from "@/components/inputs/star-input.component";
import MapView from "@/components/map-view.component";
import { parseTime } from "@/utils/date-time";
import {
  fetchRestaurantBySlug,
  fetchRestaurantReviews,
} from "@/utils/db/restaurants";
import { Address, Restaurant, RestaurantReview } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

const RestaurantPage = () => {
  console.log("Hello");
  const { slug } = useParams<{ slug: string }>();
  const [restaurant, setRestaurant] = useState<
    Restaurant & { address: Partial<Address> | null }
  >();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<RestaurantReview[]>([]);
  const [score, setScore] = useState<number>();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data_str = await fetchRestaurantBySlug(slug);
        const data = JSON.parse(data_str);
        setRestaurant(data);
        setLoading(false);
      } catch (err: unknown) {
        setError((err as Error).message);
      }
    };
    fetchRestaurant();
  }, [slug]);
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const revs = await fetchRestaurantReviews(String(restaurant?.id));
        const data = JSON.parse(revs);
        setReviews(data);
      } catch (err: unknown) {
        setError((err as Error).message);
      }
    };
    fetchReviews();
  }, [restaurant]);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const totalScore = reviews.reduce(
          (sum: number, rev: RestaurantReview) => sum + rev.stars,
          0
        );
        if (reviews.length != 0) {
          setScore(parseFloat((totalScore / reviews.length).toFixed(2)));
        } else {
          setScore(0);
        }
      } catch (err: unknown) {
        setError((err as Error).message);
      }
    };
    fetchScore();
  }, [reviews]);
  if (error) return <div>Error: {error}</div>;

  if (loading)
    return (
      <div className={styles.loading}>
        <h1>Loading...</h1>
      </div>
    );

  const hours = [
    {
      day: "Pon",
      opening: restaurant?.openingTimeMon,
      closing: restaurant?.closingTimeMon,
    },
    {
      day: "Wt",
      opening: restaurant?.openingTimeTue,
      closing: restaurant?.closingTimeTue,
    },
    {
      day: "Śr",
      opening: restaurant?.openingTimeWen,
      closing: restaurant?.closingTimeWen,
    },
    {
      day: "Czw",
      opening: restaurant?.openingTimeThu,
      closing: restaurant?.closingTimeThu,
    },
    {
      day: "Pt",
      opening: restaurant?.openingTimeFri,
      closing: restaurant?.closingTimeFri,
    },
    {
      day: "Sob",
      opening: restaurant?.openingTimeSat,
      closing: restaurant?.closingTimeSat,
    },
    {
      day: "Nd",
      opening: restaurant?.openingTimeSun,
      closing: restaurant?.closingTimeSun,
    },
  ];

  console.log(hours);

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
              X_coord={Number(restaurant?.address?.xCoords)}
              Y_coord={Number(restaurant?.address?.yCoords)}
            ></MapView>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.rating}>
            <StarInput value={Number(score)} max={5} disabled></StarInput>
            <p>{String(score)}</p>
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
                  <div className={styles.openHours}>
                    <p>
                      <strong>{hour.day}:</strong>
                      &nbsp;
                      {parseTime(hour.opening)}-{parseTime(hour.closing)}
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
