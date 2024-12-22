"use server";

import { signIn } from "@/auth";
import { parseZodError } from "@/utils/misc";
import { verifyPassword } from "@/utils/misc.server-only";
import { CredentialsSignin } from "next-auth";
import { unauthorized } from "next/navigation";
import {
  createUserWithEmailNameAndPassword,
  getUserWithPasswordHashByEmail,
} from "./db/server-only";
import { signInSchema, signUpSchema } from "./zod/users";

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
    await signIn("credentials", formData);
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

export async function signInWithNodemailer(formData: FormData) {
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
      await createUserWithEmailNameAndPassword(email, name, password);
    } catch (error) {
      return { error: "User with this email already exists!" };
    }
    await signIn("nodemailer", formData);
  } catch (error) {
    const zodErr = parseZodError(error as Error);
    if (zodErr) return zodErr;
    throw error;
  }
}
