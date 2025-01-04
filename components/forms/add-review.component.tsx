"use client";

import useReviewStore from "@/hooks/use-review-store";
import { createImages, deleteImages } from "@/lib/db/images";
import { linkImagesToReview } from "@/lib/db/reviews/base-reviews";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateReviewsUpdate } from "@/lib/store/reviews/reviews.slice";
import { selectViewportWidth } from "@/lib/store/ui/ui.selector";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import {
  selectCurrentUser,
  selectUserLoading,
} from "@/lib/store/user/user.selector";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import { transferWithJSON } from "@/utils/misc";
import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import Button from "../button/button.component";
import { ButtonSize } from "../button/button.types";
import TextArea from "../inputs/generic-textarea.component";
import ImageInput from "../inputs/image-input.component";
import SliderInput from "../inputs/slider-input.component";
import StarInput from "../inputs/star-input.component";
import LoaderBlur from "../misc/loader-blur.component";
import styles from "./add-review.module.scss";

type Props<Type extends keyof ReviewType> = {
  id?: string;
  type: Type;
  subjectId: ReviewType[Type]["subject"]["id"];
  modal?: boolean;
  onClick?: MouseEventHandler;
  onSubmit?: () => void;
};

type Fields = {
  [Key in keyof ReviewType]: {
    header: (
      currentUser: User | undefined,
      subject: ReviewType[Key]["subject"] | undefined
    ) => ReactNode;
    inputs: (store: ReturnType<typeof useReviewStore<Key>>) => ReactNode;
  };
};

const PARTS: Fields = {
  restaurant: {
    header: (currentUser, subject) => (
      <>
        <h2>
          Dodaj swoją opinię&nbsp;
          <span>{currentUser?.name}</span>
        </h2>
        <h3>{subject?.name}</h3>
      </>
    ),
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
    header: (currentUser, subject) => (
      <>
        <h2>
          Dodaj swoją opinię&nbsp;
          <span>{currentUser?.name}</span>
        </h2>
        <h3>{subject?.name}</h3>
      </>
    ),
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
  response: {
    header: (currentUser, subject) => (
      <h3>Odpowiedz&nbsp;{subject?.author.name}</h3>
    ),
    inputs: (store) => (
      <>
        <TextArea
          label="Odpowiedź"
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
  modal,
  onClick,
  onSubmit,
}: Props<Type>) => {
  const funcs = REVIEW_FUNCTIONS_FACTORY[type];
  const dispatch = useAppDispatch();
  const [subject, setSubject] = useState<
    ReviewType[Type]["subject"] | undefined
  >();
  const currentUser = useAppSelector(selectCurrentUser);
  const userLoading = useAppSelector(selectUserLoading);
  const size = useAppSelector(selectViewportWidth);
  const store = useReviewStore(type);
  const [files, setFiles] = useState<File[] | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const exec = async () => {
      const result = await funcs.getSubject(subjectId);
      setSubject(result || undefined);
    };
    exec();
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      let imagesPaths: string[] = [];
      if (files) {
        imagesPaths = await createImages(
          files.map((file) => ({
            info: {
              path: `reviews/${subjectId}.${file.name.split(".").pop()}`,
              title: `${subjectId}`,
            },
            imageBody: file,
          }))
        );
      }
      const result = await transferWithJSON(funcs.create, [
        { ...store.getCreator(), subjectId: subjectId },
      ]);
      if (!result) {
        if (files) await deleteImages(imagesPaths);
        throw new Error("Wystąpił błąd");
      }
      if (files) {
        await linkImagesToReview(result.id, imagesPaths);
      }
      dispatch(addSnackbar({ message: "Dodano opinię", type: "success" }));
      store.reset();
      if (onSubmit) onSubmit();
    } catch (error) {
      dispatch(
        addSnackbar({ message: (error as Error).message, type: "error" })
      );
    }
    try {
    } catch (error) {}
    dispatch(updateReviewsUpdate());
    setLoading(false);
  };

  return (
    <div
      id={id}
      className={`${styles.container} ${modal ? styles.modal : ""}`}
      onClick={onClick}
    >
      {PARTS[type].header(currentUser, subject)}
      <form action={submit} className={styles.form}>
        {PARTS[type].inputs(store)}
        <ImageInput
          label="Zdjęcia"
          multiple
          onChange={(v) => setFiles(v && Object.values(v))}
        />
        <div className={styles.right}>
          {!userLoading &&
            (currentUser ? (
              <Button
                type="submit"
                size={size < 450 ? ButtonSize.SMALL : ButtonSize.NORMAL}
              >
                Prześlij
              </Button>
            ) : (
              <Button type="button" onClick={() => signIn()}>
                Zaloguj się aby przesłać
              </Button>
            ))}
        </div>
      </form>
      {loading && <LoaderBlur />}
    </div>
  );
};

export default AddReview;
