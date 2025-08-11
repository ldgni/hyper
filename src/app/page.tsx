import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <p className="mb-4">
        A place to save and organize your favorite links. Currently invite-only.
      </p>
      <Button className="cursor-pointer">Request early access</Button>
    </>
  );
}
