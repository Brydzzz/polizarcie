"use server";

import { Address } from "@prisma/client";
import { prisma } from "../../prisma";

export async function getAddressById(id: Address["id"]) {
  return await prisma.address.findFirst({
    where: {
      id: id,
    },
  });
}
