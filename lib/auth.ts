import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import GitHub from "next-auth/providers/github";

import db from "@/lib/db/db";
import { authSchema } from "@/lib/schema";
import { verifyPassword } from "@/lib/password";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Credentials({
      // GitHub,
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = authSchema.parse(credentials);

        const user = await db.user.findUnique({
          where: {
            email: validatedCredentials.email.trim().toLocaleLowerCase(),
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials.");
        }

        // Verify the password against the hashed password
        const passwordMatch = await verifyPassword(
          validatedCredentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
