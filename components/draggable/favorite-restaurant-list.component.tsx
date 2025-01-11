"use client";

import { useState, useEffect } from 'react';
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
import { getUserFavoritesRestaurants } from '@/lib/db/users';

import { useAppSelector } from '@/lib/store/hooks';
import { selectCurrentUser } from '@/lib/store/user/user.selector';

import styles from './favorite-restaurant-list.module.scss';
import { getRestaurantById } from '@/lib/db/restaurants';

type Restaurant = {
  id: number;
  data_id: string;
  name: string;
  email: string;
};

const RestaurantList = () => {

  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const data = await getUserFavoritesRestaurants(user.id);
        const restaurantList = await Promise.all(data.map(async item => {
          const restaurant = await getRestaurantById(item.restaurantId);
          return {
            id: item.rankingPosition,
            data_id: item.id,
            name: restaurant ? restaurant.name : 'Error loading name', // or fetch the name if available
            email: 'Unknown', // or fetch the email if available
          };
        }));
        setRestaurantList(restaurantList);
      }
    };

    fetchData();
  }, [user]);

  const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);
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
