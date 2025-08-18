"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface EarlyAccessRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminRequestsTableProps {
  requests: EarlyAccessRequest[];
}

export function AdminRequestsTable({ requests }: AdminRequestsTableProps) {
  const [localRequests, setLocalRequests] = useState(requests);
  const [loadingApprovals, setLoadingApprovals] = useState<Set<string>>(
    new Set(),
  );
  const [loadingDeletes, setLoadingDeletes] = useState<Set<string>>(new Set());

  const handleApprovalAction = async (id: string, approved: boolean) => {
    setLoadingApprovals((prev) => new Set([...prev, id]));

    try {
      const response = await fetch(`/api/admin/early-access/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ approved }),
      });

      if (!response.ok) {
        throw new Error("Failed to update request");
      }

      // Update local state
      setLocalRequests((prev) =>
        prev.map((request) =>
          request.id === id ? { ...request, approved } : request,
        ),
      );
    } catch (error) {
      console.error("Error updating request:", error);
      // You might want to show a toast notification here
    } finally {
      setLoadingApprovals((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDeleteRequest = async (id: string) => {
    setLoadingDeletes((prev) => new Set([...prev, id]));

    try {
      const response = await fetch(`/api/admin/early-access/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete request");
      }

      // Remove the request from local state
      setLocalRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error) {
      console.error("Error deleting request:", error);
      // You might want to show a toast notification here
    } finally {
      setLoadingDeletes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  if (localRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No early access requests</CardTitle>
          <CardDescription>
            No early access requests have been submitted yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {localRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate text-lg">
                  {request.name}
                </CardTitle>
                <CardDescription className="truncate">
                  {request.email}
                </CardDescription>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${
                    request.approved
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                  {request.approved ? "Approved" : "Pending"}
                </span>
                <Button
                  onClick={() => handleDeleteRequest(request.id)}
                  disabled={loadingDeletes.has(request.id)}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-8 w-8 cursor-pointer p-0 transition hover:scale-105">
                  {loadingDeletes.has(request.id) ? (
                    <Spinner size="sm" />
                  ) : (
                    <Trash2 />
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-muted-foreground mb-2 text-sm">Message:</p>
              <p className="text-sm">{request.message}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {!request.approved && (
                  <Button
                    onClick={() => handleApprovalAction(request.id, true)}
                    disabled={loadingApprovals.has(request.id)}
                    size="sm"
                    className="cursor-pointer bg-green-600 hover:bg-green-700">
                    {loadingApprovals.has(request.id) ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>Approving...</span>
                      </div>
                    ) : (
                      "Approve"
                    )}
                  </Button>
                )}

                {request.approved && (
                  <Button
                    onClick={() => handleApprovalAction(request.id, false)}
                    disabled={loadingApprovals.has(request.id)}
                    variant="destructive"
                    size="sm"
                    className="cursor-pointer">
                    {loadingApprovals.has(request.id) ? (
                      <div className="flex items-center gap-2">
                        <Spinner size="sm" />
                        <span>Revoking...</span>
                      </div>
                    ) : (
                      "Revoke"
                    )}
                  </Button>
                )}
              </div>
              <span className="text-muted-foreground text-sm whitespace-nowrap">
                {request.createdAt.toLocaleDateString("en-GB")}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
