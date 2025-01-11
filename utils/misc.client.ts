"use client";

import { blobToDataURL } from "./misc";

export const imageToResizedDataURL = (image: File, maxDim: number = 2048) => {
  return new Promise<string>(async (resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      resolve(dataUrl);
    };
    img.src = await blobToDataURL(image);
  });
};

export const prepareImagesToUpload = async (
  images: File[],
  path: string,
  title: string
) => {
  return await Promise.all(
    images.map(async (image) => {
      return {
        info: {
          path: `${path}.jpg`,
          title: title,
        },
        imageDataUrl: await imageToResizedDataURL(image),
      };
    })
  );
};
