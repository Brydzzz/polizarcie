"use server";

import { uploadImage } from "./images.server";

export async function uploadDevImageFromFormData(formData: FormData) {
  const image = formData.get("image") as File;
  const extension = image.name.split(".").pop();
  const fileName = `dev/test.${extension}`;
  const imagePath = await uploadImage(fileName, image);
  return imagePath;
}
