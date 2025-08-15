import { NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin";
import {
  sendEarlyAccessApprovalEmail,
  sendEarlyAccessRevokedEmail,
} from "@/lib/email";
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
} from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { approvalSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check admin access - this will throw if not admin
    await requireAdmin();

    const { id } = await params;
    const body = await request.json();
    const { approved } = approvalSchema.parse(body);

    // Check if the request exists
    const existingRequest = await prisma.earlyAccessRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return createErrorResponse("Early access request not found", 404);
    }

    // Update the approval status
    const updatedRequest = await prisma.earlyAccessRequest.update({
      where: { id },
      data: { approved },
    });

    // Send approval email if approved for the first time
    if (approved && !existingRequest.approved) {
      try {
        await sendEarlyAccessApprovalEmail(
          updatedRequest.name,
          updatedRequest.email,
        );
      } catch (error) {
        console.error("Failed to send approval email:", error);
        // Continue with the response even if email fails
      }
    }

    // Send revocation email if access is being revoked
    if (!approved && existingRequest.approved) {
      try {
        await sendEarlyAccessRevokedEmail(
          updatedRequest.name,
          updatedRequest.email,
        );
      } catch (error) {
        console.error("Failed to send revocation email:", error);
        // Continue with the response even if email fails
      }
    }

    return createSuccessResponse(
      updatedRequest,
      `Request ${approved ? "approved" : "rejected"} successfully`,
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check admin access - this will throw if not admin
    await requireAdmin();

    const { id } = await params;

    // Check if the request exists
    const existingRequest = await prisma.earlyAccessRequest.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return createErrorResponse("Early access request not found", 404);
    }

    // Use a transaction to delete both the early access request and the user
    await prisma.$transaction(async (prisma) => {
      // Delete the early access request
      await prisma.earlyAccessRequest.delete({
        where: { id },
      });

      // Delete the corresponding user if one exists
      const existingUser = await prisma.user.findUnique({
        where: { email: existingRequest.email },
      });

      if (existingUser) {
        await prisma.user.delete({
          where: { email: existingRequest.email },
        });
      }
    });

    return createSuccessResponse(
      null,
      "Request and associated user deleted successfully",
    );
  } catch (error) {
    return handleApiError(error);
  }
}
