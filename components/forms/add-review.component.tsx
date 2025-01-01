"use client";

import useReviewStore from "@/hooks/use-review-store";
import { createImages, deleteImages } from "@/lib/db/images";
import { linkImagesToReview } from "@/lib/db/reviews/base-reviews";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateReviewsUpdate } from "@/lib/store/reviews/reviews.slice";
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
import { signIn } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import Button from "../button/button.component";
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
};

type Fields = {
  [Key in keyof ReviewType]: {
    inputs: (store: ReturnType<typeof useReviewStore<Key>>) => ReactNode;
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
  const userLoading = useAppSelector(selectUserLoading);
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
    } catch (error) {
      dispatch(
        addSnackbar({ message: (error as Error).message, type: "error" })
      );
    }
    try {
    } catch (error) {}
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    dispatch(updateReviewsUpdate());
    setLoading(false);
  };

  return (
    <div id={id} className={styles.container}>
      <h2>
        Dodaj swoją opinię&nbsp;
        <span>{currentUser?.name}</span>
      </h2>
      <h3>{subject?.name}</h3>
      <form action={submit} className={styles.form}>
        {FIELDS[type].inputs(store)}
        <ImageInput
          label="Zdjęcia"
          multiple
          onChange={(v) => setFiles(v && Object.values(v))}
        />
        <div className={styles.right}>
          {!userLoading &&
            (currentUser ? (
              <Button type="submit">Prześlij</Button>
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
