import { getUserById } from "@/lib/db/users";
import { parseDate } from "@/utils/date-time";
import {
  REVIEW_FUNCTIONS_FACTORY,
  ReviewType,
} from "@/utils/factories/reviews";
import { getCurrentUser } from "@/utils/users";
import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";
import StarInput from "../inputs/star-input.component";
import styles from "./review-card.module.scss";

type Props<Type extends keyof ReviewType> = {
  type: Type;
  data: ReviewType[Type]["data"];
};

type ReviewParts = {
  [Key in keyof ReviewType]: {
    header: (
      data: ReviewType[Key]["data"],
      subject: ReviewType[Key]["subject"] | null,
      onClickSubject?: MouseEventHandler
    ) => ReactNode;
  };
};

const REVIEW_PARTS: ReviewParts = {
  restaurant: {
    header: (data, subject, onClickSubject) => (
      <>
        <Link
          href={`/restaurant/${subject?.slug}`}
          className={styles.title}
          onClick={onClickSubject}
        >
          {subject?.name}
        </Link>
        <StarInput value={data.stars} max={5} starSize={"18pt"} disabled />
        <span
          className={styles.amountSpent}
        >{`Cena na osobę: ${data.amountSpent} zł`}</span>
      </>
    ),
  },
  dish: {
    header: (data, subject, onClickSubject) => (
      <>
        <Link href={`#`} className={styles.title} onClick={onClickSubject}>
          {subject?.name}
        </Link>
        <StarInput value={data.stars} max={5} starSize={"18pt"} disabled />
      </>
    ),
  },
};

const ReviewCard = async <Type extends keyof ReviewType>({
  type,
  data,
}: Props<Type>) => {
  const { authorId, content, createdDate } = data;
  const author = await getUserById(authorId);
  const factory = REVIEW_FUNCTIONS_FACTORY[type];
  const subject = await factory.getSubject(data);
  const currentUser = await getCurrentUser();

  return (
    <div className={styles.container}>
      <div className={styles.spaceBetween}>
        <div className={styles.stack}>
          {REVIEW_PARTS[type].header(data, subject)}
        </div>
        <div className={styles.stack}>
          <span className={styles.date}>{parseDate(createdDate)}</span>
          <Link href={`#`} className={styles.user}>
            {author?.name}
          </Link>
        </div>
      </div>
      <p className={styles.content}>{content}</p>
    </div>
  );
};

export default ReviewCard;
