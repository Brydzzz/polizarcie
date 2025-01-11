"use client";

import { useState, useEffect } from 'react';
import RestaurantItem from './draggable-restaurant.component';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
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
import { getRestaurantNameById } from '@/lib/db/restaurants';

import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { makeRequest } from "@/utils/misc";
import { updateUserFavoriteRestaurants } from "@/lib/db/users";

type Restaurant = {
  id: number;
  data_id: string;
  restaurantId: string;
  name: string;
};

const RestaurantList = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectCurrentUser);
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  ); 

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const data = await getUserFavoritesRestaurants(user.id);
        const restaurantList = await Promise.all(data.map(async item => {
          const restaurant_name = await getRestaurantNameById(item.restaurantId);
          return {
            id: item.rankingPosition,
            data_id: item.id,
            restaurantId: item.restaurantId,
            name: restaurant_name ? restaurant_name : 'Error loading name',
          };
        }));
        restaurantList.sort((a, b) => a.id - b.id);
        setRestaurantList(restaurantList);
      }
    };

    fetchData();
  }, [user]);

  const saveRestaurantList = async () => {
    try {
      if (user) {
        let i = 0;
        const data: { restaurantId: string; rankingPosition: number }[] = [];
        for (const item of restaurantList) {
          i++;
          data.push({
            restaurantId: item.restaurantId,
            rankingPosition: i,
          });
        }
        await makeRequest(updateUserFavoriteRestaurants, [user.id, data], dispatch);
      }
      dispatch(addSnackbar({ message: "Zapisano zmiany", type: "success" }));
      console.log('Restaurant list saved', restaurantList);
    } catch (error) {
      console.error('Error saving restaurant list:', error);
      dispatch(addSnackbar({ message: "Błąd zapisywania", type: "error" }));
    }
  };

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
        Przeciągnij i upuść, aby zmienić kolejność.
      </p>
      <p className={styles.description}>
        Kolejność zostanie użyta do matchowania z innymi użytkownikami.
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
      <button className={styles.saveButton} onClick={saveRestaurantList}>Zapisz</button>
    </div>
  );
};

export default RestaurantList;
