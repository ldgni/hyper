import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

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

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

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
