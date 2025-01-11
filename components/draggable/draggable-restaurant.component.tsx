import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Restaurant } from "@prisma/client";
import Link from "next/link";
import styles from "./draggable-restaurant.module.scss";

type Props = {
  id: string;
  restaurant: Restaurant;
};

const DraggableRestaurant = ({ id, restaurant }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    index,
    activeIndex,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.container} ${
        activeIndex === index ? styles.active : ""
      }`}
    >
      <h3 {...attributes} {...listeners}>
        {index + 1}. {restaurant.name}
      </h3>
      <Link href={`/restaurant/${restaurant.slug}`}>
        <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  );
};

export default DraggableRestaurant;
