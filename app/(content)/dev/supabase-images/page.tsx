"use client";

import Button from "@/components/button/button.component";
import ImageInput from "@/components/inputs/image-input.component";
import SupabaseImage from "@/components/misc/supabase-image";
import { uploadDevImageFromFormData } from "@/lib/supabase/actions";
import { useState } from "react";

const SupabaseImages = () => {
  const [path, setPath] = useState<string | undefined>();

  const invoke = (formData: FormData) => {
    const exec = async () => {
      const result = await uploadDevImageFromFormData(formData);
      setPath(result);
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
          <Button type="submit">Submit</Button>
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
