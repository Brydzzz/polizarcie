import styles from "@/components/cards/filter-card.module.scss";
import { MouseEventHandler } from "react";

export enum FilterCardStyle {
  SOLID = "solid",
  BACKDROP = "backdrop",
}

type Props = {
  name: string;
  value?: string | number;
  style?: FilterCardStyle;
  onCardClick?: MouseEventHandler;
  onCancelButtonClick?: MouseEventHandler;
};

const FilterCard = ({
  name,
  value,
  style,
  onCardClick,
  onCancelButtonClick,
}: Props) => {
  return (
    <div
      className={`${styles.container} ${styles[style || FilterCardStyle.SOLID]}
        `}
      onClick={onCardClick || (() => {})}
    >
      <span>{`${name}${value ? `:\t${value}` : ""}`}</span>
      <span
        className={styles.cancelIcon}
        onClick={onCancelButtonClick || (() => {})}
      >
        <i className="fa-solid fa-xmark"></i>
      </span>
    </div>
  );
};

export default FilterCard;
