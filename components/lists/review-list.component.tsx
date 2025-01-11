"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { selectReviewsUpdate } from "@/lib/store/reviews/reviews.selector";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import { BaseReview, User } from "@prisma/client";
import { ReactNode, useEffect, useRef, useState } from "react";
import Button from "../button/button.component";
import { ButtonSize, ButtonStyle } from "../button/button.types";
import ReviewCard from "../cards/review-card.component";
import AddReview from "../forms/add-review.component";
import Loader from "../misc/loader.component";
import styles from "./review-list.module.scss";

type ListMode = {
  author: AuthorsProps;
  subject: Omit<ModeListProps<keyof ReviewType>, "mode" | "modeSpecificId"> & {
    subjectId: string;
  };
  responses: { subjectId: BaseReview["id"] };
};

type ModeListProps<Type extends keyof ReviewType> = {
  mode: keyof ListMode;
  type: Type;
  modeSpecificId: ReviewType[Type]["subject"]["id"];
};

const ModeReviewList = <Type extends keyof ReviewType>({
  mode,
  type,
  modeSpecificId,
}: ModeListProps<Type>) => {
  const amountPerFetch = 10;
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
      if (mode === "subject") {
        const result = await funcs.getBySubjectId(
          modeSpecificId,
          amountPerFetch
        );
        if (result.length < amountPerFetch) setMorePossible(false);
        setReviews(result);
      } else {
        const result = await funcs.getByAuthorId(
          modeSpecificId,
          amountPerFetch
        );
        if (result.length < amountPerFetch) setMorePossible(false);
        setReviews(result);
      }
      setLoading(false);
    };
    exec();
  }, [update]);

  const loadMore = () => {
    const exec = async () => {
      setLoading(true);
      if (mode === "subject") {
        const result = await funcs.getBySubjectId(
          modeSpecificId,
          amountPerFetch,
          reviews?.length
        );
        if (result.length < amountPerFetch) setMorePossible(false);
        setReviews(reviews?.concat(result));
      } else {
        const result = await funcs.getByAuthorId(
          modeSpecificId,
          amountPerFetch,
          reviews?.length
        );
        if (result.length < amountPerFetch) setMorePossible(false);
        setReviews(reviews?.concat(result));
      }
      setLoading(false);
    };
    exec();
  };

  return (
    <div className={styles.container}>
      {reviews?.length === 0 && (
        <p>
          {mode === "subject"
            ? "Nikt nie wystawił jeszcze opinii, bądź pierwszy!"
            : "Brak opinii w tej kategorii."}
        </p>
      )}
      {reviews?.map((review) => (
        <ReviewCard key={review.id} type={type} data={review} />
      ))}
      {loading ? (
        <Loader />
      ) : (
        morePossible && (
          <Button onClick={loadMore} size={ButtonSize.SMALL}>
            Załaduj więcej
          </Button>
        )
      )}
      {mode === "subject" && (
        <AddReview
          id="AddReviewSection"
          type={type}
          subjectId={modeSpecificId}
        />
      )}
    </div>
  );
};

// TODO maybe remove this and do it better
const TYPE_TRANSLATION: {
  [Key in keyof ReviewType]: string;
} = {
  restaurant: "Restauracje",
  dish: "Dania",
  response: "Odpowiedzi",
};

type AuthorsProps = { authorId: User["id"] };

const AuthorsReviewList = ({ authorId }: AuthorsProps) => {
  const [view, setView] = useState<keyof ReviewType>("restaurant");
  const sectionRef = useRef<HTMLDivElement>(null);

  const changeView = (value: keyof ReviewType) => {
    setView(value);
    const headerHeight = 280;
    const offset = (sectionRef.current?.offsetTop || 0) - headerHeight;
    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
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
            <div ref={sectionRef} key={key}>
              <ModeReviewList
                key={key}
                mode="author"
                type={keyHelper}
                modeSpecificId={authorId}
              />
            </div>
          );
        })}
    </div>
  );
};

const ResponsesReviewList = ({ subjectId }: { subjectId: string }) => {
  const amountPerFetch = 10;
  const [morePossible, setMorePossible] = useState(true);
  const funcs = REVIEW_FUNCTIONS_FACTORY["response"];
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<
    ReviewType["response"]["fullData"][] | undefined
  >();
  const update = useAppSelector(selectReviewsUpdate);

  useEffect(() => {
    const exec = async () => {
      setLoading(true);
      const result = await funcs.getBySubjectId(subjectId, amountPerFetch);
      if (result.length < amountPerFetch) setMorePossible(false);
      setReviews(result);
      setLoading(false);
    };
    exec();
  }, [update]);

  const loadMore = () => {
    const exec = async () => {
      setLoading(true);
      const result = await funcs.getBySubjectId(
        subjectId,
        amountPerFetch,
        reviews?.length
      );
      if (result.length < amountPerFetch) setMorePossible(false);
      setReviews(reviews?.concat(result));
      setLoading(false);
    };
    exec();
  };

  return (
    <div className={styles.container}>
      {reviews?.length === 0 && <p>Brak odpowiedzi</p>}
      {reviews?.map((review) => (
        <ReviewCard key={review.id} type="response" data={review} />
      ))}
      {loading ? (
        <Loader />
      ) : (
        morePossible && (
          <Button onClick={loadMore} size={ButtonSize.SMALL}>
            Załaduj więcej
          </Button>
        )
      )}
    </div>
  );
};

const LIST_NODE: {
  [Key in keyof ListMode]: (props: ListMode[Key]) => ReactNode;
} = {
  author: AuthorsReviewList,
  subject: <Type extends keyof ReviewType>(
    props: Omit<ModeListProps<Type>, "mode" | "modeSpecificId"> & {
      subjectId: string;
    }
  ) =>
    ModeReviewList<Type>({
      ...props,
      mode: "subject",
      modeSpecificId: props.subjectId,
    }),
  responses: ResponsesReviewList,
};

type Props<Mode extends keyof ListMode> = { mode: Mode } & ListMode[Mode];

const ReviewList = <Mode extends keyof ListMode>(props: Props<Mode>) => {
  return LIST_NODE[props.mode]({ ...props, mode: undefined });
};

export default ReviewList;
