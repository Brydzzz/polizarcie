import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FC } from 'react';
import styles from  './draggable-restaurant.module.scss';

interface RestaurantItemProps {
  restaurant: {
    id: number;
    data_id: string;
    name: string;
    email: string;
  };
}

const RestaurantItem: FC<RestaurantItemProps> = (props) => {
  const { id, name, email } = props.restaurant;
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.container}
    >
      <div>
        <h3 className={styles.name}>{name}</h3>
      </div>
    </div>
  );
};

export default RestaurantItem;
