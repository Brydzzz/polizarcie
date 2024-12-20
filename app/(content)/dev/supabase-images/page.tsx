"use client";

import Button from "@/components/button/button.component";
import ImageInput from "@/components/inputs/image-input.component";
import SupabaseImage from "@/components/misc/supabase-image";
import { createImages, deleteImages } from "@/lib/db/images";
import {
  getRestaurantById,
  linkImagesToRestaurant,
} from "@/lib/db/restaurants";
import { useAppDispatch } from "@/lib/store/hooks";
import { addSnackbar } from "@/lib/store/ui/ui.slice";
import { transferWithJSON } from "@/utils/misc";
import { useState } from "react";

const SupabaseImages = () => {
  const [previewPaths, setPreviewPaths] = useState<string[] | undefined>();
  const [files, setFiles] = useState<File[] | undefined>();
  const dispatch = useAppDispatch();

  const invoke = () => {
    const exec = async () => {
      const rest = await transferWithJSON(getRestaurantById, ["1"]);
      try {
        if (rest) await deleteImages(rest.images.map((image) => image.path));
        if (!files) return;
        const paths = await createImages(
          files.map((file) => ({
            info: {
              path: file.name,
              title: "Example image",
            },
            imageBody: file,
          }))
        );
        await linkImagesToRestaurant("1", paths);
        setPreviewPaths(paths);
      } catch (error) {
        dispatch(
          addSnackbar({ message: (error as Error).message, type: "error" })
        );
      }
    };
    exec();
  };

  return (
    <div
      className="centralized-x"
      style={{ marginTop: "100px", paddingBottom: "100px" }}
    >
      <div className="centralized-y" style={{ width: "350px" }}>
        <form action={invoke}>
          <ImageInput
            name="image"
            label="Image"
            multiple
            onChange={(v) => setFiles(v && Object.values(v))}
          />
          <Button type="submit">Submit and link to rest 1</Button>
        </form>
        {previewPaths &&
          previewPaths.map((path, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <div
                style={{ display: "flex", flexDirection: "row", gap: "5px" }}
              >
                <SupabaseImage
                  src={path}
                  width={200}
                  height={200}
                  alt="image"
                />
                <SupabaseImage src={path} height={200} alt="image" />
              </div>
              <SupabaseImage src={path} width={200} alt="image" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SupabaseImages;
