import { randomString } from "@/utils/misc";
import { createClient } from "@supabase/supabase-js";
import "server-only";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

export async function uploadImage(path: string, imageBody: File) {
  if (imageBody.size >= 25000000)
    throw new Error("Image size can not exceed 25MB.");

  let sizeOf = require("buffer-image-size");
  let dimensions = sizeOf(Buffer.from(await imageBody.arrayBuffer()));

  if (dimensions.width >= 2500 || dimensions.height >= 2500)
    throw new Error("Image dimensions can not exceed 2500px.");

  const parts = path.split(".");
  const extension = parts.pop();
  const randomizedPath = `${parts.join(".")}-${randomString(10)}.${extension}`;

  const { data, error } = await supabase.storage
    .from(`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/images`)
    .upload(randomizedPath, imageBody);

  if (error) {
    throw new Error(
      `An error occurred while trying to upload file '${randomizedPath}': ${error.message}`
    );
  }

  return data.path;
}

export async function removeImage(path: string) {
  const { data, error } = await supabase.storage
    .from(`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}`)
    .remove([`images/${path}`]);

  if (error) {
    throw new Error(
      `An error occurred while trying to remove file '${path}': ${error.message}`
    );
  }

  return data.length;
}
