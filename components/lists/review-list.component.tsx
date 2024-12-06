"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { selectReviewsUpdate } from "@/lib/store/reviews/reviews.selector";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import { useEffect, useState } from "react";
import ReviewCard from "../cards/review-card.component";
import AddReview from "../forms/add-review.component";
import styles from "./review-list.module.scss";

type Props<Type extends keyof ReviewType> = {
  type: Type;
  subjectId: ReviewType[Type]["subject"]["id"];
};

const ReviewList = <Type extends keyof ReviewType>({
  type,
  subjectId,
}: Props<Type>) => {
  const funcs = REVIEW_FUNCTIONS_FACTORY[type];
  const [reviews, setReviews] = useState<
    ReviewType[Type]["fullData"][] | undefined
  >();
  const update = useAppSelector(selectReviewsUpdate);

  useEffect(() => {
    const exec = async () => {
      const result = await funcs.getBySubjectId(subjectId, 10);
      setReviews(result || undefined);
    };
    exec();
  }, [update]);

  return (
    <div className={styles.container}>
      {reviews?.length === 0 && (
        <p>Nikt nie wystawił jeszcze opinii, bądź pierwszy!</p>
      )}
      {reviews?.map((review) => (
        <ReviewCard key={review.id} type={type} data={review} />
      ))}
      <AddReview id="AddReviewSection" type={type} subjectId={subjectId} />
    </div>
  );
};

export default ReviewList;
