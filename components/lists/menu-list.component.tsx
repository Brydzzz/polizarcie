import { Dish, DishType } from "@prisma/client";
import DishCard from "../cards/dish-card.component";
import styles from "./menu-list.module.scss";
type Props = {
  data: Partial<Dish>[];
};

const MenuList = ({ data }: Props) => {
  const dishTypeOrder = [
    DishType.STARTER,
    DishType.SOUP,
    DishType.MAIN_DISH,
    DishType.DESSERT,
    DishType.OTHER,
    DishType.DRINK,
    DishType.SIDE,
  ];

  const dishTypeDict = new Map<DishType, string>([
    [DishType.STARTER, "Przystawki"],
    [DishType.SOUP, "Zupy"],
    [DishType.MAIN_DISH, "Dania Główne"],
    [DishType.DESSERT, "Desery"],
    [DishType.OTHER, "Inne"],
    [DishType.DRINK, "Napoje"],
    [DishType.SIDE, "Dodatki"]
  ]);

  return (
    <div className={styles.container}>
      {dishTypeOrder.map((type) => {
        const dishesWithType = data.filter((dish) => dish.type === type);

        if (dishesWithType.length === 0) return null;
        return (
          <div key={type} className={styles.dishCategory}>
            <p>{dishTypeDict.get(DishType[type])}</p>
            <div className={styles.dishList}>
              {dishesWithType.map((dish) => (
                <DishCard key={dish.id} data={dish}></DishCard>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MenuList;
