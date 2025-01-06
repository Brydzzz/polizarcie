import { badData, randomString } from "@/utils/misc";
import { createClient } from "@supabase/supabase-js";
import "server-only";
import slugify from "slugify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

export async function uploadImages(
  images: { path: string; imageBody: File }[]
) {
  if (images.length === 0) return [];
  // validating
  for (const { imageBody } of images) {
    if (imageBody.size >= 25000000)
      return badData("Image size can not exceed 25MB.");

    let sizeOf = require("buffer-image-size");
    let dimensions = sizeOf(Buffer.from(await imageBody.arrayBuffer()));

    if (dimensions.width >= 2500 || dimensions.height >= 2500)
      return badData("Image dimensions can not exceed 2500px.");
  }

  //uploading
  let paths: string[] = [];
  for (const { path, imageBody } of images) {
    const dirs = path.split("/");
    const filename = dirs.pop() as string;
    dirs.splice(2); // limit dirs amount to max 2
    const parts = filename.split(".");
    const extension = parts.pop();
    const randomizedPath =
      dirs.join("/") +
      "/" +
      slugify(`${parts.join(".")}-${randomString(10)}.${extension}`);

    const { data, error } = await supabase.storage
      .from(`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/images`)
      .upload(randomizedPath, imageBody);

    if (error) {
      await removeImages(paths); // remove previous images, operation failed
      throw error;
      throw new Error(
        `An error occurred while trying to upload file '${path}': ${error?.message}`
      );
    }

    paths.push(data.path);
  }
  return paths;
}

export async function removeImages(paths: string[]) {
  if (paths.length === 0) return 0;

  const { data, error } = await supabase.storage
    .from(`${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}`)
    .remove(paths.map((path) => `images/${path}`));

  if (error) {
    throw new Error(
      `An error occurred while trying to remove files '${paths.join(", ")}': ${
        error.message
      }`
    );
  }

  return data.length;
}
