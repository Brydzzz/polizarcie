"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { selectReviewsUpdate } from "@/lib/store/reviews/reviews.selector";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import { User } from "@prisma/client";
import { ReactNode, useEffect, useState } from "react";
import Button from "../button/button.component";
import { ButtonSize, ButtonStyle } from "../button/button.types";
import ReviewCard from "../cards/review-card.component";
import AddReview from "../forms/add-review.component";
import Loader from "../misc/loader.component";
import styles from "./review-list.module.scss";

type SubjectsProps<Type extends keyof ReviewType> = {
  type: Type;
  subjectId: ReviewType[Type]["subject"]["id"];
};

const SubjectsReviewList = <Type extends keyof ReviewType>({
  type,
  subjectId,
}: SubjectsProps<Type>) => {
  const amountPerFetch = 10;
  const [amount, setAmount] = useState(amountPerFetch);
  const [morePossible, setMorePossible] = useState(true);
  const funcs = REVIEW_FUNCTIONS_FACTORY[type];
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<
    ReviewType[Type]["fullData"][] | undefined
  >();
  const update = useAppSelector(selectReviewsUpdate);

  useEffect(() => {
    const exec = async () => {
      setLoading(true);
      const result = await funcs.getBySubjectId(subjectId, amountPerFetch);
      if (result.length < amountPerFetch) setMorePossible(false);
      setReviews(result || undefined);
      setLoading(false);
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
      {loading ? <Loader /> : morePossible && <Button>Załaduj więcej</Button>}
      <AddReview id="AddReviewSection" type={type} subjectId={subjectId} />
    </div>
  );
};

type AuthorsProps<Type extends keyof ReviewType> = {
  type: Type;
  authorId: User["id"];
};

const AuthorsReviewList = <Type extends keyof ReviewType>({
  type,
  authorId,
}: AuthorsProps<Type>) => {
  const funcs = REVIEW_FUNCTIONS_FACTORY[type];
  const [reviews, setReviews] = useState<
    ReviewType[Type]["fullData"][] | undefined
  >();
  const update = useAppSelector(selectReviewsUpdate);

  useEffect(() => {
    const exec = async () => {
      const result = await funcs.getByAuthorId(authorId, 10);
      setReviews(result || undefined);
    };
    exec();
  }, [update]);

  return (
    <div className={styles.container}>
      {reviews?.length === 0 && <p>Brak opinii z tej kategorii</p>}
      {reviews?.map((review) => (
        <ReviewCard key={review.id} type={type} data={review} />
      ))}
    </div>
  );
};

type AuthorAllProps = { authorId: User["id"] };

// TODO maybe remove this and do it better
const TYPE_TRANSLATION: {
  [Key in keyof ReviewType]: string;
} = {
  restaurant: "Restauracje",
  dish: "Dania",
};

const AuthorsAllReviewList = ({ authorId }: AuthorAllProps) => {
  const [view, setView] = useState<keyof ReviewType>("restaurant");

  const changeView = (value: keyof ReviewType) => {
    setView(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.changeSection}>
        {Object.keys(REVIEW_FUNCTIONS_FACTORY).map((key) => {
          const keyHelper = key as keyof ReviewType;
          return (
            <Button
              key={key}
              style={
                view === keyHelper ? ButtonStyle.SOLID : ButtonStyle.BACKDROP
              }
              size={ButtonSize.LARGE}
              onClick={() => changeView(keyHelper)}
            >
              {TYPE_TRANSLATION[keyHelper]}
            </Button>
          );
        })}
      </div>
      {Object.keys(REVIEW_FUNCTIONS_FACTORY)
        .filter((key) => key === view)
        .map((key) => {
          const keyHelper = key as keyof ReviewType;
          return (
            <AuthorsReviewList key={key} type={keyHelper} authorId={authorId} />
          );
        })}
    </div>
  );
};

type ListMode = {
  author: AuthorAllProps;
  subject: SubjectsProps<keyof ReviewType>;
};

const LIST_NODE: {
  [Key in keyof ListMode]: (props: ListMode[Key]) => ReactNode;
} = {
  author: AuthorsAllReviewList,
  subject: SubjectsReviewList,
};

type Props<Mode extends keyof ListMode> = { mode: Mode } & ListMode[Mode];

const ReviewList = <Mode extends keyof ListMode>(props: Props<Mode>) => {
  return LIST_NODE[props.mode]({ ...props, mode: undefined });
};

export default ReviewList;
