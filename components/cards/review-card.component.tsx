"use client";

import useHasPermission from "@/hooks/use-has-permission";
import useReviewStore from "@/hooks/use-review-store";
import { deleteReview, hideReview } from "@/lib/db/reviews/base-reviews";
import { addOrReplaceLikeForReview } from "@/lib/db/reviews/review-likes";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateReviewsUpdate } from "@/lib/store/reviews/reviews.slice";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { parseDate } from "@/utils/date-time";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import { makeRequest } from "@/utils/misc";
import Link from "next/link";
import { ReactNode, useState } from "react";
import AddReview from "../forms/add-review.component";
import ModalableImage from "../images/modalable-image.component";
import TextArea from "../inputs/generic-textarea.component";
import SliderInput from "../inputs/slider-input.component";
import StarInput from "../inputs/star-input.component";
import ReviewList from "../lists/review-list.component";
import LoaderBlur from "../misc/loader-blur.component";
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
      store: ReturnType<typeof useReviewStore<Key>>
    ) => ReactNode;
  };
};

const REVIEW_PARTS: ReviewParts = {
  restaurant: {
    header: (data, mode) => (
      <>
        <span className={styles.subject}>
          <i className="fa-solid fa-l"></i>&nbsp;
          <Link href={`/restaurant/${data.subject.slug}`}>
            <b>{data.subject.name}</b>
          </Link>
        </span>
        {mode === "view" && (
          <div className={styles.score}>
            <span
              className={styles.amountSpent}
            >{`Cena na osobę: ${data.amountSpent} zł`}</span>
            <StarInput value={data.stars} max={5} starSize={"12pt"} disabled />
          </div>
        )}
      </>
    ),
    content: (data, mode, store) => (
      <>
        {mode === "view" ? (
          <p>{data.censoredContent}</p>
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
        <span className={styles.subject}>
          <i className="fa-solid fa-l"></i>&nbsp;
          <Link href={`#`}>
            <b>{data.subject.name}</b>
          </Link>
        </span>
        {mode === "view" && (
          <div className={styles.score}>
            <StarInput value={data.stars} max={5} starSize={"12pt"} disabled />
          </div>
        )}
      </>
    ),
    content: (data, mode, store) => (
      <>
        {mode === "view" ? (
          <p>{data.censoredContent}</p>
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
  response: {
    header: (data, mode) => undefined,
    content: (data, mode, store) => (
      <>
        {mode === "view" ? (
          <p>{data.censoredContent}</p>
        ) : (
          <form className={styles.form}>
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
  const [loading, setLoading] = useState(false);
  const funcs = REVIEW_FUNCTIONS_FACTORY[type];
  const { author, createdDate, likes, dislikes, hidden } = data.baseData;
  const updatedDate = data.updatedDate;
  const [mode, setMode] = useState<Mode>("view");
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const size = useAppSelector(selectViewportWidth);
  const store = useReviewStore(type);
  const [showResponses, setShowResponses] = useState(false);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const { has: canEdit } = useHasPermission(
    user,
    "reviews",
    "edit",
    data.baseData
  );
  const { has: canDelete } = useHasPermission(
    user,
    "reviews",
    "delete",
    data.baseData
  );
  const { has: canHide } = useHasPermission(
    user,
    "reviews",
    "hide",
    data.baseData
  );
  const { has: canLike } = useHasPermission(
    user,
    "reviews",
    "like",
    data.baseData
  );

  const handleStartEditing = () => {
    store.getKeys().forEach((key) => {
      store.setState(key, data[key]);
    });
    setMode("edit");
  };
  const handleCancelEditing = () => {
    setMode("view");
  };

  const handleAndUpdate =
    (
      func: () => Promise<void>,
      update: boolean = true,
      successMessage?: string
    ) =>
    async () => {
      setLoading(true);
      try {
        await func();
        // updating data in review
        if (update) {
          const result = await makeRequest(funcs.getById, [data.id], dispatch);
          if (!result) {
            dispatch(addSnackbar({ message: "Wystąpił błąd", type: "error" }));
            console.log("Updated review could not be found in the db");
          } else setData(result);
        }
        if (successMessage)
          dispatch(addSnackbar({ message: successMessage, type: "success" }));
      } catch (error) {}
      setLoading(false);
    };

  const handleConfirmEditing = handleAndUpdate(async () => {
    const newData = {
      ...data,
      ...store.getCreator(),
      subjectId: data.subjectId,
    };
    setData(newData); // optimistic editing
    setMode("view");
    await makeRequest(funcs.edit, [newData], dispatch);
  });
  const handleDeleteReview = handleAndUpdate(
    async () => {
      await makeRequest(deleteReview, [data.id], dispatch);
      dispatch(updateReviewsUpdate());
    },
    false,
    "Usunięto"
  );
  const handleHideReview = handleAndUpdate(async () => {
    setData({ ...data, hidden: true });
    await makeRequest(hideReview, [data.id, true], dispatch);
  });
  const handleUnhideReview = handleAndUpdate(async () => {
    setData({ ...data, hidden: false });
    await makeRequest(hideReview, [data.id, false], dispatch);
  });
  const handleLikeReview = handleAndUpdate(async () => {
    await makeRequest(addOrReplaceLikeForReview, [data.id, true], dispatch);
  });
  const handleDislikeReview = handleAndUpdate(async () => {
    await makeRequest(addOrReplaceLikeForReview, [data.id, false], dispatch);
  });

  return (
    <>
      <div
        className={`${styles.container} ${hidden ? styles.hidden : ""} ${
          type === "response" ? styles.response : ""
        }`}
      >
        <div className={styles.header}>
          <Link
            href={`/profile/${author.id}`}
            className={`${styles.author} ${
              user?.id === author.id ? styles.highlighted : ""
            }`}
          >
            <i className="fa-solid fa-user"></i>
            {author.name}
          </Link>
          <div className={styles.authorPlaceholder} />
          {REVIEW_PARTS[type].header(data, mode)}
          <span className={styles.date}>
            {parseDate(createdDate)}
            {new Date(updatedDate).getTime() !==
              new Date(createdDate).getTime() && (
              <>
                <br />
                <span className={styles.updated}>
                  {size < 600 ? "edyt:" : "edytowano:"}
                  &nbsp;
                  {parseDate(updatedDate)}
                </span>
              </>
            )}
          </span>
        </div>
        <div className={styles.content}>
          {REVIEW_PARTS[type].content(data, mode, store)}
        </div>
        {mode === "view" && data.baseData.images.length > 0 && (
          <div className={styles.images}>
            {data.baseData.images.map((image, i) => (
              <ModalableImage
                key={i}
                src={image.path}
                width={50}
                height={50}
                alt={"zdjęcie"}
              />
            ))}
          </div>
        )}
        <div className={styles.buttons}>
          {mode === "view" ? (
            <>
              {canEdit && (
                <i
                  className={`fa-solid fa-pen-to-square ${styles.edit}`}
                  onClick={handleStartEditing}
                ></i>
              )}
              {canHide && (
                <>
                  {hidden ? (
                    <i
                      className={`fa-solid fa-eye ${styles.negative}`}
                      onClick={handleUnhideReview}
                    ></i>
                  ) : (
                    <i
                      className={`fa-solid fa-eye-slash ${styles.negative}`}
                      onClick={handleHideReview}
                    ></i>
                  )}
                </>
              )}
              {canDelete && (
                <i
                  className={`fa-solid fa-trash ${styles.negative}`}
                  onClick={handleDeleteReview}
                ></i>
              )}
            </>
          ) : (
            <>
              <i
                className={`fa-solid fa-xmark ${styles.negative}`}
                onClick={handleCancelEditing}
              ></i>
              <i
                className={`fa-solid fa-check ${styles.positive}`}
                onClick={handleConfirmEditing}
              ></i>
            </>
          )}
          <div className={styles.expander}></div>
          {type !== "response" && (
            <>
              {currentUser && (
                <i
                  className={`fa-solid fa-reply ${styles.information}`}
                  onClick={() => {
                    setShowRespondModal(true);
                    setShowResponses(true);
                  }}
                ></i>
              )}
              <i
                className={`fa-solid fa-comment-dots ${styles.information}`}
                onClick={() => setShowResponses(!showResponses)}
              >
                <span>{data.baseData.responsesAmount}</span>
              </i>
            </>
          )}

          <div className={styles.likes}>
            <i
              onClick={canLike ? handleLikeReview : undefined}
              className={`fa-solid fa-thumbs-up ${styles.positive}`}
            >
              <span>{likes}</span>
            </i>
            <i
              onClick={canLike ? handleDislikeReview : undefined}
              className={`fa-solid fa-thumbs-down ${styles.negative}`}
            >
              <span>{dislikes}</span>
            </i>
          </div>
        </div>
        {loading && <LoaderBlur />}
      </div>
      {type !== "response" && showResponses && (
        <ReviewList mode="responses" subjectId={data.baseData.id} />
      )}
      {showRespondModal && (
        <AddReview
          id={`add-response-${data.baseData.id}`}
          type="response"
          subjectId={data.baseData.id}
          modal
          onClick={(e) => {
            if (
              (e.target as HTMLElement).id ===
              `add-response-${data.baseData.id}`
            )
              setShowRespondModal(false);
          }}
          onSubmit={async () => {
            setShowRespondModal(false);
            await handleAndUpdate(async () => {})();
          }}
        />
      )}
    </>
  );
};

export default ReviewCard;
