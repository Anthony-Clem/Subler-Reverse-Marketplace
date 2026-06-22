import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { accounts, sessions, users, verificationTokens } from "../db/schema";
import { eq, and } from "drizzle-orm";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users as any,
    accountsTable: accounts as any,
    sessionsTable: sessions as any,
    verificationTokensTable: verificationTokens as any,
  }),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const code = (credentials.code as string).trim();

        // 1. Find and verify verification token (OTP)
        const tokenRecord = await db.query.verificationTokens.findFirst({
          where: and(
            eq(verificationTokens.identifier, email),
            eq(verificationTokens.token, code)
          ),
        });

        if (!tokenRecord || tokenRecord.expires < new Date()) {
          throw new Error("Invalid or expired verification code.");
        }

        // Delete the token immediately
        await db
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, email),
              eq(verificationTokens.token, code)
            )
          );

        // 2. Fetch or create user
        let user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });

        if (!user) {
          const inserted = await db
            .insert(users)
            .values({
              email,
              role: "renter",
              hostStatus: null,
            })
            .returning();
          user = inserted[0];
        }

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
