"use client";

import useHasPermission from "@/hooks/use-has-permission";
import {
  addOrReplaceLikeForReview,
  getLikesSumByReviewId,
} from "@/lib/db/likes";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateReviewsUpdate } from "@/lib/store/reviews/reviews.slice";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { parseDate } from "@/utils/date-time";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewStore,
  ReviewType,
} from "@/utils/factories/reviews";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import TextArea from "../inputs/generic-textarea.component";
import SliderInput from "../inputs/slider-input.component";
import StarInput from "../inputs/star-input.component";
import Loader from "../misc/loader.component";
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
      mode: Mode,
      store: ReviewStore<Key>
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
    content: (data, mode, store) => (
      <>
        {mode === "view" ? (
          <p className={styles.content}>{data.content}</p>
        ) : (
          <form className={styles.form}>
            <div className={styles.left}>
              Zmień ocenę: &nbsp;
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
          </form>
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
    content: (data, mode, store) => (
      <>
        {mode === "view" ? (
          <p className={styles.content}>{data.content}</p>
        ) : (
          <form className={styles.form}>
            <div className={styles.left}>
              Zmień ocenę: &nbsp;
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
          </form>
        )}
      </>
    ),
  },
};

const ReviewCard = <Type extends keyof ReviewType>({
  type,
  data: dataI,
}: Props<Type>) => {
  const [data, setData] = useState(dataI);
  const [likes, setLikes] = useState<{ likes: number; dislikes: number }>({
    likes: 0,
    dislikes: 0,
  });
  const [loading, setLoading] = useState(false);
  const funcs = REVIEW_FUNCTIONS_FACTORY[type];
  const { author, createdDate, updatedDate } = data;
  const [mode, setMode] = useState<Mode>("view");
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const store = new ReviewStore(type);
  const { has: canEdit } = useHasPermission(user, "reviews", "edit", data);
  const { has: canDelete } = useHasPermission(user, "reviews", "delete", data);
  const { has: canHide } = useHasPermission(user, "reviews", "hide", data);
  const { has: canLike } = useHasPermission(user, "reviews", "like", data);

  const updateLikes = async () => {
    setLikes(
      (await getLikesSumByReviewId(data.id)) || {
        likes: 0,
        dislikes: 0,
      }
    );
  };

  useEffect(() => {
    updateLikes();
  }, []);

  const updateData = async () => {
    setLoading(true);
    const result = await funcs.getById(data.id);
    if (!result) {
      console.log("Something went very wrong");
      return;
    }
    setData(result);
    setLoading(false);
  };
  const startEditing = () => {
    store.getKeys().forEach((key) => {
      store.setState(key, data[key]);
    });
    setMode("edit");
  };
  const cancelEditing = () => {
    setMode("view");
  };
  const confirmEditing = async () => {
    setLoading(true);
    const newData = {
      ...data,
      ...store.getCreator(),
      subjectId: data.subjectId,
    };
    setData(newData); // optimistic editing
    setMode("view");
    await funcs.edit(newData);
    await updateData();
    setLoading(false);
  };
  const deleteReview = async () => {
    setLoading(true);
    await funcs.delete(data.id);
    dispatch(updateReviewsUpdate());
    setLoading(false);
  };
  const hideReview = async () => {
    setLoading(true);
    setData({ ...data, hidden: true });
    await funcs.hide(data.id, true);
    await updateData();
    setLoading(false);
  };
  const unhideReview = async () => {
    setLoading(true);
    setData({ ...data, hidden: false });
    await funcs.hide(data.id, false);
    await updateData();
    setLoading(false);
  };
  const likeReview = async () => {
    setLoading(true);
    await addOrReplaceLikeForReview(data.id, true);
    await updateLikes();
    setLoading(false);
  };
  const dislikeReview = async () => {
    setLoading(true);
    await addOrReplaceLikeForReview(data.id, false);
    await updateLikes();
    setLoading(false);
  };

  return (
    <div className={`${styles.container} ${data.hidden ? styles.hidden : ""}`}>
      <div className={styles.spaceBetween}>
        <div className={styles.stack}>
          {REVIEW_PARTS[type].header(data, mode)}
        </div>
        <div className={styles.stack}>
          <span className={styles.date}>
            {parseDate(createdDate)}
            {createdDate !== updatedDate && (
              <>
                <br />
                <span className={styles.updated}>
                  zmodyfikowano:&nbsp;{parseDate(updatedDate)}
                </span>
              </>
            )}
          </span>
          <Link
            href={`#`}
            className={`${styles.user} ${
              user?.id === author.id ? styles.highlighted : ""
            }`}
          >
            {author.name}
          </Link>
        </div>
      </div>
      <div className={styles.content}>
        {REVIEW_PARTS[type].content(data, mode, store)}
      </div>
      <div className={styles.buttons}>
        {mode === "view" ? (
          <>
            {canEdit && (
              <i
                className={`fa-solid fa-pen-to-square ${styles.edit}`}
                onClick={startEditing}
              ></i>
            )}
            {canHide && (
              <>
                {data.hidden ? (
                  <i
                    className={`fa-solid fa-eye ${styles.negative}`}
                    onClick={unhideReview}
                  ></i>
                ) : (
                  <i
                    className={`fa-solid fa-eye-slash ${styles.negative}`}
                    onClick={hideReview}
                  ></i>
                )}
              </>
            )}
            {canDelete && (
              <i
                className={`fa-solid fa-trash ${styles.negative}`}
                onClick={deleteReview}
              ></i>
            )}
          </>
        ) : (
          <>
            <i
              className={`fa-solid fa-xmark ${styles.negative}`}
              onClick={cancelEditing}
            ></i>
            <i
              className={`fa-solid fa-check ${styles.positive}`}
              onClick={confirmEditing}
            ></i>
          </>
        )}
        <div className={styles.expander}></div>
        <span>
          <i
            onClick={likeReview}
            className={`fa-solid fa-thumbs-up ${styles.positive}`}
          ></i>
          {likes.likes}
        </span>
        <span>
          <i
            onClick={dislikeReview}
            className={`fa-solid fa-thumbs-down ${styles.negative}`}
          ></i>
          {likes.dislikes}
        </span>
      </div>
      {loading && (
        <div className={styles.loading}>
          <Loader size="75px" />
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
