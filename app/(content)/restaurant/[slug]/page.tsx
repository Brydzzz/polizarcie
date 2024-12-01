import Button from "@/components/button/button.component";
import StarInput from "@/components/inputs/star-input.component";
import ReviewList from "@/components/lists/review-list.component";
import MapView from "@/components/map-view.component";
import { parseTime } from "@/utils/date-time";
import { getRestaurantBySlug } from "@/utils/db/restaurants";
import { getRestaurantAvgStarsById } from "@/utils/db/reviews";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";

type Props = {
  params: {
    slug: string;
  };
};

const RestaurantPage = async ({ params }: Props) => {
  const slug = params.slug;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();
  const score = await getRestaurantAvgStarsById(restaurant.id);
  const roundedScore = score._avg.stars?.toFixed(2);

  const hours = [
    {
      day: "Pon",
      opening: restaurant.openingTimeMon,
      closing: restaurant.closingTimeMon,
    },
    {
      day: "Wt",
      opening: restaurant.openingTimeTue,
      closing: restaurant.closingTimeTue,
    },
    {
      day: "Śr",
      opening: restaurant.openingTimeWen,
      closing: restaurant.closingTimeWen,
    },
    {
      day: "Czw",
      opening: restaurant.openingTimeThu,
      closing: restaurant.closingTimeThu,
    },
    {
      day: "Pt",
      opening: restaurant.openingTimeFri,
      closing: restaurant.closingTimeFri,
    },
    {
      day: "Sob",
      opening: restaurant.openingTimeSat,
      closing: restaurant.closingTimeSat,
    },
    {
      day: "Nd",
      opening: restaurant.openingTimeSun,
      closing: restaurant.closingTimeSun,
    },
  ];

  return (
    <main className={styles.restaurantPage}>
      <div className={styles.header}>
        <p>{restaurant.name}</p>
        {/* TODO: heart input for adding to favorite restaurants */}
        <span>
          <i className="fa-regular fa-heart fa-2x"></i>
        </span>
      </div>
      <div className={styles.content}>
        <div className={styles.column}>
          <div className={styles.mapContainer}>
            <MapView
              X_coord={Number(restaurant.address?.xCoords)}
              Y_coord={Number(restaurant.address?.yCoords)}
            ></MapView>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.rating}>
            <StarInput
              value={score._avg.stars || 0}
              max={5}
              disabled
            ></StarInput>
            <p>{roundedScore || 0}</p>
          </div>
          <div className={styles.info}>
            <h3>Adres:</h3>
            <p>{restaurant.address?.name}</p>
            <h3>Opis:</h3>
            <p>{restaurant.description}</p>
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
          <Link href="#AddReviewSection" scroll={true}>
            <Button>
              <i className="fa-solid fa-pen-to-square"></i>&nbsp; Napisz Opinię
            </Button>
          </Link>
        </div>
      </div>
      {restaurant.id && (
        <ReviewList type="restaurant" subjectId={restaurant.id} />
      )}
    </main>
  );
};

export default RestaurantPage;
