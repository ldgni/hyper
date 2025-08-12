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

export default function HomePage() {
  return (
    <>
      <p className="mb-4">
        A place to save and organize your favorite links. Currently invite-only.
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="cursor-pointer">
            Request early access
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request early access</DialogTitle>
            <DialogDescription>
              Path is currently invite-only.
            </DialogDescription>
          </DialogHeader>
          <EarlyAccessForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
