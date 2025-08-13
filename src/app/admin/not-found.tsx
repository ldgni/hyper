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

export default function AdminNotFound() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Admin Access Required</CardTitle>
        <CardDescription>
          You need admin privileges to access this area.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This page is restricted to administrators only.
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
