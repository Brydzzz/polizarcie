"use client";
import { ReactNode, useState } from "react";
import Button from "../button/button.component";
import { ButtonSize, ButtonStyle } from "../button/button.types";
import styles from "./menu-review-section.module.scss";
type Props = {
  reviewList: ReactNode;
  menuList: ReactNode;
};

const MenuReviewSection = ({ reviewList, menuList }: Props) => {
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className={styles.menuReviewSection}>
      <div className={styles.changeSection}>
        <Button
          style={showMenu ? ButtonStyle.SOLID : ButtonStyle.BACKDROP}
          size={ButtonSize.LARGE}
          onClick={() => setShowMenu(true)}
        >
          Menu
        </Button>
        <Button
          style={!showMenu ? ButtonStyle.SOLID : ButtonStyle.BACKDROP}
          size={ButtonSize.LARGE}
          onClick={() => setShowMenu(false)}
        >
          Opinie
        </Button>
      </div>
      <div className={styles.section}>{showMenu ? menuList : reviewList}</div>
    </div>
  );
};

export default MenuReviewSection;
