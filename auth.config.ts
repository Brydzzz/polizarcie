import { NextAuthConfig } from "next-auth";
import { Provider } from "next-auth/providers";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const providers: Provider[] = [Google, GitHub];

export const authConfig = {
  providers: providers,
} satisfies NextAuthConfig;
