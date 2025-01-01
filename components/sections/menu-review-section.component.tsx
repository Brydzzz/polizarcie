"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectRestaurantPageView,
  selectViewportWidth,
} from "@/lib/store/ui/ui.selector";
import { setRestaurantPageView, ViewportSize } from "@/lib/store/ui/ui.slice";
import { ReactNode, useEffect, useRef } from "react";
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
  const size = useAppSelector(selectViewportWidth);

  useEffect(() => {
    return () => {
      dispatch(setRestaurantPageView("menu"));
    };
  }, [dispatch]);

  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = () => {
    const headerHeight = 280;
    const offset = (sectionRef.current?.offsetTop || 0) - headerHeight;
    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  };

  const handleMenuClick = () => {
    dispatch(setRestaurantPageView("menu"));
    scrollToSection();
  };

  const handleReviewsClick = () => {
    dispatch(setRestaurantPageView("reviews"));
    scrollToSection();
  };

  return (
    <div className={styles.menuReviewSection}>
      {size < ViewportSize.LG ? (
        <>
          <div className={styles.changeSection}>
            <Button
              style={view === "menu" ? ButtonStyle.SOLID : ButtonStyle.BACKDROP}
              size={ButtonSize.LARGE}
              onClick={handleMenuClick}
            >
              Menu
            </Button>
            <Button
              style={
                view === "reviews" ? ButtonStyle.SOLID : ButtonStyle.BACKDROP
              }
              size={ButtonSize.LARGE}
              onClick={handleReviewsClick}
            >
              Opinie
            </Button>
          </div>
          <div ref={sectionRef} className={styles.section}>
            {view === "menu" ? menuList : reviewList}
          </div>
        </>
      ) : (
        <div className={styles.multiSection}>
          <div ref={sectionRef} className={styles.section}>
            <h2>Menu</h2>
            {menuList}
          </div>
          <div ref={sectionRef} className={styles.section}>
            <h2>Opinie</h2>
            {reviewList}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuReviewSection;
