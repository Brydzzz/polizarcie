/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useAppSelector } from "@/lib/store/hooks";
import {
  selectCurrentUser,
  selectUserLoading,
} from "@/lib/store/user/user.selector";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import { transferWithJSON } from "@/utils/misc.client";
import {
  Dish,
  DishReview,
  Prisma,
  Restaurant,
  RestaurantReview,
} from "@prisma/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
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

abstract class Store<Type extends keyof ReviewType> {
  protected dict: Partial<{
    [Key in keyof ReviewType[Type]["data"]]: [
      value: ReviewType[Type]["data"][Key] | undefined,
      setter: Dispatch<
        SetStateAction<ReviewType[Type]["data"][Key] | undefined>
      >
    ];
  }> = {};

  getState<Key extends keyof ReviewType[Type]["data"]>(
    name: Key
  ): ReviewType[Type]["data"][Key] | undefined {
    return this.dict[name]?.[0];
  }
  setState<Key extends keyof ReviewType[Type]["data"]>(
    name: Key,
    value: ReviewType[Type]["data"][Key]
  ) {
    this.dict[name]?.[1](value);
  }

  getReviewObjBase() {
    return {
      id: "does not matter v",
      createdDate: new Date(),
      updatedDate: new Date(),
      hidden: false,
      authorId: "still does not matter",
    };
  }

  abstract getReviewObj(
    subjectId: ReviewType[Type]["subject"]["id"]
  ): ReviewType[Type]["data"];
}

type Customs = {
  [Key in keyof ReviewType]: {
    store: () => Store<Key>;
    inputs: (store: Store<Key>) => ReactNode;
  };
};

const AddReview = <Type extends keyof ReviewType>({
  id,
  type,
  subjectId,
}: Props<Type>) => {
  const CUSTOMS: Customs = {
    restaurant: {
      store: () =>
        new (class RestaurantStore extends Store<"restaurant"> {
          constructor() {
            super();
            this.dict.content = useState();
            this.dict.stars = useState();
            this.dict.amountSpent = useState();
          }

          getReviewObj(subjectId: Restaurant["id"]): RestaurantReview {
            return {
              restaurantId: subjectId,
              content: this.dict.content?.[0] || "",
              stars: this.dict.stars?.[0] || 0,
              amountSpent: this.dict.amountSpent?.[0] || new Prisma.Decimal(0),
              ...this.getReviewObjBase(),
            };
          }
        })(),
      inputs: (store) => (
        <>
          <div className={styles.left}>
            Ocena: &nbsp;
            <StarInput
              max={5}
              value={store.getState("stars") || 0}
              onChange={(v) => store.setState("stars", v)}
            />
          </div>
          <SliderInput
            label="Cena na osobę"
            limit={{ min: 0, max: 100 }}
            value={store.getState("amountSpent")?.toNumber() || 0}
            onChange={(v) =>
              store.setState("amountSpent", new Prisma.Decimal(v))
            }
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
      store: () =>
        new (class DishStore extends Store<"dish"> {
          constructor() {
            super();
            this.dict.content = useState();
            this.dict.stars = useState();
          }

          getReviewObj(subjectId: Dish["id"]): DishReview {
            return {
              dishId: subjectId,
              content: this.dict.content?.[0] || "",
              stars: this.dict.stars?.[0] || 0,
              ...this.getReviewObjBase(),
            };
          }
        })(),
      inputs: () => <></>,
    },
  };

  const factory = REVIEW_FUNCTIONS_FACTORY[type];
  const [subject, setSubject] = useState<
    ReviewType[Type]["subject"] | undefined
  >();
  const store = CUSTOMS[type].store();
  const router = useRouter();
  const currentUser = useAppSelector(selectCurrentUser);
  const loading = useAppSelector(selectUserLoading);

  useEffect(() => {
    const exec = async () => {
      const result = await factory.getSubject(subjectId);
      setSubject(result || undefined);
    };
    exec();
  }, []);

  const submit = async () => {
    await transferWithJSON(factory.create, [store.getReviewObj(subjectId)]);
    router.refresh();
  };

  return (
    <div id={id} className={styles.container}>
      <h2>{subject?.name}</h2>
      <h3>Dodaj swoją opinię</h3>
      <form action={submit} className={styles.form}>
        {CUSTOMS[type].inputs(store)}
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
