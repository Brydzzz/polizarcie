"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { blobToDataURL } from "@/utils/misc";
import Image from "next/image";
import { ChangeEvent, LegacyRef, useRef, useState } from "react";
import LoaderBlur from "../misc/loader-blur.component";
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
  const [names, setNames] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handlePickClick = () => {
    if (imageInputRef.current) imageInputRef.current.click();
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = event.target.files;
    if (!files) {
      setPreviewImages([]);
      setNames([]);
      if (onChange) onChange(undefined);
      setLoading(false);
      return;
    }
    if (files.length > 5) {
      event.preventDefault();
      dispatch(
        addSnackbar({ message: "Przekroczono limit 5 plików", type: "error" })
      );
      setLoading(false);
      return;
    }

    let newPreviewImages: string[] = [];
    for (const file of Object.values(files)) {
      const data = await blobToDataURL(file);
      newPreviewImages.push(data);
    }
    setPreviewImages(newPreviewImages);
    setNames(Object.values(files).map((file) => file.name));
    if (onChange) onChange(files);
    setLoading(false);
  };

  return (
    <div className={`${styles.container} ${error ? styles.error : ""}`}>
      <div className={styles.preview}>
        {previewImages.length > 0 ? (
          <>
            <p>{previewImages.length}</p>
            {previewImages.map((image, i) => {
              const factor =
                (previewImages.length - i - 1) / previewImages.length;
              return (
                <div
                  key={i}
                  style={{
                    // left: `${factor * 20}px`,
                    transform: `rotate(${factor * 20}deg)`,
                  }}
                >
                  <Image src={image} alt="Wybrane zdjęcie" fill />
                </div>
              );
            })}
          </>
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
      <button type="button" onClick={handlePickClick} disabled={loading}>
        <div>
          {previewImages.length > 0
            ? imageInputRef.current &&
              names.map((name, i) => <p key={i}>{name}</p>)
            : `Wybierz plik${multiple ? "(i)" : ""}`}
        </div>
      </button>
      <label>{label}</label>
      {loading && <LoaderBlur />}
    </div>
  );
};

export default ImageInput;
