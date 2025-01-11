"use client";

import { ComponentProps, useState } from "react";
import Loader from "../misc/loader.component";
import styles from "./modalable-image.module.scss";
import SupabaseImage from "./supabase-image.component";

const ModalableImage = (props: ComponentProps<typeof SupabaseImage>) => {
  const [mode, setMode] = useState<"preview" | "modal">("preview");
  const { width, height } = props;

  const changeMode = () => {
    if (mode === "preview") setMode("modal");
    else setMode("preview");
  };

  return (
    <div
      className={styles.container}
      onClick={changeMode}
      style={{ width: width && `${width}px`, height: height && `${height}px` }}
    >
      <div className={styles.preview}>
        <SupabaseImage {...{ quality: 50, ...props }} />
      </div>
      {mode === "modal" && (
        <div className={styles.modal}>
          <Loader size="150px" />
          <div className={styles.image}>
            <SupabaseImage
              {...{
                ...props,
                width: 2048,
                height: undefined,
                quality: 100,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalableImage;
