"use client";

import useFreeReviewCreator from "@/hooks/use-free-review-creator";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setDishReviewCreator,
  setRestaurantReviewCreator,
  updateReviewsUpdate,
} from "@/lib/store/reviews/reviews.slice";
import { AppDispatch } from "@/lib/store/store";
import {
  selectCurrentUser,
  selectUserLoading,
} from "@/lib/store/user/user.selector";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import { transferWithJSON } from "@/utils/misc.client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import Button from "../button/button.component";
import TextArea from "../inputs/generic-textarea.component";
import SliderInput from "../inputs/slider-input.component";
import StarInput from "../inputs/star-input.component";
import styles from "./add-review.module.scss";

type Props<Type extends keyof ReviewType> = {
  id?: string;
  type: Type;
  subjectId: ReviewType[Type]["subject"]["id"];
};

type Fields = {
  [Key in keyof ReviewType]: {
    inputs: (
      creator: ReviewType[Key]["creatorData"],
      dispatch: AppDispatch
    ) => ReactNode;
  };
};

const FIELDS: Fields = {
  restaurant: {
    inputs: (creator, dispatch) => (
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
    ),
  },
  dish: {
    inputs: (creator, dispatch) => (
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
    ),
  },
};

const AddReview = <Type extends keyof ReviewType>({
  id,
  type,
  subjectId,
}: Props<Type>) => {
  const funcs = REVIEW_FUNCTIONS_FACTORY[type];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const creator = useAppSelector(funcs.selectCreator);
  const [subject, setSubject] = useState<
    ReviewType[Type]["subject"] | undefined
  >();
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
  const { freeForced, forceFree } = useFreeReviewCreator(type);

  useEffect(() => {
    const exec = async () => {
      const result = await funcs.getSubject(subjectId);
      setSubject(result || undefined);
    };
    exec();
  }, []);

  useEffect(() => {
    funcs.resetCreator();
  }, [freeForced]);

  const submit = async () => {
    await transferWithJSON(funcs.create, [
      { ...creator, subjectId: subjectId },
    ]);
    dispatch(updateReviewsUpdate());
    funcs.resetCreator();
  };

  return (
    <div id={id} className={styles.container}>
      <h2>{subject?.name}</h2>
      <h3>Dodaj swoją opinię</h3>
      <form action={submit} className={styles.form}>
        {FIELDS[type].inputs(creator, dispatch)}
        <div className={styles.right}>
          {!loading &&
            (currentUser ? (
              <Button type="submit">Prześlij</Button>
            ) : (
              <Button type="button" onClick={() => signIn()}>
                Zaloguj się aby przesłać
              </Button>
            ))}
        </div>
      </form>
    </div>
  );
};

export default AddReview;
