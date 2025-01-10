import { Dish, DishType } from "@prisma/client";
import DishCard from "../cards/dish-card.component";
import styles from "./menu-list.module.scss";
type Props = {
  data: Dish[];
  restaurantSlug: string;
};

const MenuList = ({ data, restaurantSlug }: Props) => {
  const dishTypeOrder = [
    DishType.TOP,
    DishType.STARTER,
    DishType.SOUP,
    DishType.MAIN_DISH,
    DishType.DESSERT,
    DishType.OTHER,
    DishType.DRINK,
    DishType.SIDE,
  ];

  const dishTypeDict = new Map<DishType, string>([
    [DishType.TOP, "Najpopularniejsze"],
    [DishType.STARTER, "Przystawki"],
    [DishType.SOUP, "Zupy"],
    [DishType.MAIN_DISH, "Dania Główne"],
    [DishType.DESSERT, "Desery"],
    [DishType.OTHER, "Inne"],
    [DishType.DRINK, "Napoje"],
    [DishType.SIDE, "Dodatki"],
  ]);

  return (
    <div className={styles.container}>
      {data.length === 0 && (
        <p className={styles.unavailable}>
          Przepraszamy, menu nie jest dostępne :(
        </p>
      )}
      {dishTypeOrder.map((type, index) => {
        const dishesWithType = data.filter((dish) => dish.type === type);

        if (dishesWithType.length === 0) return null;
        return (
          <div key={index} className={styles.dishCategory}>
            <h3>{dishTypeDict.get(DishType[type])}</h3>
            <div className={styles.dishList}>
              {dishesWithType.map((dish, index) => (
                <DishCard
                  key={index}
                  data={dish}
                  restaurantSlug={restaurantSlug}
                ></DishCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuList;
