"use server";

import { prisma } from "@/prisma";
import {
  forbidden,
  internalServerError,
  PoliError,
  unauthorized,
} from "@/utils/misc";
import { getCurrentUser } from "@/utils/users";
import { Image } from "@prisma/client";
import { hasPermission } from "../permissions";
import { removeImages, uploadImages } from "../supabase/images.server";

export type ImageCreator = Pick<Image, "path" | "title">;

export async function createImages(
  files: {
    info: ImageCreator;
    imageDataUrl: string;
  }[]
) {
  // permission check
  const user = await getCurrentUser();
  if (user == null) return unauthorized();
  if (!hasPermission(user, "images", "create")) return forbidden();

  // validation
  if (files.length > 5) return forbidden();

  // upload all to supabase
  const paths = await uploadImages(
    await Promise.all(
      files.map(async (file) => {
        const blob = await (await fetch(file.imageDataUrl)).blob();
        return {
          path: file.info.path,
          imageBody: new File([blob], "name", { type: blob.type }),
        };
      })
    )
  );
  if (paths instanceof PoliError) return paths;

  // add entries to db
  try {
    const data = files.map((file, i) => ({
      path: paths[i],
      title: file.info.title,
      uploadedById: user.id,
    }));
    await prisma.image.createMany({
      data: data,
    });
  } catch (error) {
    removeImages(paths); // remove all from supabase, operation failed

    return internalServerError();
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
  if (user == null) return unauthorized();
  const images = await getImagesByPaths(paths);
  if (
    !images.every((image) => {
      return hasPermission(user, "images", "delete", image);
    })
  )
    return forbidden();

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
    return null;
  }
}
