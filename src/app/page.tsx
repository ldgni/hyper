import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import { DashboardContent } from "@/components/dashboard-content";
import { EarlyAccessForm } from "@/components/early-access-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // If user is logged in, show dashboard content
  if (session?.user?.email) {
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

  // If user is not logged in, show early access form
  return (
    <>
      <p className="mb-4">
        A place to save and organize your favorite links. Currently invite-only.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="cursor-pointer">Request early access</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request early access</DialogTitle>
            <DialogDescription>
              Hyper is currently invite-only.
            </DialogDescription>
          </DialogHeader>
          <EarlyAccessForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
