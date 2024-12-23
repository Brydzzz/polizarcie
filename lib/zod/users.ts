import { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(
    1,
    "Password is required"
  ),
});

export const signUpSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .min(5, "Name length can not be less than 5")
    .max(32, "Name length can not be more than 32"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password length can not be less than 8")
    .max(32, "Password length can not be more than 32"),
  passwordRepeat: string({ required_error: "Password repeat is required" }),
});

export const resetPasswordSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password length can not be less than 8")
    .max(32, "Password length can not be more than 32"),
  passwordRepeat: string({ required_error: "Password repeat is required" }),
});
