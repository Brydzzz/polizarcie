"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { selectSnackbars } from "@/lib/store/ui/ui.selector";
import Snackbar from "./snackbar.component";
import styles from "./snackbars-container.module.scss";

const Snackbars = () => {
  const snackbars = useAppSelector(selectSnackbars);

  return (
    <div className={styles.container}>
      {snackbars.map((snackbar) => (
        <Snackbar key={snackbar.id} {...snackbar} />
      ))}
    </div>
  );
};

export default Snackbars;
