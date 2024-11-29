import { prisma } from "@/utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig } from "next-auth";
import { Provider } from "next-auth/providers";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const providers: Provider[] = [
  Google,
  GitHub,
  // Nodemailer({
  //   server: {
  //     host: process.env.EMAIL_SERVER_HOST,
  //     port: process.env.EMAIL_SERVER_PORT,
  //     auth: {
  //       user: process.env.EMAIL_SERVER_USER,
  //       pass: process.env.EMAIL_SERVER_PASSWORD,
  //     },
  //   },
  //   from: process.env.EMAIL_FROM,
  // }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const authConfig = {
  providers: providers,
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
