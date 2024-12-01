"use client";

import useFreeReviewCreator from "@/hooks/use-free-review-creator";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setDishReviewCreator,
  setRestaurantReviewCreator,
} from "@/lib/store/reviews/reviews.slice";
import { AppDispatch } from "@/lib/store/store";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { parseDate } from "@/utils/date-time";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import Button from "../button/button.component";
import TextArea from "../inputs/generic-textarea.component";
import SliderInput from "../inputs/slider-input.component";
import StarInput from "../inputs/star-input.component";
import styles from "./review-card.module.scss";

type Props<Type extends keyof ReviewType> = {
  type: Type;
  data: ReviewType[Type]["fullData"];
};

type Mode = "view" | "edit";

type ReviewParts = {
  [Key in keyof ReviewType]: {
    header: (data: ReviewType[Key]["fullData"], mode: Mode) => ReactNode;
    content: (
      data: ReviewType[Key]["fullData"],
      creator: ReviewType[Key]["creatorData"],
      dispatch: AppDispatch,
      mode: Mode
    ) => ReactNode;
  };
};

const REVIEW_PARTS: ReviewParts = {
  restaurant: {
    header: (data, mode) => (
      <>
        <Link
          href={`/restaurant/${data.subject.slug}`}
          className={styles.title}
        >
          {data.subject.name}
        </Link>
        {mode === "view" && (
          <>
            <StarInput value={data.stars} max={5} starSize={"18pt"} disabled />
            <span
              className={styles.amountSpent}
            >{`Cena na osobę: ${data.amountSpent} zł`}</span>
          </>
        )}
      </>
    ),
    content: (data, creator, dispatch, mode) => (
      <>
        {mode === "view" ? (
          <p className={styles.content}>{data.content}</p>
        ) : (
          <>
            <div className={styles.left}>
              Ocena: &nbsp;
              <StarInput
                max={5}
                value={creator.stars}
                onChange={(v) =>
                  dispatch(setRestaurantReviewCreator({ ...creator, stars: v }))
                }
              />
            </div>
            <SliderInput
              label="Cena na osobę"
              limit={{ min: 0, max: 100 }}
              value={creator.amountSpent}
              onChange={(v) =>
                dispatch(
                  setRestaurantReviewCreator({
                    ...creator,
                    amountSpent: v,
                  })
                )
              }
            />
            <TextArea
              label="Opis"
              value={creator.content}
              onChange={(e) =>
                dispatch(
                  setRestaurantReviewCreator({
                    ...creator,
                    content: e.target.value,
                  })
                )
              }
            />
          </>
        )}
      </>
    ),
  },
  dish: {
    header: (data, mode) => (
      <>
        <Link href={`#`} className={styles.title}>
          {data.subject.name}
        </Link>
        {mode === "view" && (
          <StarInput value={data.stars} max={5} starSize={"18pt"} disabled />
        )}
      </>
    ),
    content: (data, creator, dispatch, mode) => (
      <>
        {mode === "view" ? (
          <p className={styles.content}>{data.content}</p>
        ) : (
          <>
            <div className={styles.left}>
              Ocena: &nbsp;
              <StarInput
                max={5}
                value={creator.stars}
                onChange={(v) =>
                  dispatch(setDishReviewCreator({ ...creator, stars: v }))
                }
              />
            </div>
            <TextArea
              label="Opis"
              value={creator.content}
              onChange={(e) =>
                dispatch(
                  setDishReviewCreator({
                    ...creator,
                    content: e.target.value,
                  })
                )
              }
            />
          </>
        )}
      </>
    ),
  },
};

const ReviewCard = <Type extends keyof ReviewType>({
  type,
  data,
}: Props<Type>) => {
  const { author, createdDate } = data;
  const currentUser = useAppSelector(selectCurrentUser);
  const funcs = REVIEW_FUNCTIONS_FACTORY[type];
  const dispatch = useAppDispatch();
  const creator = useAppSelector(funcs.selectCreator);
  const [mode, setMode] = useState<Mode>("view");
  const { freeForced, forceFree } = useFreeReviewCreator(type);

  useEffect(() => {
    setMode("view");
    funcs.resetCreator();
  }, [freeForced]);

  const startEditing = () => {
    forceFree();
    setMode("edit");
  };

  return (
    <div className={styles.container}>
      <div className={styles.spaceBetween}>
        <div className={styles.stack}>
          {REVIEW_PARTS[type].header(data, mode)}
        </div>
        <div className={styles.stack}>
          <span className={styles.date}>{parseDate(createdDate)}</span>
          <Link
            href={`#`}
            className={`${styles.user} ${
              currentUser?.id === author.id ? styles.highlighted : ""
            }`}
          >
            {author.name}
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        {REVIEW_PARTS[type].content(data, creator, dispatch, mode)}
      </div>
      <div className={styles.buttons}>
        <Button onClick={startEditing}>edit</Button>
      </div>
    </div>
  );
};

export default ReviewCard;
