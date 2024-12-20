"use server";

import { prisma } from "@/prisma";
import { getCurrentUser } from "@/utils/users";
import { Image } from "@prisma/client";
import { forbidden, unauthorized } from "next/navigation";
import { hasPermission } from "../permissions";
import { removeImages, uploadImages } from "../supabase/images.server";

export type ImageCreator = Pick<Image, "path" | "title">;

export async function createImages(
  files: { info: ImageCreator; imageBody: File }[]
) {
  // permission check
  const user = await getCurrentUser();
  if (user == null) unauthorized();
  if (!hasPermission(user, "images", "create")) forbidden();

  // upload all to supabase
  const paths = await uploadImages(
    files.map((file) => ({ path: file.info.path, imageBody: file.imageBody }))
  );

  // add entries to db
  try {
    await prisma.image.createMany({
      data: files.map((file, i) => ({
        path: paths[i],
        title: file.info.path,
        uploadedById: user.id,
      })),
    });
  } catch (error) {
    removeImages(paths); // remove all from supabase, operation failed
    throw error;
  }

  return paths;
}

export async function getImagesByPaths(paths: Image["path"][]) {
  return await prisma.image.findMany({
    where: {
      path: {
        in: paths,
      },
    },
  });
}

export async function deleteImages(paths: Image["path"][]) {
  // permission check
  const user = await getCurrentUser();
  if (user == null) unauthorized();
  const images = await getImagesByPaths(paths);
  if (
    !images.every((image) => {
      return hasPermission(user, "images", "delete", image);
    })
  )
    forbidden();

  // remove images from supabase
  try {
    await removeImages(paths);
    return await prisma.image.deleteMany({
      where: {
        path: {
          in: paths,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
