import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { ZodError } from "zod";
import { authConfig } from "./auth.config";
import { getUserWithPasswordHashByEmail } from "./lib/db/server-only";
import { getUserByEmail } from "./lib/db/users";
import { signInSchema } from "./lib/zod/users";
import { verifyPassword } from "./utils/misc.server-only";

const providers = [
  ...authConfig.providers,
  Nodemailer({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  }),
  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      try {
        const { email, password } = await signInSchema.parseAsync(credentials);
        const user = await getUserWithPasswordHashByEmail(email);
        if (!user || !user.passwordHash || !user.emailVerified) return null;
        const result = await verifyPassword(
          password,
          Buffer.from(user.passwordHash.hash, "base64")
        );
        if (!result) return null;
        return await getUserByEmail(email);
      } catch (error) {
        if (error instanceof ZodError) {
          return null;
        }
        console.log(error);

        throw error;
      }
    },
  }),
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/sign-in",
  },
  providers: [...providers],
});
