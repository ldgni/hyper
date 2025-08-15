import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import {
  createErrorResponse,
  createSuccessResponse,
  handleApiError,
} from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { linkSchema } from "@/lib/validations";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return createErrorResponse("Authentication required", 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = linkSchema.parse(body);

    // Find the link and verify ownership
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      return createErrorResponse("Link not found", 404);
    }

    if (link.userId !== user.id) {
      return createErrorResponse("You can only edit your own links", 403);
    }

    // Update the link
    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return createSuccessResponse(updatedLink, "Link updated successfully");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return createErrorResponse("Authentication required", 401);
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return createErrorResponse("User not found", 404);
    }

    const { id } = await params;

    // Find the link and verify ownership
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      return createErrorResponse("Link not found", 404);
    }

    if (link.userId !== user.id) {
      return createErrorResponse("You can only delete your own links", 403);
    }

    // Delete the link
    await prisma.link.delete({
      where: { id },
    });

    return createSuccessResponse(null, "Link deleted successfully");
  } catch (error) {
    return handleApiError(error);
  }
}
