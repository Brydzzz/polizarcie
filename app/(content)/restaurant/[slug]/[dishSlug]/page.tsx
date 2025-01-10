import StarInput from "@/components/inputs/star-input.component";
import ReviewList from "@/components/lists/review-list.component";
import { getDishBySlugs } from "@/lib/db/dishes";
import { getRestaurantBySlug } from "@/lib/db/restaurants";
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
  const restaurant = await getRestaurantBySlug(slug);
  const dish = await getDishBySlugs(slug, dishSlug);
  if (!restaurant || !dish) notFound();

  return (
    <div className={styles.container}>
      <h1>{dish.name}</h1>
      <span className={styles.rating}>
        <StarInput
          value={dish.averageStars || 0}
          max={5}
          starSize="24pt"
          disabled
        ></StarInput>
        <p>{dish.averageStars || 0}</p>
      </span>
      <div className={styles.data}>
        <h2>Opis:</h2>
        <p>{dish.description}</p>
      </div>
      <ReviewList mode="subject" type="dish" subjectId={dish.id}></ReviewList>
    </div>
  );
};

export default DishPage;
