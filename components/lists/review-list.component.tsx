import { REVIEW_FACTORY, ReviewType } from "@/utils/factories/reviews";
import ReviewCard from "../cards/review-card.component";
import AddReview from "../forms/add-review.component";
import styles from "./review-list.module.scss";

type Props<Type extends keyof ReviewType> = {
  type: Type;
  subjectId: ReviewType[Type]["subject"]["id"];
};

const ReviewList = async <Type extends keyof ReviewType>({
  type,
  subjectId,
}: Props<Type>) => {
  const factory = REVIEW_FACTORY[type];
  const reviews = await factory.getBySubjectId(subjectId);

  return (
    <div className={styles.container}>
      <h1>Opinie:</h1>
      {reviews.length === 0 && (
        <p>Nikt nie wystawił jeszcze opinii, bądź pierwszy!</p>
      )}
      {reviews.map((review) => (
        <ReviewCard key={review.id} type={type} data={review} />
      ))}
      <AddReview id="AddReviewSection" type={type} subjectId={subjectId} />
    </div>
  );
};

export default ReviewList;
