import {
  badData,
  internalServerError,
  PoliError,
  randomString,
} from "@/utils/misc";
import { createClient } from "@supabase/supabase-js";
import "server-only";
import slugify from "slugify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_KEY || ""
);

async function parseImage(image: File) {
  const type =
    image.type === "image/jpeg"
      ? "image/jpeg"
      : image.type === "image/png"
      ? "image/png"
      : undefined;
  if (!type) return badData("Invalid image format");
  if (image.size >= 25000000) return badData("Image size can not exceed 25MB.");

  const sizeOf = require("buffer-image-size");
  try {
    const dimensions = sizeOf(Buffer.from(await image.arrayBuffer()));
    const maxDim = 2048;
    if (dimensions.width <= maxDim && dimensions.height <= maxDim) return image; // valid image
    return badData("Image dimensions can not exceed 2500px");
  } catch (error) {
    return internalServerError();
  }
}

export async function uploadImages(
  images: { path: string; imageBody: File }[]
) {
  if (images.length === 0) return [];
  // validating
  const parsedImages: { path: string; imageBody: File }[] = [];
  for (const { path, imageBody } of images) {
    const parsedImage = await parseImage(imageBody);
    if (parsedImage instanceof PoliError) return parsedImage;
    parsedImages.push({ path: path, imageBody: parsedImage });
  }

  //uploading
  let paths: string[] = [];
  for (const { path, imageBody } of parsedImages) {
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
