import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function HomePage() {
  return (
    <>
      <p className="mb-4">
        A place to save and organize your favorite links. Currently invite-only.
      </p>
      <Dialog>
        <form>
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
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" placeholder="Enter your name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email-1">Email</Label>
                <Input
                  id="email-1"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="message-1">Message</Label>
                <Textarea
                  id="message-1"
                  name="message"
                  placeholder="Why are you interested?"
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="cursor-pointer">
                Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
