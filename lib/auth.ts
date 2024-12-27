"use server";

import { signIn } from "@/auth";
import { parseZodError, verifyPassword } from "@/utils/misc";
import { User } from "@prisma/client";
import { CredentialsSignin } from "next-auth";
import { redirect, unauthorized } from "next/navigation";
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

export async function signInWithCredentials(formData: FormData) {
  try {
    const { email, password } = await signInSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const user = await getUserWithPasswordHashByEmail(email);
    if (!user || !user.passwordHash || !user.emailVerified) unauthorized();
    const result = await verifyPassword(
      password,
      Buffer.from(user.passwordHash.hash, "base64")
    );
    if (!result) unauthorized();
    await signIn("credentials", { email, password, redirectTo: "/browse" });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      if (error.type === "CredentialsSignin" && error.code === "credentials") {
        unauthorized();
      }
    }
    const zodErr = parseZodError(error as Error);
    if (zodErr) return zodErr;
    throw error;
  }
}

export async function signUpWithNodemailer(formData: FormData) {
  try {
    const { email, name, password, passwordRepeat } =
      await signUpSchema.parseAsync({
        email: formData.get("email"),
        name: formData.get("name"),
        password: formData.get("password"),
        passwordRepeat: formData.get("passwordRepeat"),
      });
    if (password !== passwordRepeat)
      return { error: "Passwords did not match!" };
    try {
      const user = await createUserWithEmailNameAndPassword(
        email,
        name,
        password
      );
      redirect(`/auth/verify/${user.id}`);
    } catch (error) {
      if ((error as Error).message.startsWith("NEXT_REDIRECT")) throw error;
      return { error: "User with this email already exists!" };
    }
  } catch (error) {
    const zodErr = parseZodError(error as Error);
    if (zodErr) return zodErr;
    throw error;
  }
}

export async function resetUserPassword(formData: FormData) {
  try {
    const { email, password, passwordRepeat } =
      await resetPasswordSchema.parseAsync({
        email: formData.get("email"),
        password: formData.get("password"),
        passwordRepeat: formData.get("passwordRepeat"),
      });
    if (password !== passwordRepeat)
      return { error: "Passwords did not match!" };
    const user = await getUserByEmail(email);
    if (!user) return { error: "User with specified id does not exist!" };
    await setUserPasswordCache(user.id, password);
    redirect(`/auth/verify/${user.id}-reset`);
  } catch (error) {
    const zodErr = parseZodError(error as Error);
    if (zodErr) return zodErr;
    throw error;
  }
}

export async function sendVerificationMail(
  id: User["id"],
  redirectTo?: string
) {
  const user = await getUserById(id);
  if (!user) return { error: "User with specified id does not exist!" };
  if (user.lastVerificationMail) {
    const diff = Math.round(
      (new Date().getTime() - new Date(user.lastVerificationMail).getTime()) /
        1000
    );
    if (diff < 60) {
      return { error: `Wait another ${60 - diff}s before resending` };
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
