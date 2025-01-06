"use server";

import { signIn } from "@/auth";
import {
  badData,
  badDataFromZodError,
  unauthorized,
  verifyPassword,
} from "@/utils/misc";
import { User } from "@prisma/client";
import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import {
  getUserByEmail,
  getUserById,
  updateUserLastVerificationMail,
} from "./db/users";
import {
  createUserWithEmailNameAndPassword,
  getUserWithPasswordHashByEmail,
  setUserPasswordCache,
} from "./db/users.server-only";
import { resetPasswordSchema, signInSchema, signUpSchema } from "./zod/users";

export async function signInWithCredentials(data: {
  email: string;
  password: string;
}) {
  try {
    const { email, password } = await signInSchema.parseAsync(data);
    const user = await getUserWithPasswordHashByEmail(email);
    if (!user || !user.passwordHash || !user.emailVerified)
      return unauthorized();
    const result = await verifyPassword(
      password,
      Buffer.from(user.passwordHash.hash, "base64")
    );
    if (!result) return unauthorized();
    await signIn("credentials", { email, password, redirectTo: "/browse" });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      if (error.type === "CredentialsSignin" && error.code === "credentials") {
        return unauthorized();
      }
    }
    if (error instanceof ZodError) return badDataFromZodError(error);
    throw error;
  }
}

export async function signUpWithNodemailer(data: {
  email: string;
  name: string;
  password: string;
  passwordRepeat: string;
}) {
  try {
    const { email, name, password, passwordRepeat } =
      await signUpSchema.parseAsync(data);
    if (password !== passwordRepeat) return badData("Passwords did not match!");
    try {
      const user = await createUserWithEmailNameAndPassword(
        email,
        name,
        password
      );
      redirect(`/auth/verify/${user.id}`);
    } catch (error) {
      if ((error as Error).message.startsWith("NEXT_REDIRECT")) throw error;
      return badData("User with this email already exists!");
    }
  } catch (error) {
    if (error instanceof ZodError) return badDataFromZodError(error);
    throw error;
  }
}

export async function resetUserPassword(data: {
  email: string;
  password: string;
  passwordRepeat: string;
}) {
  try {
    const { email, password, passwordRepeat } =
      await resetPasswordSchema.parseAsync(data);
    if (password !== passwordRepeat) return badData("Passwords did not match!");
    const user = await getUserByEmail(email);
    if (!user) return badData("User with specified id does not exist!");
    await setUserPasswordCache(user.id, password);
    redirect(`/auth/verify/${user.id}-reset`);
  } catch (error) {
    if (error instanceof ZodError) return badDataFromZodError(error);
    throw error;
  }
}

export async function sendVerificationMail(
  id: User["id"],
  redirectTo?: string
) {
  const user = await getUserById(id);
  if (!user) return badData("User with specified id does not exist!");
  if (user.lastVerificationMail) {
    const diff = Math.round(
      (new Date().getTime() - new Date(user.lastVerificationMail).getTime()) /
        1000
    );
    if (diff < 60) {
      return badData(`Wait another ${60 - diff}s before resending`);
    }
  }
  await updateUserLastVerificationMail(id);
  try {
    await signIn("nodemailer", {
      email: user.email,
      redirect: false,
      redirectTo: redirectTo || "/browse",
    });
  } catch (error) {
    throw error;
  }
}
