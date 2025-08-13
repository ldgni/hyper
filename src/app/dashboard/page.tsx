import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Redirect to the main page since dashboard content is now integrated there
  redirect("/");
}
