import { REVIEW_FUNCTIONS, ReviewType } from "@/utils/factories/reviews";
import styles from "./review-list.module.scss";

type Props = {
  type: keyof ReviewType;
  forId: string;
};

const ReviewList = async ({ type, forId }: Props) => {
  const func = REVIEW_FUNCTIONS[type];
  const reviews = await func.getByTypeId(forId);

  return <div className={styles.container}>Enter</div>;
};

export default ReviewList;
