import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface CustomSession {
  user?: {
    email?: string | null;
  };
}

export async function checkAdminAccess() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (await getServerSession(authOptions as any)) as CustomSession;

  if (!session?.user?.email) {
    return { isAdmin: false, user: null };
  }

  // Use Prisma query instead of raw SQL to handle column name mapping
  const userResult = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, isAdmin: true },
  });

  return {
    isAdmin: userResult?.isAdmin || false,
    user: userResult || null,
  };
}

export async function requireAdmin() {
  const { isAdmin, user } = await checkAdminAccess();

  if (!isAdmin) {
    throw new Error("Admin access required");
  }

  return user;
}
