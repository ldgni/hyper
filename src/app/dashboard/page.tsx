import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { DashboardContent } from "@/components/dashboard-content";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get the user from the database to ensure we have the id
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch user's links
  const links = await prisma.link.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <DashboardContent user={user} links={links} />;
}
