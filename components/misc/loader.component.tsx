import { LegacyRef, useEffect, useRef } from "react";
import styles from "./loader.module.scss";

type Props = {
  size?: string;
  color?: string;
};

const Loader = ({ size, color }: Props) => {
  const ref = useRef<HTMLDivElement>();

  useEffect(() => {
    ref.current?.style.setProperty("--size", size || "100px");
    ref.current?.style.setProperty("--color", color || "var(--text)");
  });

  return (
    <div ref={ref as LegacyRef<HTMLDivElement>} className={styles.container}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
