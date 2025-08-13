import { notFound } from "next/navigation";

import { AdminRequestsTable } from "@/components/admin-requests-table";
import { checkAdminAccess } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

async function getEarlyAccessRequests() {
  try {
    const requests = await prisma.earlyAccessRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return requests;
  } catch (error) {
    console.error("Error fetching early access requests:", error);
    return [];
  }
}

export default async function AdminPage() {
  const { isAdmin } = await checkAdminAccess();

  if (!isAdmin) {
    notFound();
  }

  const requests = await getEarlyAccessRequests();

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">
          Manage early access requests
        </p>
      </div>

      <div className="rounded-md">
        <AdminRequestsTable requests={requests} />
      </div>
    </div>
  );
}
