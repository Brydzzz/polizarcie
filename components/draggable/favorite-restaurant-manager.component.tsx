"use client";

import {
  getUserFavoritesRestaurants,
  updateUserFavoriteRestaurants,
} from "@/lib/db/users";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { selectCurrentUser } from "@/lib/store/user/user.selector";
import { makeRequest } from "@/utils/misc";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Restaurant, UserFavoriteRestaurant } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../button/button.component";
import { ButtonColor, ButtonSize } from "../button/button.types";
import { CardsOrigin } from "../cards/restaurant-card.component";
import DraggableRestaurant from "./draggable-restaurant.component";
import styles from "./favorite-restaurant-manager.module.scss";

type Props = {
  cardsOrigin?: CardsOrigin;
};

const FavoriteRestaurantManager = ({ cardsOrigin }: Props) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const currentUser = useAppSelector(selectCurrentUser);
  const [favoritesList, setFavoritesList] = useState<
    (UserFavoriteRestaurant & { restaurant: Restaurant })[]
  >([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        setFavoritesList(
          (await getUserFavoritesRestaurants(currentUser.id)).sort(
            (a, b) => a.rankingPosition - b.rankingPosition
          )
        );
      }
    };
    fetchData();
  }, [currentUser]);

  const saveFavoritesRestaurants = async () => {
    if (currentUser) {
      await makeRequest(
        updateUserFavoriteRestaurants,
        [
          favoritesList.map((favorite, i) => ({
            restaurantId: favorite.restaurantId,
            rankingPosition: i + 1,
          })),
        ],
        dispatch
      );
    }
    dispatch(addSnackbar({ message: "Zapisano zmiany", type: "success" }));
  };

  const saveAndUpdate =
    <
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Func extends (...args: any[]) => Promise<any>
    >(
      func: Func,
      args: Parameters<Func>
    ) =>
    async () => {
      setLoading(true);
      try {
        await func(...args);
      } catch (error) {
        const message = (error as Error).message;
        if (!message.startsWith("POLI_ERROR")) {
          setLoading(false);
          throw error;
        }
      }
      setLoading(false);
    };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setFavoritesList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ulubione restauracje</h1>
      <p className={styles.description}>
        Kolejność zostanie użyta do matchowania z innymi użytkownikami.
      </p>
      <div className={styles.sectionTitle}>
        <h2>Przeciągnij i uporządkuj</h2>
      </div>
      {favoritesList.length === 0 && (
        <>
          <p className={styles.empty}>
            Nie posiadasz obecnie żadnych ulubionych restauracji
          </p>
          <div className={styles.sectionTitle}>
            <h2>Co zrobić?</h2>
          </div>
        </>
      )}

      {favoritesList.length > 0 ? (
        <>
          <div className={styles.sortableContainer}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
              <SortableContext
                items={favoritesList}
                strategy={verticalListSortingStrategy}
              >
                {favoritesList.map((favorite, i) => (
                  <DraggableRestaurant
                    key={favorite.id}
                    id={favorite.id}
                    restaurant={favorite.restaurant}
                    origin={cardsOrigin}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          <div className={styles.right}>
            <Button
              type="button"
              onClick={saveAndUpdate(saveFavoritesRestaurants, [])}
              size={ButtonSize.SMALL}
              color={ButtonColor.SECONDARY}
              disabled={loading}
            >
              <i className="fa-solid fa-floppy-disk"></i>&nbsp;&nbsp;
              {loading ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.center}>
          <Link href="/browse">
            <Button>Poszukaj ich</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoriteRestaurantManager;
