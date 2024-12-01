"use server";

import { prisma } from "@/prisma";
import { Dish } from "@prisma/client";

export async function getDishById(id: Dish["id"]) {
  return await prisma.dish.findFirst({
    where: { id: id },
  });
}
