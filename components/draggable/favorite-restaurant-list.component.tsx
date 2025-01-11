"use client";

import { useState } from 'react';
import RestaurantItem from './draggable-restaurant.component';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentUser } from '@/lib/store/user/user.selector';

import styles from './favorite-restaurant-list.module.scss';

type Restaurant = {
  id: number;
  name: string;
  email: string;
};
const dummyData: Restaurant[] = [
  {
    id: 1,
    name: 'Thien LY',
    email: 'john@example.com',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    email: 'alice@example.com',
  },
];

const RestaurantList = () => {

  const user = useAppSelector(selectCurrentUser);

  const [restaurantList, setRestaurantList] = useState<Restaurant[]>(dummyData);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setRestaurantList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Ulubione restauracje</h2>
      <p className={styles.description}>
        Przeciągnij i upuść, aby zmienić kolejność od najbardziej do najmniej ulubionej
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={restaurantList}
          strategy={verticalListSortingStrategy}
        >
          {restaurantList.map((restaurant) => (
            <RestaurantItem key={restaurant.id} restaurant={restaurant} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default RestaurantList;
