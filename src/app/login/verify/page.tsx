import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyRequestPage() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          A sign in link has been sent to your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="mb-4 text-4xl">📧</div>
          <p className="text-muted-foreground text-sm">
            Check your email and click the link to sign in to your account.
          </p>
        </div>
        <div className="text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:underline">
            ← Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
