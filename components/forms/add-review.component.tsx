"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateReviewsUpdate } from "@/lib/store/reviews/reviews.slice";
import {
  selectCurrentUser,
  selectUserLoading,
} from "@/lib/store/user/user.selector";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewStore,
  ReviewType,
} from "@/utils/factories/reviews";
import { transferWithJSON } from "@/utils/misc.client";
import { signIn } from "next-auth/react";
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
    inputs: (store: ReviewStore<Key>) => ReactNode;
  };
};

const FIELDS: Fields = {
  restaurant: {
    inputs: (store) => (
      <>
        <div className={styles.left}>
          Ocena: &nbsp;
          <StarInput
            max={5}
            value={store.getState("stars")}
            onChange={(v) => store.setState("stars", v)}
          />
        </div>
        <SliderInput
          label="Cena na osobę"
          limit={{ min: 0, max: 100 }}
          value={store.getState("amountSpent")}
          onChange={(v) => store.setState("amountSpent", v)}
        />
        <TextArea
          label="Opis"
          value={store.getState("content")}
          onChange={(e) => store.setState("content", e.target.value)}
        />
      </>
    ),
  },
  dish: {
    inputs: (store) => (
      <>
        <div className={styles.left}>
          Ocena: &nbsp;
          <StarInput
            max={5}
            value={store.getState("stars")}
            onChange={(v) => store.setState("stars", v)}
          />
        </div>
        <TextArea
          label="Opis"
          value={store.getState("content")}
          onChange={(e) => store.setState("content", e.target.value)}
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
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState<
    ReviewType[Type]["subject"] | undefined
  >();
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);
  const store = new ReviewStore(type);

  useEffect(() => {
    const exec = async () => {
      const result = await funcs.getSubject(subjectId);
      setSubject(result || undefined);
    };
    exec();
  }, []);

  const submit = async () => {
    await transferWithJSON(funcs.create, [
      { ...store.getCreator(), subjectId: subjectId },
    ]);
    dispatch(updateReviewsUpdate());
  };

  return (
    <div id={id} className={styles.container}>
      <h2>{subject?.name}</h2>
      <h3>Dodaj swoją opinię</h3>
      <form action={submit} className={styles.form}>
        {FIELDS[type].inputs(store)}
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
