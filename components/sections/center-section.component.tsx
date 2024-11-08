import { ReactNode } from "react";
import styles from "./center-section.module.scss";

type Props = {
  children?: ReactNode;
  width: string;
  offsetX?: string;
};

const CenterSection = ({ children, width, offsetX }: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.text}
        style={{ width: width, transform: `translate(${offsetX || 0}, 0)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default CenterSection;
