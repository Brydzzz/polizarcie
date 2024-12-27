import { prisma } from "@/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import { ZodError } from "zod";
import { authConfig, verificationMailHTML } from "./auth.config";
import { getUserByEmail } from "./lib/db/users";
import { getUserWithPasswordHashByEmail } from "./lib/db/users.server-only";
import { signInSchema } from "./lib/zod/users";
import { verifyPassword } from "./utils/misc";

const providers = [
  ...authConfig.providers,
  Nodemailer({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT || ""),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
    sendVerificationRequest: async (params) => {
      const { identifier, url, provider } = params;
      const { host } = new URL(url);
      // NOTE: You are not required to use `nodemailer`, use whatever you want.
      const transport = createTransport(provider.server);
      const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Potwierdź swój adres email`,
        text: `Potwierdź swój adres email w serwisie Poliżarcie\n${url}\n\n`,
        html: verificationMailHTML({ url }),
      });
      const failed = result.rejected.concat(result.pending).filter(Boolean);
      if (failed.length) {
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
      }
    },
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
