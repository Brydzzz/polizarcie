"use client";

import Button from "@/components/button/button.component";
import ImageInput from "@/components/inputs/image-input.component";
import SupabaseImage from "@/components/misc/supabase-image";
import { createImage, deleteImage } from "@/lib/db/images";
import { getRestaurantById, linkImageToRestaurant } from "@/lib/db/restaurants";
import { transferWithJSON } from "@/utils/misc";
import { useState } from "react";

const SupabaseImages = () => {
  const [path, setPath] = useState<string | undefined>();

  const invoke = (formData: FormData) => {
    const exec = async () => {
      const rest = await transferWithJSON(getRestaurantById, ["1"]);
      rest?.images.forEach((image) => deleteImage(image.path));
      const result = await createImage(
        { path: "dev/example.jpg", title: "Example image" },
        formData.get("image") as File
      );
      if (result) {
        setPath(result.path);
        linkImageToRestaurant("1", result.path);
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
          <ImageInput name="image" label="Image" />
          <Button type="submit">Submit and link to rest 1</Button>
        </form>
        {path && (
          <>
            <SupabaseImage src={path} width={200} height={200} alt="image" />
            <SupabaseImage src={path} height={200} alt="image" />
            <SupabaseImage src={path} width={200} alt="image" />
          </>
        )}
      </div>
    </div>
  );
};

export default SupabaseImages;
