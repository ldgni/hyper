import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const { error } = await searchParams;

  const getErrorMessage = (error: string | undefined) => {
    switch (error) {
      case "AccessDenied":
        return "You need an approved early access request to sign in. Please request early access first.";
      case "Verification":
        return "The sign in link is no longer valid. It may have been used already or it may have expired.";
      case "Configuration":
        return "There is a problem with the server configuration.";
      default:
        return "An error occurred during sign in. Please try again.";
    }
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign In Error</CardTitle>
        <CardDescription>There was a problem signing you in.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
        <div className="space-y-2 text-center">
          <Link
            href="/login"
            className="block text-sm text-blue-600 hover:underline">
            ← Try signing in again
          </Link>
          {error === "AccessDenied" && (
            <Link
              href="/"
              className="block text-sm text-blue-600 hover:underline">
              Request early access →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
