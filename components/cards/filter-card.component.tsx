import styles from "@/components/cards/filter-card.module.scss";
import { MouseEventHandler } from "react";
type Props = {
  name: string;
  value: string | number;
  onCancelButtonClick?: MouseEventHandler;
};

const FilterCard = ({ name, value, onCancelButtonClick }: Props) => {
  return (
    <div className={styles.container}>
      <span>{`${name}:\t${value}`}</span>
      <span className={styles.cancelIcon} onClick={onCancelButtonClick || (() => {})}>
        <i className="fa-solid fa-xmark"></i>
      </span>
    </div>
  );
};

export default FilterCard;
