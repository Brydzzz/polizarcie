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
  multiple?: boolean;
  onChange?: (value: FileList | undefined) => void;
};

const ImageInput = ({
  id,
  name,
  disabled,
  label,
  required,
  error,
  multiple,
  onChange,
}: Props) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>();

  function handlePickClick() {
    if (imageInputRef.current) imageInputRef.current.click();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (!file) {
      setPreviewImage(null);
      if (onChange) onChange(undefined);
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewImage(fileReader.result as string | null);
    };
    fileReader.readAsDataURL(file);
    if (onChange) onChange(event.target.files);
  }

  return (
    <div className={`${styles.container} ${error ? styles.error : ""}`}>
      <div className={styles.preview}>
        {previewImage ? (
          <Image src={previewImage} alt="Wybrane zdjęcie" fill />
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
        multiple={multiple}
      />
      <button type="button" onClick={handlePickClick}>
        {previewImage
          ? imageInputRef.current && imageInputRef.current.files
            ? Object.values(imageInputRef.current.files).map((file, i) => (
                <p key={i}>{file.name}</p>
              ))
            : ""
          : "Wybierz plik"}
      </button>
      <label>{label}</label>
    </div>
  );
};

export default ImageInput;
