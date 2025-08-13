import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "noreply@yourdomain.com",
            to: email,
            subject: "Sign in to Hyper",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <title>Sign in to Hyper</title>
                </head>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h1 style="color: #333; margin: 0;">Welcome to Hyper!</h1>
                  </div>
                  
                  <div style="background: white; padding: 30px; border-radius: 10px; border: 1px solid #e0e0e0;">
                    <h2 style="color: #333; margin-top: 0;">Sign in to your account</h2>
                    <p style="color: #666; line-height: 1.6;">Click the button below to sign in to your Hyper account. This link will expire in 24 hours.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${url}" style="display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Sign in to Hyper
                      </a>
                    </div>
                    
                    <p style="color: #888; font-size: 14px; margin-top: 30px;">
                      If you didn't request this email, you can safely ignore it.
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                    <p>© 2025 Hyper. All rights reserved.</p>
                  </div>
                </body>
              </html>
            `,
          });
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
  },
  callbacks: {
    async signIn({ user }: { user: Record<string, unknown> }) {
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
      session: Record<string, unknown>;
      user: Record<string, unknown>;
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
