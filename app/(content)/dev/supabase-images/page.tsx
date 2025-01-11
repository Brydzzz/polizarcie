"use client";

import Button from "@/components/button/button.component";
import ModalableImage from "@/components/images/modalable-image.component";
import SupabaseImage from "@/components/images/supabase-image.component";
import ImageInput from "@/components/inputs/image-input.component";
import { createImages, deleteImages } from "@/lib/db/images";
import {
  getRestaurantById,
  linkImagesToRestaurant,
} from "@/lib/db/restaurants";
import { useAppDispatch } from "@/lib/store/hooks";
import { makeRequest } from "@/utils/misc";
import { prepareImagesToUpload } from "@/utils/misc.client";
import { useState } from "react";

const SupabaseImages = () => {
  const [previewPaths, setPreviewPaths] = useState<string[] | undefined>();
  const [files, setFiles] = useState<File[] | undefined>();
  const dispatch = useAppDispatch();

  const invoke = () => {
    const exec = async () => {
      try {
        const rest = await makeRequest(getRestaurantById, ["1"], dispatch);
        if (rest)
          await makeRequest(
            deleteImages,
            [rest.images.map((image) => image.path)],
            dispatch
          );
        if (!files) return;

        const filesData = await prepareImagesToUpload(
          files,
          "dev/example",
          "Example image"
        );
        console.log(filesData);

        const paths = await makeRequest(createImages, [filesData], dispatch);
        await makeRequest(linkImagesToRestaurant, ["1", paths], dispatch);

        setPreviewPaths(paths);
      } catch (error) {}
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
              <ModalableImage src={path} width={50} height={50} alt="image" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default SupabaseImages;
