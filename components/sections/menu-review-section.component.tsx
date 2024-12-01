"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectRestaurantPageView } from "@/lib/store/layout-options/layout-options.selector";
import { setRestaurantPageView } from "@/lib/store/layout-options/layout-options.slice";
import { ReactNode } from "react";
import Button from "../button/button.component";
import { ButtonSize, ButtonStyle } from "../button/button.types";
import styles from "./menu-review-section.module.scss";
type Props = {
  reviewList: ReactNode;
  menuList: ReactNode;
};

const MenuReviewSection = ({ reviewList, menuList }: Props) => {
  const view = useAppSelector(selectRestaurantPageView);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.menuReviewSection}>
      <div className={styles.changeSection}>
        <Button
          style={view === "menu" ? ButtonStyle.SOLID : ButtonStyle.BACKDROP}
          size={ButtonSize.LARGE}
          onClick={() => dispatch(setRestaurantPageView("menu"))}
        >
          Menu
        </Button>
        <Button
          style={view === "reviews" ? ButtonStyle.SOLID : ButtonStyle.BACKDROP}
          size={ButtonSize.LARGE}
          onClick={() => dispatch(setRestaurantPageView("reviews"))}
        >
          Opinie
        </Button>
      </div>
      <div className={styles.section}>
        {view === "menu" ? menuList : reviewList}
      </div>
    </div>
  );
};

export default MenuReviewSection;
