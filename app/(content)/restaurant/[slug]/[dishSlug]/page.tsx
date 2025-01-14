import StarInput from "@/components/inputs/star-input.component";
import ReviewList from "@/components/lists/review-list.component";
import { getDishBySlugs } from "@/lib/db/dishes";
import { getRestaurantById, getRestaurantBySlug } from "@/lib/db/restaurants";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";

type Props = {
  params: Promise<{
    slug: string;
    dishSlug: string;
  }>;
};

const DishPage = async ({ params }: Props) => {
  const slug = (await params).slug;
  const dishSlug = (await params).dishSlug;
  const restaurant =
    (await getRestaurantBySlug(slug)) || (await getRestaurantById(slug));
  if (!restaurant) notFound();
  const dish = await getDishBySlugs(restaurant.slug, dishSlug);
  if (!dish) notFound();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={`/restaurant/${restaurant.slug}`}>
          <i className="fa-solid fa-arrow-left"></i>
          <h2>{restaurant.name}</h2>
        </Link>
        <h1>{dish.name}</h1>
        <p>Średnia ocena:</p>
        <span className={styles.rating}>
          <StarInput
            value={dish.averageStars || 0}
            max={5}
            starSize="20pt"
            disabled
          />
          <p>({dish.averageStars?.toFixed(2) || 0})</p>
        </span>
      </header>
      <div className={styles.data}>
        <h2>Opis:</h2>
        <p>{dish.description}</p>
      </div>
      <ReviewList mode="subject" type="dish" subjectId={dish.id}></ReviewList>
    </div>
  );
};

export default DishPage;
