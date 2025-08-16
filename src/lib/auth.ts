import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";

import { sendLoginEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      // Magic link expires after 10 minutes
      maxAge: 10 * 60, // 10 minutes in seconds
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await sendLoginEmail(email, url);
          console.log(`Magic link sent to ${email}`);
        } catch (error) {
          console.error("Error sending magic link:", error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: "database" as const,
    // Session expires after 8 hours of inactivity
    maxAge: 8 * 60 * 60, // 8 hours in seconds
  },
  callbacks: {
    async signIn({
      user,
    }: {
      user: { email?: string | null; name?: string | null };
    }) {
      // Check if the user has an approved early access request
      if (user.email) {
        const earlyAccessRequest = await prisma.earlyAccessRequest.findUnique({
          where: { email: user.email as string },
        });

        if (!earlyAccessRequest || !earlyAccessRequest.approved) {
          return false; // Deny access if not approved
        }

        // If this is the user's first sign in, copy name from early access request
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser && earlyAccessRequest.name) {
          // Set the name for NextAuth to use when creating the user
          user.name = earlyAccessRequest.name;
        }
      }

      return true;
    },
    async session({
      session,
      user,
    }: {
      session: {
        expires: string;
        user?: {
          email?: string | null;
          name?: string | null;
          image?: string | null;
          id?: string;
          isAdmin?: boolean;
        };
      };
      user: { id: string };
    }) {
      if (session?.user) {
        // Fetch the full user data to get admin status
        const userData = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { isAdmin: true },
        });

        const isAdmin = userData?.isAdmin || false;

        // Extend the session user object with the database user data
        session.user = {
          ...session.user,
          id: user.id,
          isAdmin: isAdmin,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
    error: "/login/error",
  },
};
