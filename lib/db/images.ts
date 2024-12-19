"use server";

import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { Image } from "@prisma/client";
import { hasPermission } from "../permissions";
import { removeImage, uploadImage } from "../supabase/images.server";

export type ImageCreator = Pick<Image, "path" | "title">;

export async function createImage(info: ImageCreator, imageBody: File) {
  const user = await getCurrentUser();
  if (user == null) return null;
  if (!hasPermission(user, "images", "create")) return null;
  try {
    const path = await uploadImage(info.path, imageBody);
    return await prisma.image.create({
      data: {
        path: path,
        title: info.path,
        uploadedById: user.id,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getImageByPath(path: Image["path"]) {
  return await prisma.image.findFirst({
    where: {
      path: path,
    },
  });
}

export async function deleteImage(path: Image["path"]) {
  const uploadedById = (await getImageByPath(path))?.uploadedById || undefined;
  if (!uploadedById) return null;
  const user = await getCurrentUser();
  if (user == null) return null;
  if (!hasPermission(user, "images", "delete", { uploadedById: uploadedById }))
    return null;
  try {
    await removeImage(path);
    return await prisma.image.delete({
      where: {
        path: path,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
