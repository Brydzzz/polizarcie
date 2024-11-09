"use client";

import Image from "next/image";
import { ChangeEvent, LegacyRef, useRef, useState } from "react";
import styles from "./image-input.module.scss";

type Props = {
  id?: string;
  name?: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
};

const ImageInput = ({ id, name, disabled, label, required, error }: Props) => {
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>();

  function handlePickClick() {
    if (imageInputRef.current) imageInputRef.current.click();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result as string | null);
    };
    fileReader.readAsDataURL(file);
  }

  return (
    <div className={`${styles.container} ${error ? styles.error : ""}`}>
      <div className={styles.preview}>
        {pickedImage ? (
          <Image src={pickedImage} alt="Wybrane zdjęcie" fill />
        ) : (
          "Podgląd"
        )}
      </div>
      <input
        id={id}
        name={name}
        className={styles.invisible}
        type="file"
        accept="image/png, image/jpeg"
        ref={imageInputRef as LegacyRef<HTMLInputElement>}
        onChange={handleImageChange}
        required={required}
        disabled={disabled}
      />
      <button type="button" onClick={handlePickClick}>
        {pickedImage
          ? imageInputRef.current && imageInputRef.current.files
            ? imageInputRef.current.files[0].name
            : ""
          : "Wybierz plik"}
      </button>
      <label>{label}</label>
    </div>
  );
};

export default ImageInput;
