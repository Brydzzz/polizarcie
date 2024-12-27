import { prisma } from "@/prisma";
import { hashPassword } from "@/utils/misc";
import { User } from "@prisma/client";
import "server-only";
import { getUserById } from "./users";

export async function getUserWithPasswordHashByEmail(email: User["email"]) {
  return await prisma.user.findFirst({
    where: {
      email: email,
    },
    include: {
      passwordHash: true,
    },
  });
}

export async function createUserWithEmailNameAndPassword(
  email: User["email"],
  name: string,
  password: string
) {
  const hash = (await hashPassword(password)).toString("base64");
  return await prisma.user.create({
    data: {
      name: name,
      email: email,
      passwordHash: {
        create: {
          hash: hash,
        },
      },
    },
  });
}

export async function getUserPasswordHashCache(id: User["id"]) {
  const user = await getUserById(id);
  if (!user) throw new Error("User with specified id does not exist");
  return await prisma.userPasswordHashCache.findFirst({
    where: {
      forUserEmail: user.email,
    },
  });
}

export async function updateUserPasswordFromCache(id: User["id"]) {
  const user = await getUserById(id);
  if (!user) throw new Error("User with specified id does not exist");
  const passwordHashCache = await getUserPasswordHashCache(id);
  if (!passwordHashCache) return false;
  return (await prisma.userPasswordHash.upsert({
    where: {
      forUserEmail: user.email,
    },
    update: {
      hash: passwordHashCache.hash,
    },
    create: {
      forUserEmail: user.email,
      hash: passwordHashCache.hash,
    },
  }))
    ? true
    : false;
}

export async function setUserPasswordCache(id: User["id"], password: string) {
  const user = await getUserById(id);
  if (!user) throw new Error("User with specified id does not exist");
  const hash = (await hashPassword(password)).toString("base64");
  return await prisma.userPasswordHashCache.upsert({
    where: {
      forUserEmail: user.email,
    },
    update: {
      hash: hash,
    },
    create: {
      forUserEmail: user.email,
      hash: hash,
    },
  });
}

export async function clearUserPasswordCache(id: User["id"]) {
  const user = await getUserById(id);
  if (!user) throw new Error("User with specified id does not exist");
  if (!(await getUserPasswordHashCache(id))) return false;
  await prisma.userPasswordHashCache.delete({
    where: {
      forUserEmail: user.email,
    },
  });
  return true;
}
